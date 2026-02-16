
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainItem, UserProfile } from '../types';
import { generateGentleNudge } from '../services/geminiService';

interface Props {
  items: BrainItem[];
  user: UserProfile;
  updateItem: (id: string, updates: Partial<BrainItem>) => void;
}

const TasksPage: React.FC<Props> = ({ items, user, updateItem }) => {
  const [nudge, setNudge] = useState("Your brain is ready for a calm start.");
  const [loadingNudge, setLoadingNudge] = useState(false);

  const todayTasks = items.filter(i => i.type === 'task' && !i.completed);
  const completedToday = items.filter(i => i.type === 'task' && i.completed);

  useEffect(() => {
    const fetchNudge = async () => {
      setLoadingNudge(true);
      try {
        const text = await generateGentleNudge(items, user.preferences);
        setNudge(text);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingNudge(false);
      }
    };
    fetchNudge();
  }, [items.length, user.preferences.aiContext]);

  return (
    <div className="p-4 space-y-8">
      <header className="flex items-center justify-between py-2 border-b border-coastal-100">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="bg-coastal-100 rounded-full p-1 border-2 border-white shadow-sm size-10 overflow-hidden hover:scale-105 transition-transform">
            <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
          </Link>
          <div>
            <p className="text-coastal-600 text-xs font-medium uppercase tracking-wider">Good morning</p>
            <h2 className="text-navy-950 text-xl font-bold leading-tight">{user.name}</h2>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 bg-white border border-coastal-100 text-coastal-600">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <section>
        <div className="relative overflow-hidden flex flex-col rounded-xl shadow-lg bg-white border border-coastal-50">
          <div className="relative w-full h-40 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop")' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
          <div className="p-6 -mt-8 relative z-10 bg-white rounded-t-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-lg">water_drop</span>
              <p className="text-navy-950 text-lg font-bold leading-tight tracking-tight">Gentle Nudge</p>
            </div>
            <p className="text-coastal-600 text-sm leading-relaxed min-h-[40px]">
              {loadingNudge ? "Thinking of a small step for you..." : nudge}
            </p>
            <div className="flex items-center justify-end mt-4">
              <button className="rounded-full h-10 px-6 bg-primary text-white text-sm font-semibold shadow-md active:scale-95 transition-transform">
                I'm on it
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-navy-950 text-xl font-bold">Today</h3>
          <span className="text-coastal-800 text-xs font-medium bg-coastal-100 px-3 py-1 rounded-full">{todayTasks.length} left</span>
        </div>
        <div className="space-y-3">
          {todayTasks.length > 0 ? todayTasks.slice(0, 3).map(task => (
            <label key={task.id} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-coastal-100 shadow-sm transition-all active:bg-coastal-50 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => updateItem(task.id, { completed: !task.completed })}
                  className="peer h-6 w-6 rounded-full border-2 border-coastal-200 bg-transparent text-primary focus:ring-primary appearance-none checked:bg-primary checked:border-primary"
                />
                <span className="material-symbols-outlined absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
              </div>
              <div className="flex-1">
                <p className={`text-navy-950 text-base font-medium ${task.completed ? 'text-coastal-600 line-through' : ''}`}>
                  {task.title}
                </p>
                {task.priority === 'high' && (
                   <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-primary bg-coastal-50 px-2 py-0.5 rounded-full mt-1 border border-coastal-100">High Priority</span>
                )}
                {task.tags.length > 0 && (
                  <p className="text-coastal-600 text-[10px] mt-1">#{task.tags.join(' #')}</p>
                )}
              </div>
            </label>
          )) : (
            <div className="text-center py-8 text-coastal-600 bg-white/50 rounded-xl border border-dashed border-coastal-200">
              <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">coffee</span>
              <p>Nothing urgent for now. Enjoy the space!</p>
            </div>
          )}
        </div>
      </section>

      {completedToday.length > 0 && (
        <section className="space-y-4 opacity-60">
          <h3 className="text-navy-950 text-lg font-bold px-2">Completed Today</h3>
          <div className="space-y-3">
             {completedToday.map(task => (
               <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg bg-coastal-50/50 border border-coastal-100 line-through">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <p className="text-navy-950 text-sm font-medium">{task.title}</p>
               </div>
             ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TasksPage;
