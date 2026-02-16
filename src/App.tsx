import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// FIXED: Looking for 'types.ts' one level up in the root
import { BrainItem, UserProfile, ColorPalette } from '../types';

// FIXED: Looking for your pages one level up in the root 'pages' folder
import TasksPage from '../pages/TasksPage';
import LibraryPage from '../pages/LibraryPage';
import CapturePage from '../pages/CapturePage';
import WinsPage from '../pages/WinsPage';
import ProfilePage from '../pages/ProfilePage';

const PALETTES: Record<ColorPalette, string> = {
  default: '#4A9099',
  earthy: '#8c7851',
  ocean: '#2c4a57',
  midnight: '#1a1a1a'
};

const App: React.FC = () => {
  const [items, setItems] = useState<BrainItem[]>(() => {
    const saved = localStorage.getItem('brain_backup_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('brain_backup_user');
    if (saved) return JSON.parse(saved);
    return {
      name: "Sarah J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdLZQF9Kv4N_EGFwHfAusfjQvtqBspwD_e9uso-E6TBHzTIU0edq07t1DII9MTta-_heSM-Cp6adhTCjEhzgWYYK2ny54_p0C9yKwv6TKfZ42r4hLu6oxEN25b4ah-ZNQujRyVYvBK2TV_LrIGLp0YGANpNnrC3oMF_lwBnjAytQm0UGYQ_CLfm72CudbaTHUgzlsdBUZvLLz_CPB6d_0ngVYaUhB9y9cIsy_jO50EcIqf_kxIyf7lYiP8iW2yiPq-rMGVda56wA",
      streak: 5,
      totalWins: 12,
      preferences: {
        palette: 'default',
        notificationsEnabled: true,
        nudgeFrequency: 'medium',
        aiContext: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('brain_backup_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('brain_backup_user', JSON.stringify(user));
    // Apply palette
    document.documentElement.style.setProperty('--primary-color', PALETTES[user.preferences.palette]);
  }, [user]);

  const addItem = (item: BrainItem) => {
    setItems(prev => [item, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<BrainItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <Router>
      <div className="flex justify-center min-h-screen bg-gray-200">
        <div className="relative w-full max-w-[480px] bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden flex flex-col">
          <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<TasksPage items={items} user={user} updateItem={updateItem} />} />
              <Route path="/library" element={<LibraryPage items={items} deleteItem={deleteItem} />} />
              <Route path="/capture" element={<CapturePage onSave={addItem} user={user} />} />
              <Route path="/wins" element={<WinsPage items={items} user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} onUpdate={updateUser} />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </div>
    </Router>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-coastal-100 px-6 py-3 pb-8 z-50">
      <div className="flex items-center justify-between">
        <Link to="/tasks" className={`flex flex-col items-center gap-1 ${isActive('/tasks') ? 'text-primary' : 'text-coastal-600'}`}>
          <span className={`material-symbols-outlined ${isActive('/tasks') ? 'active-icon' : ''}`}>task_alt</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Tasks</p>
        </Link>
        <Link to="/wins" className={`flex flex-col items-center gap-1 ${isActive('/wins') ? 'text-primary' : 'text-coastal-600'}`}>
          <span className={`material-symbols-outlined ${isActive('/wins') ? 'active-icon' : ''}`}>analytics</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Wins</p>
        </Link>
        <Link to="/capture" className={`flex flex-col items-center gap-1 ${isActive('/capture') ? 'text-primary' : 'text-coastal-600'}`}>
          <div className="bg-coastal-100 rounded-full p-2 -mt-10 shadow-md">
            <span className="material-symbols-outlined text-coastal-800">add</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter mt-1">Capture</p>
        </Link>
        <Link to="/library" className={`flex flex-col items-center gap-1 ${isActive('/library') ? 'text-primary' : 'text-coastal-600'}`}>
          <span className={`material-symbols-outlined ${isActive('/library') ? 'active-icon' : ''}`}>inventory_2</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Vault</p>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-coastal-600'}`}>
          <span className={`material-symbols-outlined ${isActive('/profile') ? 'active-icon' : ''}`}>person</span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default App;
