
import React from 'react';
import { UserProfile, ColorPalette } from '../types';

interface Props {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const ProfilePage: React.FC<Props> = ({ user, onUpdate }) => {
  const updatePreference = (key: keyof UserProfile['preferences'], value: any) => {
    onUpdate({
      preferences: {
        ...user.preferences,
        [key]: value
      }
    });
  };

  const palettes: { id: ColorPalette; label: string; color: string }[] = [
    { id: 'default', label: 'Coastal', color: '#4A9099' },
    { id: 'ocean', label: 'Deep Sea', color: '#2c4a57' },
    { id: 'earthy', label: 'Terra', color: '#8c7851' },
    { id: 'midnight', label: 'Midnight', color: '#1a1a1a' },
  ];

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="bg-primary/20 p-1 rounded-full border-4 border-white shadow-xl">
            <img src={user.avatar} className="size-24 rounded-full object-cover" alt="User avatar" />
          </div>
          <button className="absolute bottom-0 right-0 bg-white size-8 rounded-full shadow-md flex items-center justify-center border border-gray-100">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-950 dark:text-white">{user.name}</h1>
          <p className="text-coastal-600 text-sm">ADHD-Friendly Productivity</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-coastal-100 flex-1 min-w-[100px]">
            <p className="text-[10px] font-bold uppercase text-coastal-600 opacity-50">Streak</p>
            <p className="text-xl font-bold text-primary">{user.streak} days</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-coastal-100 flex-1 min-w-[100px]">
            <p className="text-[10px] font-bold uppercase text-coastal-600 opacity-50">Wins</p>
            <p className="text-xl font-bold text-primary">{user.totalWins}</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-coastal-800">Visual Palette</h3>
        <div className="grid grid-cols-2 gap-3">
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => updatePreference('palette', p.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                user.preferences.palette === p.id 
                  ? 'bg-white border-primary ring-2 ring-primary/10 shadow-md' 
                  : 'bg-white border-coastal-100 opacity-70 grayscale-[0.5]'
              }`}
            >
              <div className="size-6 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-sm font-semibold text-navy-950">{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-coastal-800">Notifications & Nudges</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-coastal-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-navy-950">Enable Notifications</p>
              <p className="text-xs text-coastal-600">Get reminders for your gentle nudges.</p>
            </div>
            <button 
              onClick={() => updatePreference('notificationsEnabled', !user.preferences.notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user.preferences.notificationsEnabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                user.preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-navy-950">Nudge Frequency</p>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => updatePreference('nudgeFrequency', freq)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    user.preferences.nudgeFrequency === freq
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  {freq.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-coastal-800">AI Personal Context</h3>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">SMART BRAIN</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-coastal-100">
          <p className="text-xs text-coastal-600 mb-3">Tell the AI about yourself (job, habits, goals) to get more relevant task organization.</p>
          <textarea
            value={user.preferences.aiContext}
            onChange={(e) => updatePreference('aiContext', e.target.value)}
            className="w-full bg-gray-50 border-gray-100 rounded-xl p-4 text-sm text-navy-950 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-300 min-h-[120px] border-none"
            placeholder="e.g. I work as a designer and I struggle with starting big tasks. I love short, punchy titles."
          />
        </div>
      </section>

      <footer className="text-center pt-8">
        <p className="text-[10px] text-coastal-600 opacity-50 uppercase tracking-widest">Version 1.2.0 - JFDI App</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
