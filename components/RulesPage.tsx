
import React, { useState, useEffect } from 'react';
import { Shield, Plus, ToggleLeft, ToggleRight, Trash2, Globe, Lock, Search, Loader2, CloudLightning, CheckCircle, AlertCircle } from 'lucide-react';
import { FirewallRule, User } from '../types';
import { subscribeToRules, addRule, deleteRule, toggleRule, getAllUserData, markAllSynced } from '../services/database';
import { syncToCloudflare } from '../services/sync';

const RulesPage: React.FC<{ user: User }> = ({ user }) => {
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);
  const [newRule, setNewRule] = useState({ type: 'IP' as const, value: '', action: 'Block' as const });

  useEffect(() => {
    const unsub = subscribeToRules(user.id, (data) => {
      setRules(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user.id]);

  const handleAddRule = async () => {
    if (!newRule.value) return;
    setIsAdding(false);
    await addRule(user.id, {
      type: newRule.type,
      value: newRule.value,
      action: newRule.action,
      enabled: true
    });
    setNewRule({ type: 'IP', value: '', action: 'Block' });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    try {
      const { keys, rules: allRules } = await getAllUserData(user.id);
      const success = await syncToCloudflare(keys, allRules);
      if (success) {
        await markAllSynced(user.id);
        setSyncSuccess(true);
      } else {
        setSyncSuccess(false);
      }
    } catch (e) {
      setSyncSuccess(false);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncSuccess(null), 3000);
    }
  };

  const pendingSyncCount = rules.filter(r => !(r as any).synced).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Firewall Rules</h1>
          <p className="text-slate-500 dark:text-slate-400">Define security policies enforced at the edge.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
              syncSuccess === true 
                ? 'bg-emerald-500 text-white' 
                : syncSuccess === false 
                ? 'bg-rose-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isSyncing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : syncSuccess === true ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <CloudLightning className="w-5 h-5" />
            )}
            {isSyncing ? 'Simulating...' : syncSuccess === true ? 'Simulated!' : `Test Edge Deployment`}
          </button>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Rule
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-500/30 p-8 rounded-2xl space-y-4 animate-in slide-in-from-top-4 shadow-lg">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Create Edge Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Type</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                value={newRule.type}
                onChange={(e) => setNewRule({...newRule, type: e.target.value as any})}
              >
                <option value="IP">IP Address</option>
                <option value="Domain">Domain</option>
                <option value="Path">Path</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Value</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono"
                placeholder={newRule.type === 'IP' ? 'e.g. 192.168.1.1' : newRule.type === 'Domain' ? 'e.g. evil-bot.com' : '/admin/login'}
                value={newRule.value}
                onChange={(e) => setNewRule({...newRule, value: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 font-medium">Cancel</button>
            <button onClick={handleAddRule} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-indigo-600/20">Enable Rule</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Rule Target</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Sync Status</th>
                <th className="px-8 py-5">Action</th>
                <th className="px-8 py-5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">No rules configured. Add one to secure your edge.</td>
                </tr>
              ) : rules.map((rule) => (
                <tr key={rule.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors ${!rule.enabled ? 'opacity-40' : ''}`}>
                  <td className="px-8 py-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{rule.value}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                      {rule.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {(rule as any).synced ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5" /> Demo Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <CloudLightning className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => toggleRule(rule.id, !rule.enabled)} className="transition-transform active:scale-90">
                      {rule.enabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300 dark:text-slate-600" />}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => deleteRule(rule.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
