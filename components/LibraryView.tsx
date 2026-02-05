
import React, { useState } from 'react';
import { Book } from '../types';
import { MOCK_BOOKS } from '../services/mockData';
import { 
  BookOpen, 
  Headphones, 
  Search, 
  Star, 
  ShoppingBag, 
  Download, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Clock,
  Book as BookIcon,
  X,
  CreditCard,
  CheckCircle2,
  FileText,
  Library,
  Store,
  ArrowRight
} from 'lucide-react';

const BookCard: React.FC<{ book: Book, onReadClick: () => void, isStore: boolean }> = ({ book, onReadClick, isStore }) => (
    <div onClick={onReadClick} className="flex flex-col group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-100 mb-3 md:mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
        <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 md:p-4 flex flex-col justify-end">
          {isStore ? (
             <div className="flex items-center justify-center space-x-2 w-full bg-slate-900 text-white py-2 md:py-2.5 rounded-lg font-bold text-[10px] md:text-xs">
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                <span>Buy</span>
             </div>
          ) : (
             book.type === 'ebook' ? (
                <div className="flex items-center justify-center space-x-2 w-full bg-white text-slate-900 py-2 md:py-2.5 rounded-lg font-bold text-[10px] md:text-xs">
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Read PDF</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 w-full bg-white text-slate-900 py-2 md:py-2.5 rounded-lg font-bold text-[10px] md:text-xs">
                  <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                  <span>Listen</span>
                </div>
              )
          )}
        </div>
      </div>
      <h3 className="font-bold text-slate-900 text-xs md:text-sm leading-snug line-clamp-2">{book.title}</h3>
      <p className="text-[10px] md:text-xs text-slate-500 mt-1">{book.author}</p>
      {isStore && (
          <div className="mt-1 md:mt-2 font-black text-xs md:text-sm text-teal-600">
              {book.price === 0 ? 'FREE' : `৳${book.price}`}
          </div>
      )}
    </div>
);

const BookDetailModal: React.FC<{
  book: Book;
  onClose: () => void;
  onPurchase: () => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  isStore: boolean;
}> = ({ book, onClose, onPurchase, isPlaying, onPlayToggle, isStore }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0"></div>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-4xl h-auto md:h-[600px] max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row overflow-hidden border border-white/40"
      >
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-slate-100/80 backdrop-blur-sm hover:bg-slate-200 rounded-full transition-all text-slate-600">
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full md:w-2/5 h-56 md:h-full relative shrink-0">
          <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        </div>

        <div className="flex-1 p-6 md:p-12 flex flex-col overflow-y-auto no-scrollbar">
          <div className="mb-4 md:mb-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                book.type === 'ebook' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
            }`}>
                {book.type === 'ebook' ? 'PDF / E-Book' : 'Audiobook'}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1 md:mb-2">{book.title}</h1>
          <h2 className="text-base md:text-lg font-bold text-slate-500 mb-4 md:mb-6">{book.author}</h2>
          
          <div className="flex items-center space-x-4 mb-6 md:mb-8 text-sm">
            <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current mr-1.5" /> {book.rating}
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <div className="flex items-center text-slate-500 font-medium">
                {book.type === 'ebook' 
                    ? <><BookOpen className="w-4 h-4 mr-1.5" /> {book.pages} Pages</>
                    : <><Clock className="w-4 h-4 mr-1.5" /> {book.duration}</>
                }
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6 md:mb-8 flex-1 text-sm md:text-base">{book.description}</p>
          
          {!isStore && book.type === 'audiobook' && (
            <div className="bg-slate-50 rounded-3xl p-4 md:p-6 mb-6 md:mb-8 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">Now Playing</span>
                    <Headphones className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                      onClick={onPlayToggle}
                      className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-teal-600 transition-colors shrink-0"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />}
                    </button>
                    <div className="flex-1">
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-teal-500"></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                            <span>1:12:30</span>
                            <span>{book.duration}</span>
                        </div>
                    </div>
                </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {isStore ? (
                <button 
                  onClick={onPurchase}
                  className="flex-1 flex items-center justify-center space-x-3 bg-slate-900 text-white px-6 py-3.5 md:py-4 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all text-xs md:text-sm"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{book.price === 0 ? 'ADD TO LIBRARY (FREE)' : `BUY NOW - ৳${book.price}`}</span>
                </button>
            ) : (
                <button 
                  className="flex-1 flex items-center justify-center space-x-3 bg-slate-900 text-white px-6 py-3.5 md:py-4 rounded-2xl font-black shadow-lg hover:bg-teal-600 transition-all text-xs md:text-sm"
                >
                  {book.type === 'ebook' ? <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
                  <span>{book.type === 'ebook' ? 'READ PDF' : 'PLAY AUDIO'}</span>
                </button>
            )}
            
            <button className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-600 px-6 py-3.5 md:py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all text-xs md:text-sm">
                <Download className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl animate-in zoom-in-95 w-full max-w-sm">
          <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900">Purchase Complete!</h3>
          <p className="text-slate-500 mt-2 mb-6">Your book has been added to your library.</p>
          <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold w-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X/></button>
        <h3 className="text-2xl font-black text-slate-900 mb-6">Confirm Purchase</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Card Number" className="w-full p-4 bg-slate-50 rounded-xl font-medium outline-none text-slate-900" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="MM/YY" className="w-full p-4 bg-slate-50 rounded-xl font-medium outline-none text-slate-900" />
            <input type="text" placeholder="CVC" className="w-full p-4 bg-slate-50 rounded-xl font-medium outline-none text-slate-900" />
          </div>
        </div>
        <button onClick={() => setIsSuccess(true)} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Pay Now</span>
        </button>
      </div>
    </div>
  );
}

export const LibraryView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'library' | 'store'>('library');
  const [activeTab, setActiveTab] = useState<'all' | 'ebook' | 'audiobook'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Filter books based on View Mode (Owned vs Not Owned)
  const filteredBooks = MOCK_BOOKS.filter(b => {
    const isOwned = b.isOwned;
    const matchesViewMode = viewMode === 'library' ? isOwned : !isOwned;
    const matchesTab = activeTab === 'all' || b.type === activeTab;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesViewMode && matchesTab && matchesSearch;
  });

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handlePurchase = () => {
    if (selectedBook?.price === 0) {
      alert("Added to your library for free!");
      setSelectedBook(null);
    } else {
      setShowCheckout(true);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 pb-24 min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-6">
        <div className="flex items-center space-x-4 md:space-x-6">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-teal-400 shadow-2xl">
             <BookIcon className="w-6 h-6 md:w-8 md:h-8" />
           </div>
           <div>
             <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Space Library</h1>
             <p className="text-slate-500 font-medium text-sm md:text-base">Read, listen, and expand your mind.</p>
           </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Search authors, titles..."
            className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
        </div>
      </div>

      {/* Main View Toggle (Library vs Store) */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-2xl w-full md:w-auto mb-6 md:mb-8">
          <button 
            onClick={() => setViewMode('library')}
            className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-xl flex items-center justify-center space-x-2 font-black text-xs md:text-sm transition-all ${viewMode === 'library' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:bg-white/50'}`}
          >
              <Library className="w-4 h-4" />
              <span>My Library</span>
          </button>
          <button 
            onClick={() => setViewMode('store')}
            className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-xl flex items-center justify-center space-x-2 font-black text-xs md:text-sm transition-all ${viewMode === 'store' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:bg-white/50'}`}
          >
              <Store className="w-4 h-4" />
              <span>Book Store</span>
          </button>
      </div>

      {/* Content Tabs (Format) */}
      <div className="flex space-x-3 mb-8 overflow-x-auto no-scrollbar pb-1">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap border-2 ${activeTab === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300'}`}
        >
          ALL FORMATS
        </button>
        <button 
          onClick={() => setActiveTab('ebook')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap border-2 ${activeTab === 'ebook' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300'}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF / E-BOOKS</span>
        </button>
        <button 
          onClick={() => setActiveTab('audiobook')}
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap border-2 ${activeTab === 'audiobook' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-300'}`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>AUDIOBOOKS</span>
        </button>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} onReadClick={() => handleBookClick(book)} isStore={viewMode === 'store'} />
            ))}
        </div>
        ) : (
        <div className="text-center py-24 md:py-32 bg-white/50 rounded-[3rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold text-lg md:text-xl mb-2">No books found here.</p>
            <p className="text-slate-500 text-xs md:text-sm">{viewMode === 'library' ? "Visit the Book Store to add titles." : "Try adjusting your search filters."}</p>
            {viewMode === 'library' && (
                <button onClick={() => setViewMode('store')} className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-teal-700 transition-all flex items-center justify-center space-x-2 mx-auto">
                    <span>Go to Store</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </div>
      )}

      {selectedBook && (
        <BookDetailModal 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)}
            onPurchase={handlePurchase}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            isStore={viewMode === 'store'}
        />
      )}
      
      {showCheckout && (
        <CheckoutModal onClose={() => { setShowCheckout(false); setSelectedBook(null); }} />
      )}
    </div>
  );
};
