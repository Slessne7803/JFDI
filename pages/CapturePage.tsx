
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categorizeBrainDump } from '../services/geminiService';
import { BrainItem, UserProfile } from '../types';

interface Props {
  onSave: (item: BrainItem) => void;
  user: UserProfile;
}

type CaptureStep = 'input' | 'processing' | 'review' | 'success';

const CapturePage: React.FC<Props> = ({ onSave, user }) => {
  const [text, setText] = useState('');
  const [step, setStep] = useState<CaptureStep>('input');
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setStep('processing');
    try {
      const result = await categorizeBrainDump(text, user.preferences);
      setAnalyzedData(result);
      setStep('review');
    } catch (e) {
      console.error(e);
      // Fallback: Skip review and just save if AI fails
      const fallbackItem: BrainItem = {
        id: Date.now().toString(),
        type: 'note',
        content: text,
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        category: 'Unsorted',
        timestamp: Date.now(),
        completed: false,
        tags: []
      };
      onSave(fallbackItem);
      navigate('/library');
    }
  };

  const handlePublish = () => {
    if (!analyzedData) return;
    
    const newItem: BrainItem = {
      id: Date.now().toString(),
      type: analyzedData.type,
      content: text,
      title: analyzedData.title,
      category: analyzedData.category,
      timestamp: Date.now(),
      completed: false,
      priority: analyzedData.priority,
      tags: analyzedData.tags
    };
    
    onSave(newItem);
    setStep('success');
    
    // Brief delay for satisfying success animation before navigating
    setTimeout(() => {
      if (newItem.type === 'win') navigate('/wins');
      else if (newItem.type === 'task') navigate('/tasks');
      else navigate('/library');
    }, 1200);
  };

  const handleDiscard = () => {
    setStep('input');
    setAnalyzedData(null);
  };

  // Step narrowed to 'success' via early return
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="size-24 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 animate-bounce">
          <span className="material-symbols-outlined text-5xl">done_all</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-navy-950 dark:text-white">Brain Backed Up!</h2>
          <p className="text-coastal-600 dark:text-white/60 mt-2 font-medium">One less thing to worry about.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-full flex flex-col pb-40 bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-accent-earth/20 p-2 rounded-lg text-accent-earth">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h2 className="text-navy-950 dark:text-white text-xl font-bold tracking-tight">Brain Backup</h2>
        </div>
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full bg-navy-950/5 dark:bg-white/10 dark:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-1 space-y-8">
        {step === 'input' || step === 'processing' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1 mb-6">
              <h1 className="text-navy-950 dark:text-white text-3xl font-bold tracking-tight">What's on your mind?</h1>
              <p className="text-navy-950/60 dark:text-white/60 text-sm">Don't overthink it. Just get it out.</p>
            </div>

            <div className="relative group mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent-earth rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <textarea 
                ref={inputRef}
                autoFocus
                disabled={step === 'processing'}
                className="glass-card flex w-full resize-none overflow-hidden rounded-xl text-navy-950 dark:text-white dark:bg-navy-950/40 focus:ring-2 focus:ring-primary/50 border-none min-h-48 placeholder:text-navy-950/30 dark:placeholder:text-white/20 p-5 text-lg font-normal leading-relaxed disabled:opacity-50"
                placeholder="Just start typing... we'll handle the rest."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button className="glass-card flex flex-col items-center justify-center gap-2 p-4 rounded-2xl hover:bg-white/10 transition-all dark:bg-white/5 dark:text-white">
                <div className="bg-primary size-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                  <span className="material-symbols-outlined text-xl">mic</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Voice</span>
              </button>
              <button className="glass-card flex flex-col items-center justify-center gap-2 p-4 rounded-2xl hover:bg-white/10 transition-all dark:bg-white/5 dark:text-white">
                <div className="bg-primary/10 size-10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Scan</span>
              </button>
              <button className="glass-card flex flex-col items-center justify-center gap-2 p-4 rounded-2xl hover:bg-white/10 transition-all dark:bg-white/5 dark:text-white">
                <div className="bg-primary/10 size-10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">label</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">Tags</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <div className="space-y-1 mb-6">
              <h1 className="text-navy-950 dark:text-white text-3xl font-bold tracking-tight">Review & Publish</h1>
              <p className="text-navy-950/60 dark:text-white/60 text-sm">Satisfied with the organization?</p>
            </div>

            <div className="bg-white dark:bg-navy-950/40 p-6 rounded-2xl shadow-xl border border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  analyzedData.type === 'task' ? 'bg-blue-100 text-blue-700' : 
                  analyzedData.type === 'win' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-amber-100 text-amber-700'
                }`}>
                  {analyzedData.type}
                </div>
                {analyzedData.priority === 'high' && (
                  <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span> High Priority
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white leading-tight">
                {analyzedData.title}
              </h3>
              
              <div className="text-coastal-600 dark:text-white/70 text-sm italic leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-lg border-l-2 border-primary/30">
                "{text}"
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 dark:text-white rounded-full text-[10px] font-bold text-coastal-800 uppercase">
                   {analyzedData.category}
                </span>
                {analyzedData.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-medium border border-primary/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleDiscard}
                className="flex items-center justify-center gap-2 rounded-xl h-14 bg-gray-100 dark:bg-white/5 text-coastal-600 dark:text-white/60 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
                Edit
              </button>
              <button 
                onClick={handlePublish}
                className="flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <span className="material-symbols-outlined text-xl">publish</span>
                Publish
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fix: removed redundant 'success' check as it's handled by early return above */}
      {step !== 'review' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent flex justify-center z-50">
          <button 
            onClick={handleAnalyze}
            disabled={!text.trim() || step === 'processing'}
            className="flex w-full max-w-[432px] items-center justify-center gap-3 rounded-xl h-16 bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {step === 'processing' ? (
              <>
                <span className="animate-spin material-symbols-outlined">sync</span>
                Organizing Thoughts...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_fix_high</span>
                Analyze & Save
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CapturePage;
