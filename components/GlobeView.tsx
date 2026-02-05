import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Loader2, 
  Zap, 
  Map as MapIcon, 
  Ghost, 
  Settings, 
  X, 
  Crosshair, 
  Clock, 
  LocateFixed, 
  Send
} from 'lucide-react';
import { User, LocationShare } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { GoogleGenAI } from "@google/genai";

// Declare Leaflet types roughly for TS since we're using CDN
declare global {
  interface Window {
    L: any;
  }
}

interface GlobeViewProps {
  currentUser: User;
}

export const GlobeView: React.FC<GlobeViewProps> = ({ currentUser }) => {
  const [liveLocation, setLiveLocation] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [aiInsight, setAiInsight] = useState<{title: string, summary: string} | null>(null);
  const [selectedUser, setSelectedUser] = useState<LocationShare | null>(null);
  const [friends, setFriends] = useState<LocationShare[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Default center (San Francisco)
  const DEFAULT_CENTER = [37.7749, -122.4194];

  useEffect(() => {
    // Initialize Map
    if (mapContainerRef.current && !mapInstanceRef.current && window.L) {
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(DEFAULT_CENTER, 13);

      // Add Tile Layer (OpenStreetMap CartoDB Dark Matter for "Planate/Locate" feel or generic OSM)
      // Using generic OSM for standard map look as requested
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add Current User Marker
      const userIcon = window.L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="relative flex items-center justify-center w-12 h-12">
                <div class="absolute inset-0 bg-teal-500/30 rounded-full animate-ping"></div>
                <div class="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  <img src="${currentUser.avatarUrl}" class="w-full h-full object-cover" />
                </div>
              </div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      userMarkerRef.current = window.L.marker(DEFAULT_CENTER, { icon: userIcon }).addTo(map);
    }

    generateMockFriends();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Update Friend Markers
    friends.forEach(friend => {
      if (markersRef.current.has(friend.userId)) {
        // Update existing marker position if needed (mock data doesn't move yet, but logic is here)
        return;
      }

      // Convert relative lat/lng from mock to real coordinates near SF for demo
      // Friend 1: Near Union Square
      // Friend 2: Near Golden Gate Park
      // Friend 3: Near Mission District
      let lat = 37.7749;
      let lng = -122.4194;

      if (friend.userId === 'u2') { lat += 0.01; lng += 0.01; }
      if (friend.userId === 'u3') { lat -= 0.015; lng -= 0.02; }
      if (friend.userId === 'u5') { lat += 0.005; lng -= 0.015; }

      // Store real coords on friend object for routing
      (friend as any).realLat = lat;
      (friend as any).realLng = lng;

      const friendIcon = window.L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="relative flex flex-col items-center group">
                 <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white transition-transform hover:scale-110 cursor-pointer">
                   <img src="${friend.avatarUrl}" class="w-full h-full object-cover" />
                 </div>
                 <div class="mt-1 px-2 py-0.5 bg-white/90 rounded-md shadow-sm text-[10px] font-bold text-slate-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                   ${friend.userName}
                 </div>
               </div>`,
        iconSize: [40, 60],
        iconAnchor: [20, 20]
      });

      const marker = window.L.marker([lat, lng], { icon: friendIcon })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          setSelectedUser(friend);
          setIsNavigating(false);
          // Center map on friend
          mapInstanceRef.current.flyTo([lat, lng], 15);
        });

      markersRef.current.set(friend.userId, marker);
    });

  }, [friends]);

  // Handle Route Drawing
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (isNavigating && selectedUser) {
      const start = DEFAULT_CENTER;
      const end = [(selectedUser as any).realLat, (selectedUser as any).realLng];
      
      const latlngs = [start, end];
      
      routeLineRef.current = window.L.polyline(latlngs, {
        color: '#0f766e', // teal-700
        weight: 6,
        opacity: 0.7,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show route
      mapInstanceRef.current.fitBounds(window.L.latLngBounds(latlngs), { padding: [50, 50] });
    }
  }, [isNavigating, selectedUser]);

  const generateMockFriends = () => {
    const mockData: LocationShare[] = [
      {
        userId: 'u2',
        userName: 'Tech Bot',
        avatarUrl: MOCK_USERS[1].avatarUrl,
        lat: 0, lng: 0, // Using real coords in map logic
        distance: '0.8 mi',
        lastActive: 'Active Now',
        status: 'Walking to cafe'
      },
      {
        userId: 'u3',
        userName: 'Sarah Jenkins',
        avatarUrl: MOCK_USERS[2].avatarUrl,
        lat: 0, lng: 0,
        distance: '1.5 mi',
        lastActive: '5m ago',
        status: 'At Central Park'
      },
      {
        userId: 'u5',
        userName: 'Emily Watson',
        avatarUrl: MOCK_USERS[4].avatarUrl,
        lat: 0, lng: 0,
        distance: '2.1 mi',
        lastActive: 'Active Now',
        status: 'Driving'
      }
    ];
    setFriends(mockData);
  };

  const handleScanArea = async () => {
    setIsScanning(true);
    setAiInsight(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Get center of current map view
      const center = mapInstanceRef.current ? mapInstanceRef.current.getCenter() : { lat: 37.7749, lng: -122.4194 };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Identify 2 trending or useful spots (cafes, parks, events) near coordinates ${center.lat}, ${center.lng}. Keep brief.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: center.lat,
                longitude: center.lng
              }
            }
          }
        }
      });

      setAiInsight({
        title: "Radar Scan Complete",
        summary: response.text || "No trending spots identified in this sector."
      });
    } catch (e) {
      setAiInsight({
        title: "Scan Offline",
        summary: "Could not connect to location services."
      });
    } finally {
      setIsScanning(false);
    }
  };

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_CENTER, 14);
    }
  };

  return (
    <div className="fixed inset-0 top-0 md:top-0 z-0 bg-slate-100 overflow-hidden flex flex-col h-screen md:h-full md:relative font-sans">
      
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0"
        style={{ background: '#e5e7eb' }}
      ></div>

      {/* UI Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex flex-col pointer-events-none z-[400]">
        <div className="flex items-start justify-between pointer-events-auto">
          {/* Header & Search */}
          <div className="flex flex-col space-y-4 w-full max-w-sm">
             <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-white/50">
                <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                   <Navigation className="w-6 h-6 fill-current" />
                </div>
                <div className="flex-1">
                   <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Locate</h1>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Live Social Map</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl"><Settings className="w-5 h-5 text-slate-400" /></button>
             </div>

             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl text-slate-800 placeholder-slate-400 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 shadow-lg transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             </div>
          </div>

          {/* Location Toggles */}
          <div className="flex flex-col space-y-3">
             <button 
                onClick={() => setLiveLocation(!liveLocation)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-lg transition-all border border-white/20 backdrop-blur-md font-bold text-xs uppercase tracking-wider ${liveLocation ? 'bg-teal-500 text-white' : 'bg-white text-slate-500'}`}
             >
                {liveLocation ? <Zap className="w-4 h-4 fill-current animate-pulse" /> : <Ghost className="w-4 h-4" />}
                <span className="hidden md:inline">{liveLocation ? 'Live Sharing' : 'Ghost Mode'}</span>
             </button>
             <button 
                onClick={recenterMap}
                className="bg-white p-3 rounded-2xl shadow-lg text-slate-700 hover:bg-slate-50 transition-all self-end"
             >
                <Crosshair className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet / Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[400] pointer-events-none flex flex-col justify-end p-4 md:p-6">
         
         {/* Navigation Card (If Route Active) */}
         {isNavigating && selectedUser && (
            <div className="bg-slate-900 text-white rounded-3xl p-5 mb-4 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-10 flex items-center justify-between mx-auto max-w-lg w-full">
               <div className="flex items-center space-x-4">
                  <div className="bg-teal-500 p-3 rounded-2xl animate-pulse">
                     <Navigation className="w-6 h-6 fill-current text-white" />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-0.5">Navigating to</div>
                     <div className="text-lg font-black">{selectedUser.userName}</div>
                     <div className="text-xs font-medium text-slate-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> 14 min (Traffic)
                     </div>
                  </div>
               </div>
               <button onClick={() => { setIsNavigating(false); routeLineRef.current?.remove(); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
         )}

         {/* Radar / Scan Button */}
         {!selectedUser && (
            <div className="w-full flex justify-center mb-6 pointer-events-auto">
                <button 
                  onClick={handleScanArea}
                  className="bg-white text-slate-900 px-8 py-3 rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border border-slate-100"
                >
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin text-teal-600" /> : <MapIcon className="w-5 h-5 text-teal-600" />}
                  <span>{isScanning ? 'Scanning Area...' : 'Scan Nearby Places'}</span>
                </button>
            </div>
         )}

         {/* AI Insight Popup */}
         {aiInsight && (
            <div className="mx-auto max-w-md w-full mb-4 pointer-events-auto">
               <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xl flex items-start space-x-3 animate-in slide-in-from-bottom-2">
                  <div className="p-2 bg-teal-50 rounded-xl text-teal-600 shrink-0"><Zap className="w-5 h-5 fill-current" /></div>
                  <div className="flex-1">
                     <h3 className="font-black text-slate-900 text-sm">{aiInsight.title}</h3>
                     <p className="text-xs text-slate-600 mt-1 leading-relaxed">{aiInsight.summary}</p>
                  </div>
                  <button onClick={() => setAiInsight(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
               </div>
            </div>
         )}

         {/* Friends List Tray */}
         <div className="bg-white rounded-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pointer-events-auto max-h-[300px] overflow-hidden flex flex-col border border-white">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>
            
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-black text-slate-900">Nearby Friends</h3>
               <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">{friends.length} Active</span>
            </div>

            <div className="overflow-y-auto no-scrollbar space-y-3 pb-2">
               {friends.map(friend => (
                  <div 
                     key={friend.userId}
                     onClick={() => {
                        setSelectedUser(friend);
                        const lat = (friend as any).realLat;
                        const lng = (friend as any).realLng;
                        if (lat && lng && mapInstanceRef.current) {
                           mapInstanceRef.current.flyTo([lat, lng], 15);
                        }
                     }} 
                     className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                  >
                     <div className="relative">
                        <img src={friend.avatarUrl} className="w-12 h-12 rounded-full shadow-sm group-hover:scale-105 transition-transform" alt="" />
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                           {friend.distance}
                        </div>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{friend.userName}</h4>
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                           <MapPin className="w-3 h-3 mr-1 text-slate-300" /> {friend.status}
                        </div>
                     </div>
                     <button className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all">
                        <LocateFixed className="w-4 h-4" />
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Selected User Modal */}
      {selectedUser && !isNavigating && (
         <div className="absolute inset-0 z-[500] bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 relative mb-4 md:mb-0" onClick={(e) => e.stopPropagation()}>
               <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"><X className="w-5 h-5 text-slate-400" /></button>
               
               <div className="w-24 h-24 mx-auto relative mb-4">
                  <img src={selectedUser.avatarUrl} className="w-full h-full rounded-full border-4 border-white shadow-xl" alt="" />
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
               </div>
               
               <h2 className="text-2xl font-black text-slate-900 mb-1">{selectedUser.userName}</h2>
               <div className="flex items-center justify-center text-slate-500 text-sm font-medium mb-6 space-x-1">
                  <MapPin className="w-3.5 h-3.5" /> 
                  <span>{selectedUser.distance} away</span>
                  <span className="mx-1">•</span>
                  <span>{selectedUser.status}</span>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsNavigating(true)}
                    className="bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4 fill-current" />
                    <span>Route</span>
                  </button>
                  <button className="bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-2xl font-black hover:border-slate-200 transition-all flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Message</span>
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};