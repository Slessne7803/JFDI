
import React from 'react';
import { BrainItem, UserProfile } from '../types';

interface Props {
  items: BrainItem[];
  user: UserProfile;
}

const WinsPage: React.FC<Props> = ({ items, user }) => {
  const wins = items.filter(i => i.type === 'win' || (i.type === 'task' && i.completed));
  
  // Group wins by day (mock logic)
  const recentWins = wins.slice(0, 5);

  return (
    <div className="p-4 space-y-6 flex flex-col min-h-full">
      <header className="flex items-center justify-between py-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="material-symbols-outlined text-2xl font-semibold">psychology</span>
        </div>
        <h2 className="text-navy-950 text-lg font-bold flex-1 text-center">Quick Wins</h2>
        <button className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
          <span className="material-symbols-outlined text-navy-950">notifications</span>
        </button>
      </header>

      <section>
        <div className="relative overflow-hidden rounded-xl p-6 flex flex-col justify-end min-h-[180px] bg-gradient-to-br from-primary to-coastal-800 shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-8xl rotate-12 text-white">auto_awesome</span>
          </div>
          <div className="relative z-10 text-white">
            <p className="text-white/80 text-sm font-medium mb-1">Weekly Summary</p>
            <h1 className="text-3xl font-bold leading-tight">{wins.length} Wins recorded!</h1>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span> +{user.streak * 5}% streak
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-1">
        <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-4 border border-primary/20">
          <div className="size-12 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white">bolt</span>
          </div>
          <div>
            <p className="text-navy-950 font-semibold text-sm italic">"Your brain is on fire today! Keep that momentum going."</p>
            <p className="text-primary/70 text-[10px] font-bold uppercase mt-1 tracking-widest">Energy Boost</p>
          </div>
        </div>
      </section>

      <section className="flex-1 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-navy-950 text-xl font-bold leading-tight">Accomplishment Feed</h2>
          <button className="text-primary text-xs font-bold">View All</button>
        </div>

        <div className="space-y-3">
          {recentWins.length > 0 ? recentWins.map((win, idx) => (
            <div 
              key={win.id} 
              className={`bg-white rounded-xl p-4 flex items-center justify-between border-l-4 shadow-sm border-l-primary animate-in fade-in slide-in-from-right-${idx * 2}`}
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{win.type === 'win' ? 'auto_awesome' : 'task_alt'}</span>
                </div>
                <div>
                  <p className="text-navy-950 font-semibold">{win.title}</p>
                  <p className="text-coastal-600/60 text-[10px]">
                    {new Date(win.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black text-primary uppercase tracking-tighter border border-primary/20">
                {win.type === 'win' ? 'Captured!' : 'Done!'}
              </span>
            </div>
          )) : (
            <div className="text-center py-10 text-coastal-600">
               <p>No wins yet today. Let's find one small victory!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WinsPage;
