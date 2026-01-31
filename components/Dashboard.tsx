
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Globe, CloudLightning, CheckCircle, RefreshCcw } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { User, ApiKey, AppRoute, FirewallRule } from '../types';
import { useTheme } from '../context/ThemeContext';
import { subscribeToKeys, subscribeToRules } from '../services/database';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const unsubKeys = subscribeToKeys(user.id, setKeys);
    const unsubRules = subscribeToRules(user.id, setRules);
    return () => {
      unsubKeys();
      unsubRules();
    };
  }, [user?.id]);

  if (!user) return null;

  const totalUsage = keys.reduce((acc, k) => acc + (k.usage || 0), 0);
  const activeRulesCount = rules.filter(r => r.enabled).length;
  const isOutOfSync = rules.some(r => !(r as any).synced) || keys.some(k => !(k as any).synced);

  // Initial zeroed data - will grow as usage increases
  const chartData = [
    { name: 'Mon', req: 0 }, { name: 'Tue', req: 0 }, { name: 'Wed', req: 0 },
    { name: 'Thu', req: 0 }, { name: 'Fri', req: 0 }, { name: 'Sat', req: 0 }, 
    { name: 'Today', req: totalUsage },
  ];

  const simulateTraffic = async () => {
    if (keys.length === 0) return;
    setIsSimulating(true);
    const targetKey = keys[0];
    await updateDoc(doc(db, "api_keys", targetKey.id), {
      usage: (targetKey.usage || 0) + Math.floor(Math.random() * 50) + 10
    });
    setTimeout(() => setIsSimulating(false), 500);
  };

  const monthlyLimit = user.plan === 'Pro' ? 10000000 : 100000;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight tracking-tighter">Welcome, {user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Your API infrastructure is protected at the edge.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={simulateTraffic}
            disabled={keys.length === 0 || isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-500 transition-all text-slate-600 dark:text-slate-400 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            Test Traffic
          </button>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${isOutOfSync ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'}`}>
            {isOutOfSync ? <CloudLightning className="w-5 h-5 animate-pulse" /> : <CheckCircle className="w-5 h-5" />}
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">{isOutOfSync ? 'Changes Pending' : 'Edge in Sync'}</span>
                <span className="text-[9px] opacity-80 font-bold leading-none">{isOutOfSync ? 'Sync to apply' : 'Protection live'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: totalUsage.toLocaleString(), change: 'Live', icon: Activity, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active Rules', value: activeRulesCount.toString(), change: 'Active', icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'API Keys', value: keys.length.toString(), change: 'Global', icon: Globe, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Avg Latency', value: totalUsage > 0 ? '8ms' : '0ms', change: 'Optimised', icon: Activity, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm transition-all hover:border-indigo-500/30">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${item.bg} ${item.color} tracking-widest`}>
                {item.change}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{item.label}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#0F172A] dark:text-white font-black text-xl">Traffic Activity</h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Stream</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#020617' : '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="req" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col">
          <h3 className="text-[#0F172A] dark:text-white font-black text-xl mb-8">Edge Resource Usage</h3>
          <div className="space-y-10 flex-1">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span className="text-slate-500">Usage towards plan</span>
                <span className="text-indigo-600 font-black">{totalUsage.toLocaleString()} / {monthlyLimit.toLocaleString()}</span>
              </div>
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min((totalUsage / monthlyLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-6 bg-[#F8FAFC] dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-3xl mt-auto">
              <p className="text-[#0F172A] dark:text-white font-black mb-3 flex items-center gap-2 leading-none">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Edge Security Tips
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                You currently have {activeRulesCount} active firewall rules. Add an IP block to prevent scrapers from consuming your quota.
              </p>
              <button 
                onClick={() => navigate(AppRoute.Rules)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/30 text-xs uppercase tracking-widest"
              >
                Configure Firewall
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
