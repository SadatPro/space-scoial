
import React, { useState } from 'react';
import { ShoppingBag, Plus, Image as ImageIcon, Sparkles, Check, ChevronLeft, Package, Banknote, Tag } from 'lucide-react';
import { Product } from '../types';

interface SellViewProps {
  onBack: () => void;
  onProductListed: (product: Product) => void;
}

export const SellView: React.FC<SellViewProps> = ({ onBack, onProductListed }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'General',
    imageUrl: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ['Tech Gadgets', 'Smart Home', 'Fashion', 'Health & Fitness', 'Kitchen Tech', 'General'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newProduct: Product = {
        id: `user_prod_${Date.now()}`,
        name: formData.name,
        price: formData.price.startsWith('৳') ? formData.price : `৳${formData.price}`,
        rating: 5.0,
        imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/800/800`,
        sourceName: 'Space User',
        sourceUrl: '#',
        category: formData.category,
        isUserListing: true,
        status: 'active'
      };
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onProductListed(newProduct);
      }, 1500);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl animate-in zoom-in duration-300 rounded-[3rem]">
        <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-teal-500/20 mb-6">
          <Check className="w-12 h-12 stroke-[3]" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Product Listed!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Your item is now visible in the community marketplace.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center space-x-4 mb-10">
        <button onClick={onBack} className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-teal-50 transition-all border border-white/50 dark:border-slate-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Sell a Product</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">List your item for the community to discover.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Side */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-white/60 dark:border-slate-800 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                <Package className="w-4 h-4 mr-2" /> Product Name
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g. Mechanical Keyboard"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                  <Banknote className="w-4 h-4 mr-2" /> Price (৳)
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="2990"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                  <Tag className="w-4 h-4 mr-2" /> Category
                </label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" /> Image URL
              </label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-5 rounded-3xl font-black text-white shadow-2xl flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 ${
                isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 shadow-slate-900/20 hover:shadow-teal-500/30'
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>List Product</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Side */}
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-12">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 px-4">Live Preview</h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white dark:border-slate-800 relative group">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-teal-600 px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm uppercase tracking-wider border border-white/50 dark:border-slate-800">
                    User Listing
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-2xl leading-tight truncate pr-4">
                    {formData.name || 'Your Product Title'}
                  </h3>
                  <div className="text-teal-600 font-black text-2xl">
                    {formData.price ? (formData.price.startsWith('৳') ? formData.price : `৳${formData.price}`) : '৳0.00'}
                  </div>
                </div>
                <div className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">
                  {formData.category}
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-teal-50 dark:bg-teal-900/10 rounded-3xl p-6 border border-teal-100 dark:border-teal-900/20">
               <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-teal-600 shadow-sm"><Sparkles className="w-6 h-6" /></div>
                  <p className="text-sm text-teal-800 dark:text-teal-400 font-bold leading-relaxed">
                    AI Boost: Your listing will be featured in the discovery feed for users interested in <span className="underline">{formData.category}</span>.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
