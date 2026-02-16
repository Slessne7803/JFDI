
import React, { useState, useMemo } from 'react';
import { BrainItem, BrainItemType } from '../types';

interface Props {
  items: BrainItem[];
  deleteItem: (id: string) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'priority' | 'alphabetical';
type StatusFilter = 'all' | 'pending' | 'completed';

const LibraryPage: React.FC<Props> = ({ items, deleteItem }) => {
  const [typeFilter, setTypeFilter] = useState<BrainItemType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Date range state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All', icon: 'format_list_bulleted' },
    { id: 'task', label: 'Tasks', icon: 'task' },
    { id: 'idea', label: 'Ideas', icon: 'lightbulb' },
    { id: 'win', label: 'Wins', icon: 'auto_awesome' },
    { id: 'note', label: 'Notes', icon: 'description' },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'completed' && item.completed) || 
        (statusFilter === 'pending' && !item.completed);
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
      // Date range logic
      let matchesDate = true;
      if (startDate) {
        const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
        if (item.timestamp < startTimestamp) matchesDate = false;
      }
      if (endDate) {
        const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
        if (item.timestamp > endTimestamp) matchesDate = false;
      }
      
      return matchesType && matchesStatus && matchesSearch && matchesDate;
    });

    // Sort logic
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.timestamp - a.timestamp;
        case 'date-asc':
          return a.timestamp - b.timestamp;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityMap = { high: 3, medium: 2, low: 1, undefined: 0 };
          const pA = priorityMap[a.priority || 'undefined' as keyof typeof priorityMap];
          const pB = priorityMap[b.priority || 'undefined' as keyof typeof priorityMap];
          return pB - pA || b.timestamp - a.timestamp;
        default:
          return 0;
      }
    });

    return result;
  }, [items, typeFilter, statusFilter, sortBy, search, startDate, endDate]);

  const getTypeStyles = (type: BrainItemType) => {
    switch (type) {
      case 'task': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200';
      case 'idea': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200';
      case 'win': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIcon = (type: BrainItemType) => {
    switch (type) {
      case 'task': return 'work';
      case 'idea': return 'lightbulb';
      case 'win': return 'emoji_events';
      default: return 'description';
    }
  };

  const clearAllFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setSortBy('date-desc');
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <header className="sticky top-0 z-20 bg-background-light/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-coastal-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
            <h1 className="text-2xl font-bold tracking-tight text-navy-950">Brain Library</h1>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`size-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-white text-coastal-600'}`}
          >
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        <div className="mb-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-coastal-600/60">search</span>
            <input 
              className="w-full bg-white border-none rounded-full py-3.5 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary placeholder:text-coastal-600/40 text-navy-950" 
              placeholder="Search thoughts or tags..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 p-4 bg-white rounded-2xl shadow-inner border border-coastal-50 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coastal-600 opacity-70">Sort By</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'date-desc', label: 'Newest First' },
                  { id: 'date-asc', label: 'Oldest First' },
                  { id: 'priority', label: 'Priority' },
                  { id: 'alphabetical', label: 'A-Z' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id as SortOption)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      sortBy === opt.id ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coastal-600 opacity-70">Date Range</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-coastal-600 ml-2 uppercase">From</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs bg-gray-50 border-gray-100 rounded-lg p-2 text-navy-950 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-coastal-600 ml-2 uppercase">To</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs bg-gray-50 border-gray-100 rounded-lg p-2 text-navy-950 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coastal-600 opacity-70">Status</span>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'completed', label: 'Done' }
                ].map(stat => (
                  <button
                    key={stat.id}
                    onClick={() => setStatusFilter(stat.id as StatusFilter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      statusFilter === stat.id ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-500'
                    }`}
                  >
                    {stat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={clearAllFilters}
              className="w-full py-2 text-xs font-bold text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setTypeFilter(cat.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-colors whitespace-nowrap shadow-sm border ${
                typeFilter === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-navy-950 border-coastal-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-coastal-600 opacity-50">
            {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'Item' : 'Items'} Found
          </h2>
        </div>
        
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-20 text-coastal-600 bg-white/30 rounded-3xl border border-dashed border-coastal-200">
             <span className="material-symbols-outlined text-6xl opacity-20">cloud_off</span>
             <p className="mt-4 font-medium">Nothing fits those filters.</p>
             <button 
              onClick={clearAllFilters}
              className="mt-4 text-primary text-sm font-bold hover:underline"
             >
               Clear all filters
             </button>
          </div>
        ) : (
          filteredAndSortedItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-coastal-100 flex flex-col gap-3 group relative animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${getTypeStyles(item.type)}`}>
                    <span className="material-symbols-outlined text-[14px] leading-none">{getIcon(item.type)}</span>
                    <span className="text-[10px] font-bold uppercase">{item.type}</span>
                  </div>
                  {item.completed && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Done
                    </span>
                  )}
                  {item.priority === 'high' && !item.completed && (
                    <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded-full border border-red-100">Priority</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-coastal-600/60 font-medium">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => { if(window.confirm('Delete this item?')) deleteItem(item.id); }} 
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-navy-950 mb-1 leading-tight">{item.title}</h3>
                <p className="text-sm text-coastal-600 leading-relaxed line-clamp-3">
                  {item.content}
                </p>
                
                {(item.tags.length > 0 || item.category) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    {item.category && (
                      <span className="text-[10px] font-bold text-coastal-800 bg-coastal-50 px-2 py-1 rounded-lg">
                        {item.category}
                      </span>
                    )}
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-primary/70 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {item.type === 'task' && !item.completed && (
                <div className="absolute top-1/2 -right-1 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg rotate-90 origin-left">
                    PENDING
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default LibraryPage;
