
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { Zap, Mail, Lock, User as UserIcon, AtSign, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await authService.login(email, password);
      } else {
        user = await authService.register(fullName, email, password, handle);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
        // Use the mock user credentials created in authService
        const user = await authService.login('arivera@space.social', 'password');
        onLogin(user);
    } catch (err) {
        setError('Demo login failed');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-5xl h-[600px] bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 flex overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 p-12 flex-col justify-between relative border-r border-white/5">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           
           <div className="relative z-10">
             <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-6">
                <Zap className="w-6 h-6 fill-current" />
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter mb-4">SPACE</h1>
             <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
               The source-first social platform for the next generation of creators and thinkers.
             </p>
           </div>

           <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Lock className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-white font-bold text-sm">Secure & Private</h4>
                    <p className="text-slate-500 text-xs">End-to-end encrypted channels.</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                 <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400"><Zap className="w-5 h-5" /></div>
                 <div>
                    <h4 className="text-white font-bold text-sm">AI Powered</h4>
                    <p className="text-slate-500 text-xs">Smart feed synthesis and fact-checking.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                {isLogin ? 'Enter your details to access your space.' : 'Join the community today.'}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center text-red-600 dark:text-red-400 text-sm font-bold">
                   <AlertCircle className="w-4 h-4 mr-2" />
                   {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="group relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-900 dark:text-white"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="group relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Handle (e.g. spaceman)" 
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-900 dark:text-white"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-900 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-900 dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 dark:hover:bg-teal-400 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="ml-2 text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>

              {/* Demo Login Shortcut */}
              {isLogin && (
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                      <button 
                        onClick={handleDemoLogin}
                        className="text-xs font-black uppercase text-slate-400 hover:text-teal-600 transition-colors tracking-widest"
                      >
                          Skip: Login as Demo User
                      </button>
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
