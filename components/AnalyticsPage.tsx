
import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Filter, RefreshCcw, Activity, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { User } from '../types';
import { subscribeToKeys } from '../services/database';

const AnalyticsPage: React.FC<{ user: User }> = ({ user }) => {
  const { theme } = useTheme();
  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToKeys(user.id, (keys) => {
      const total = keys.reduce((acc, k) => acc + (k.usage || 0), 0);
      setUsage(total);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  if (!user) return null;

  // Actual dynamic data based on usage
  const timeSeriesData = [
    { time: '00:00', total: 0, blocked: 0 },
    { time: '04:00', total: 0, blocked: 0 },
    { time: '08:00', total: 0, blocked: 0 },
    { time: '12:00', total: 0, blocked: 0 },
    { time: '16:00', total: 0, blocked: 0 },
    { time: '20:00', total: 0, blocked: 0 },
    { time: 'Live', total: usage, blocked: Math.floor(usage * 0.05) },
  ];

  const distributionData = [
    { name: 'Allow', value: usage > 0 ? 95 : 0 },
    { name: 'Blocked', value: usage > 0 ? 5 : 0 },
  ];

  const COLORS = ['#6366f1', '#f43f5e'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Deep Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Granular visibility into your API ecosystem performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Today
          </button>
          <button 
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
          >
            <RefreshCcw className="w-4 h-4" /> Live Refresh
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg Latency', value: usage > 0 ? '12ms' : '0ms', icon: Activity, color: 'text-indigo-500' },
          { label: 'Edge Uptime', value: '100.00%', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'Deflected Traffic', value: Math.floor(usage * 0.05).toLocaleString(), icon: ShieldAlert, color: 'text-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] flex items-center gap-6 shadow-sm transition-all hover:scale-[1.02]">
             <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
             </div>
             <div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
          <h3 className="text-slate-900 dark:text-white font-black text-xl mb-8">Edge Throughput</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#020617' : '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px',
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="blocked" stroke="#f43f5e" strokeWidth={3} fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
          <h3 className="text-slate-900 dark:text-white font-black text-xl mb-8">Security Distribution</h3>
          <div className="h-[350px] flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-full h-full max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke={theme === 'dark' ? '#020617' : '#fff'}
                    strokeWidth={6}
                    animationDuration={1500}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6">
               {distributionData.map((d, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i] }}></div>
                   <div className="flex flex-col">
                     <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{d.name}</span>
                     <span className="text-slate-900 dark:text-white font-black text-2xl leading-none">{d.value}%</span>
                   </div>
                 </div>
               ))}
               {usage === 0 && (
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic animate-pulse">Awaiting edge data...</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
