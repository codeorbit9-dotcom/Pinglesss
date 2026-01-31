
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Info, 
  X, 
  Key, 
  Search, 
  Filter, 
  ArrowUpDown,
  Calendar,
  BarChart3
} from 'lucide-react';
import { ApiKey, User } from '../types';
import { subscribeToKeys, createNewKey, deleteKey } from '../services/database';

type SortOption = 'newest' | 'oldest' | 'usage-high' | 'usage-low';
type FilterStatus = 'all' | 'active' | 'disabled';

const KeysPage: React.FC<{ user: User }> = ({ user }) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [targetApiKey, setTargetApiKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToKeys(user.id, (data) => {
      setKeys(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  const filteredAndSortedKeys = useMemo(() => {
    let result = [...keys];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(k => 
        k.name.toLowerCase().includes(query) || 
        k.key.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(k => k.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'usage-high':
          return b.usage - a.usage;
        case 'usage-low':
          return a.usage - b.usage;
        default:
          return 0;
      }
    });

    return result;
  }, [keys, searchQuery, filterStatus, sortBy]);

  if (!user) return null;

  const handleCreateKey = async () => {
    if (!newKeyName) return;
    setIsCreating(false);
    await createNewKey(user.id, newKeyName, targetApiKey);
    setNewKeyName('');
    setTargetApiKey('');
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">API Keys</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage proxy tokens and secure your service secrets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Proxy Key
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or key..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="usage-high">Usage: High to Low</option>
            <option value="usage-low">Usage: Low to High</option>
          </select>
        </div>
      </div>

      {/* Creation UI Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] animate-in zoom-in-95 shadow-2xl max-w-lg w-full space-y-8 relative">
            <button onClick={() => setIsCreating(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-2">
              <h3 className="text-slate-900 dark:text-white font-black text-2xl flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-indigo-500" /> Secure New Service
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Link a target API key to your Pingless proxy to mask it from the client.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Stripe Backend Proxy"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  Target Service Key <Info className="w-3.5 h-3.5" />
                </label>
                <input 
                  type="password" 
                  placeholder="The real API key we should protect"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                  value={targetApiKey}
                  onChange={(e) => setTargetApiKey(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={handleCreateKey}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl text-white font-black shadow-2xl shadow-indigo-600/30 transition-all"
              >
                Generate Proxy Token
              </button>
              <button onClick={() => setIsCreating(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {keys.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white dark:bg-slate-900/10">
            <div className="bg-indigo-600/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No proxy tokens generated yet.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 mb-8">Create your first key to start protecting your endpoints.</p>
            <button onClick={() => setIsCreating(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Create First Key</button>
          </div>
        ) : filteredAndSortedKeys.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white dark:bg-slate-900/10">
             <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No matches found.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 mb-8">Try adjusting your filters or search query.</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Clear all filters</button>
          </div>
        ) : filteredAndSortedKeys.map((key) => (
            <div 
              key={key.id} 
              className={`bg-white dark:bg-slate-900/50 border-2 rounded-[2.5rem] p-8 transition-all shadow-sm border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${key.status === 'disabled' ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${key.status === 'active' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <Key className={`w-5 h-5 ${key.status === 'active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-black text-2xl flex items-center gap-2 leading-none mb-2">
                      {key.name}
                      {key.targetApiKey && <ShieldCheck className="w-5 h-5 text-emerald-500" title="Vaulted Secret Key" />}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${key.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                        {key.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopy(key.key, key.id)}
                    className="p-4 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-400/10 rounded-2xl transition-all"
                    title="Copy Key"
                  >
                    {copiedId === key.id ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                  <button 
                    onClick={() => deleteKey(key.id)}
                    className="p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all"
                    title="Delete Key"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-8 py-5 rounded-2xl font-mono text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between overflow-hidden shadow-inner">
                  <span className="truncate tracking-widest font-medium">{showKeyId === key.id ? key.key : 'ping_••••••••••••••••••••••••••••'}</span>
                  <button 
                    onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 ml-4 p-2 transition-colors"
                  >
                    {showKeyId === key.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {key.status === 'active' && (
                  <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 whitespace-nowrap">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Edge Live</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3" />
                    Throughput Capacity
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">{(key.usage / key.limit * 100).toFixed(1)}% — {key.usage.toLocaleString()} reqs</span>
                </div>
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden p-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${key.usage / key.limit > 0.9 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min((key.usage / key.limit * 100), 100)}%` }}
                  ></div>
                </div>
              </div>

              {key.targetApiKey && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-3 text-xs font-bold text-emerald-600 dark:text-emerald-500/60 uppercase tracking-widest">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg"><ShieldCheck className="w-4 h-4" /></div>
                  Encrypted Target Vaulting Enabled
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default KeysPage;
