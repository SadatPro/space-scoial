
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Search, 
  Tag, 
  Sparkles, 
  Plus, 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Heart,
  ShieldCheck,
  Package,
  Store,
  LayoutDashboard,
  Settings,
  Share2,
  MapPin,
  TrendingUp,
  DollarSign,
  Edit2,
  X,
  Camera
} from 'lucide-react';
import { Product, CartItem, User } from '../types';
import { fetchRealTimeProducts } from '../services/geminiService';
import { SpaceSpinner } from './Loading';
import { SellView } from './SellView';

interface ShopViewProps {
  userProducts: Product[];
  onProductListed: (product: Product) => void;
  currentUser: User;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

const StoreFrontHeader: React.FC<{ user: User }> = ({ user }) => (
  <div className="relative mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden relative group">
      <img 
        src={user.bannerUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80"} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        alt="Store Banner"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
      
      {/* Brand Actions */}
      <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
            <Camera className="w-5 h-5" />
         </button>
         <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
            <Settings className="w-5 h-5" />
         </button>
      </div>
    </div>
    
    <div className="absolute -bottom-14 left-8 md:left-12 flex items-end gap-6 w-[calc(100%-4rem)]">
      <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] p-1.5 bg-white dark:bg-slate-900 shadow-2xl shrink-0 rotate-3 transition-transform hover:rotate-0">
        <img 
          src={user.avatarUrl} 
          className="w-full h-full object-cover rounded-[1.75rem]" 
          alt={user.name} 
        />
      </div>
      
      <div className="flex-1 mb-4 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm">{user.name}</h1>
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-teal-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 fill-current" /> Verified Brand
                </span>
            </div>
        </div>
        <p className="text-slate-200 font-medium text-sm md:text-base max-w-xl line-clamp-1 md:line-clamp-none opacity-90">
           Premium tech gadgets and lifestyle accessories curated by {user.handle}.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> San Francisco, CA</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 Rating (1.2k Reviews)</span>
        </div>
      </div>

      <div className="hidden md:flex gap-3 mb-4">
         <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            <span>Edit Store</span>
         </button>
         <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-black text-sm hover:bg-white/20 transition-all flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
         </button>
      </div>
    </div>
  </div>
);

export const ShopView: React.FC<ShopViewProps> = ({ 
  userProducts, 
  onProductListed, 
  currentUser, 
  cart, 
  onAddToCart, 
  onRemoveFromCart, 
  onClearCart 
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'space' | 'myshop'>('space');
  const [shopMode, setShopMode] = useState<'storefront' | 'dashboard'>('storefront');
  const [isListingItem, setIsListingItem] = useState(false);

  // Space Shop State
  const [aiProducts, setAiProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tech Gadgets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Tech Gadgets', 'Smart Home', 'Fashion', 'Health & Fitness', 'Kitchen Tech'];

  const loadProducts = async (cat: string) => {
    setIsLoading(true);
    const data = await fetchRealTimeProducts(cat);
    await new Promise(r => setTimeout(r, 800)); 
    setAiProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory]);

  const allMarketplaceProducts = useMemo(() => {
    const combined = [...userProducts, ...aiProducts];
    if (!searchQuery.trim()) return combined;
    return combined.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [userProducts, aiProducts, searchQuery]);

  const handleListingComplete = (newProduct: Product) => {
    onProductListed(newProduct);
    setIsListingItem(false);
  };

  const navButtonClass = (isActive: boolean) => 
    `flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
      isActive 
      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 pb-24 min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      
      {/* Top Nav Bar */}
      <div className="sticky top-0 z-30 bg-[#F8FAFC]/90 dark:bg-slate-950/90 backdrop-blur-xl py-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex">
                    <button onClick={() => setActiveTab('space')} className={navButtonClass(activeTab === 'space')}>
                        <Store className="w-4 h-4" />
                        <span>Marketplace</span>
                    </button>
                    <button onClick={() => setActiveTab('myshop')} className={navButtonClass(activeTab === 'myshop')}>
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Brand</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-80 group">
                    <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
                <button 
                    onClick={() => setShowCart(true)}
                    className="relative p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition-all"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      
      {activeTab === 'space' && (
        <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 space-y-8 shrink-0">
             <div>
                <h3 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-6">Categories</h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                   {categories.map(cat => (
                     <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm text-left transition-all border-2 ${
                        activeCategory === cat 
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-lg' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-transparent hover:border-gray-200 dark:hover:border-gray-800'
                      }`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="p-8 bg-teal-50 dark:bg-teal-900/20 rounded-[2.5rem] border border-teal-100 dark:border-teal-900/30">
                <ShieldCheck className="w-8 h-8 text-teal-600 mb-4" />
                <h3 className="font-black text-slate-900 dark:text-white mb-2 leading-tight">Space Verified</h3>
                <p className="text-xs text-teal-800 dark:text-teal-400 font-medium leading-relaxed">
                  All products from external sources are scanned for price fairness and authenticity by Space AI.
                </p>
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="py-40">
                <SpaceSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {allMarketplaceProducts.map(product => (
                  <div key={product.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 dark:border-slate-800 flex flex-col relative">
                     <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                        <div className="absolute top-6 left-6 flex space-x-2">
                           <span className={`backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm uppercase tracking-widest border border-white/50 dark:border-slate-800 ${product.isUserListing ? 'bg-indigo-500/90 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-teal-600'}`}>
                             {product.isUserListing ? 'Community' : 'Verified AI'}
                           </span>
                        </div>
                        <button className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 shadow-sm transition-all">
                           <Heart className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                           <div className="flex items-center space-x-2 mb-2">
                              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{product.category}</span>
                              <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                              <div className="flex items-center text-amber-500">
                                 <Star className="w-3 h-3 fill-current mr-1" />
                                 <span className="text-[10px] font-black">{product.rating}</span>
                              </div>
                           </div>
                           <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-teal-600 transition-colors leading-tight">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="text-2xl font-black text-slate-900 dark:text-white">{product.price.startsWith('৳') ? product.price : `৳${product.price}`}</div>
                           <button 
                             onClick={() => onAddToCart(product)}
                             className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 dark:hover:bg-teal-400 transition-all shadow-lg active:scale-95"
                           >
                              Add to Cart
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'myshop' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           {isListingItem ? (
             <SellView 
               onBack={() => setIsListingItem(false)} 
               onProductListed={handleListingComplete} 
             />
           ) : (
             <>
                <StoreFrontHeader user={currentUser} />
                
                {/* Store Tabs */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Store Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <button 
                                    onClick={() => setShopMode('storefront')}
                                    className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${shopMode === 'storefront' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Storefront
                                </button>
                                <button 
                                    onClick={() => setShopMode('dashboard')}
                                    className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${shopMode === 'dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Dashboard
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setIsListingItem(true)}
                                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-teal-600 dark:hover:bg-teal-400 transition-all flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Product</span>
                            </button>
                        </div>

                        {shopMode === 'dashboard' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-2">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600"><DollarSign className="w-6 h-6" /></div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">+12% vs last month</span>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white">৳24,500</div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600"><Package className="w-6 h-6" /></div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">4 Pending</span>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white">182</div>
                                    </div>
                                </div>
                                <div className="bg-slate-900 dark:bg-teal-900 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-between h-48 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="p-3 bg-white/10 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Store Visits</div>
                                        <div className="text-3xl font-black">8.4k</div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {userProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {userProducts.map(product => (
                                    <div key={product.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                                            {shopMode === 'dashboard' && (
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button className="p-2 bg-white/90 rounded-xl shadow-sm text-slate-600 hover:text-teal-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 truncate">{product.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-teal-600 font-black text-xl">{product.price}</p>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.category}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
                                <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold text-lg">No products listed yet.</p>
                                <button onClick={() => setIsListingItem(true)} className="text-teal-600 font-black uppercase text-xs tracking-widest mt-2 hover:underline">Add your first product</button>
                            </div>
                        )}
                    </div>
                </div>
             </>
           )}
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-2xl text-teal-600">
                       <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart</h2>
                 </div>
                 <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {cart.length > 0 ? (
                   cart.map(item => (
                     <div key={item.product.id} className="flex items-center space-x-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                           <img src={item.product.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                           <p className="text-sm font-black text-teal-600">{item.product.price.startsWith('৳') ? item.product.price : `৳${item.product.price}`}</p>
                           <div className="flex items-center space-x-3 mt-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <ShoppingBag className="w-16 h-16 mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">Cart is Empty</p>
                   </div>
                 )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-gray-800">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">Subtotal</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ৳{cart.reduce((acc, item) => {
                          const price = parseFloat(item.product.price.replace('৳', '').replace('$', '').replace(/,/g, ''));
                          return acc + (price * item.quantity);
                        }, 0).toFixed(2)}
                      </span>
                   </div>
                   <button className="w-full py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-teal-600 dark:hover:bg-teal-400 transition-all flex items-center justify-center space-x-3">
                      <CreditCard className="w-6 h-6" />
                      <span>Proceed to Checkout</span>
                   </button>
                   <button 
                    onClick={onClearCart}
                    className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] hover:text-red-500 transition-colors"
                   >
                     Clear Cart
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
