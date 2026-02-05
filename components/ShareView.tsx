
import React, { useState, useRef } from 'react';
import { 
  Code, 
  FileUp, 
  Link, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  FileText, 
  X,
  Download,
  Loader2,
  Terminal,
  FileCode,
  Image as ImageIcon,
  QrCode
} from 'lucide-react';

interface SharedItem {
  id: string;
  type: 'code' | 'file';
  name: string;
  url: string;
  timestamp: string;
  size?: string;
  language?: string;
}

export const ShareView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'file'>('code');
  const [codeContent, setCodeContent] = useState('');
  const [codeLang, setCodeLang] = useState('javascript');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [history, setHistory] = useState<SharedItem[]>([
    { id: '1', type: 'code', name: 'Auth Middleware', language: 'typescript', url: 'https://space.social/s/x9k2m1', timestamp: '2h ago' },
    { id: '2', type: 'file', name: 'Project_Proposal.pdf', size: '2.4 MB', url: 'https://space.social/s/p4l9n2', timestamp: '5h ago' }
  ]);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if ((activeTab === 'code' && !codeContent.trim()) || (activeTab === 'file' && !selectedFile)) return;

    setIsGenerating(true);
    setGeneratedLink(null);

    // Mock API call
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(7);
      const newLink = `https://space.social/s/${uniqueId}`;
      
      const newItem: SharedItem = {
        id: Date.now().toString(),
        type: activeTab,
        name: activeTab === 'code' ? 'Untitled Snippet' : selectedFile?.name || 'File',
        url: newLink,
        timestamp: 'Just now',
        size: activeTab === 'file' ? (selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '0 KB') : undefined,
        language: activeTab === 'code' ? codeLang : undefined
      };

      setHistory([newItem, ...history]);
      setGeneratedLink(newLink);
      setIsGenerating(false);
      
      // Reset inputs
      if (activeTab === 'code') setCodeContent('');
      if (activeTab === 'file') setSelectedFile(null);
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGeneratedLink(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
            <Share2 className="w-10 h-10 mr-4 text-teal-600" />
            Quick Share
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Instantly create links for code snippets and files.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Creation Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex space-x-1">
            <button 
              onClick={() => { setActiveTab('code'); setGeneratedLink(null); }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'code' 
                ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code Snippet</span>
            </button>
            <button 
              onClick={() => { setActiveTab('file'); setGeneratedLink(null); }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'file' 
                ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}
            >
              <FileUp className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col relative">
            
            {activeTab === 'code' && (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Editor</span>
                  </div>
                  <select 
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none text-slate-700 dark:text-slate-300"
                    value={codeLang}
                    onChange={(e) => setCodeLang(e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>
                <textarea 
                  className="flex-1 w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-4 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 outline-none resize-none border-2 border-transparent focus:border-teal-500/20 transition-all placeholder-slate-400"
                  placeholder="// Paste your code here..."
                  spellCheck={false}
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'file' && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 transition-all hover:border-teal-400 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect} 
                />
                {selectedFile ? (
                  <div className="text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-4">
                      {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{selectedFile.name}</h3>
                    <p className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="mt-4 text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform group-hover:text-teal-500">
                      <FileUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Click to upload or drag and drop</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">SVG, PNG, JPG, PDF or any code files (max. 10MB)</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || (activeTab === 'code' && !codeContent) || (activeTab === 'file' && !selectedFile)}
                className={`px-8 py-3 rounded-xl font-black flex items-center space-x-2 transition-all shadow-lg ${
                  isGenerating || (activeTab === 'code' && !codeContent) || (activeTab === 'file' && !selectedFile)
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-teal-600 dark:hover:bg-teal-400 hover:shadow-teal-500/20 hover:-translate-y-0.5'
                }`}
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link className="w-5 h-5" />}
                <span>{isGenerating ? 'Creating Link...' : 'Create Link'}</span>
              </button>
            </div>

            {/* Generated Link Overlay */}
            {generatedLink && (
              <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Ready to Share!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-sm">Your content has been securely packaged.</p>
                
                {/* QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 mb-6">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generatedLink)}`} 
                        alt="QR Code" 
                        className="w-32 h-32 rounded-lg"
                    />
                </div>

                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-2 pl-6 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
                  <span className="flex-1 font-mono text-sm text-slate-600 dark:text-slate-300 truncate">{generatedLink}</span>
                  <button 
                    onClick={() => handleCopy(generatedLink)}
                    className={`p-3 rounded-xl transition-all ${
                      isCopied 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 shadow-sm'
                    }`}
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                
                <button 
                  onClick={() => setGeneratedLink(null)} 
                  className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Create Another
                </button>
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full max-h-[600px] flex flex-col">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" /> Recent Shares
            </h3>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {history.map(item => (
                <div key={item.id} className="group p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className={`p-2 rounded-lg ${item.type === 'code' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {item.type === 'code' ? <FileCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.type === 'code' ? item.language : item.size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{item.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input 
                      type="text" 
                      readOnly 
                      value={item.url} 
                      className="flex-1 bg-slate-100 dark:bg-slate-900 text-[10px] px-2 py-1.5 rounded-lg text-slate-500 outline-none" 
                    />
                    <button 
                      onClick={() => handleCopy(item.url)}
                      className="p-1.5 bg-white dark:bg-slate-700 rounded-lg text-slate-500 hover:text-teal-600 shadow-sm transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm font-medium">No history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
