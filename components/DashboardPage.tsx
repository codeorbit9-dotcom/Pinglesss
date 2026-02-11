
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Globe, Zap, RefreshCcw, ArrowUpRight, Loader2 } from 'lucide-react';
import { User, ApiKey, FirewallRule, AppRoute } from '../types';
import { useTheme } from '../context/ThemeContext';
import { subscribeToKeys, subscribeToRules } from '../services/database';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const DashboardChart = lazy(() => import('./DashboardChart'));

const ChartSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 rounded-2xl animate-pulse">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin opacity-40" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Metrics...</span>
    </div>
  </div>
);

const DashboardPage: React.FC<{ user: User }> = ({ user }) => {
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

  const chartData = [
    { name: 'Mon', req: Math.floor(totalUsage * 0.1) }, 
    { name: 'Tue', req: Math.floor(totalUsage * 0.3) }, 
    { name: 'Wed', req: Math.floor(totalUsage * 0.2) },
    { name: 'Thu', req: Math.floor(totalUsage * 0.5) }, 
    { name: 'Fri', req: Math.floor(totalUsage * 0.7) }, 
    { name: 'Sat', req: Math.floor(totalUsage * 0.8) }, 
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex justify-between items-start flex-wrap gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">System Health</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Infrastructure overview for {user.name}.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={simulateTraffic}
            disabled={keys.length === 0 || isSimulating}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all text-slate-600 dark:text-slate-400 disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <RefreshCcw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            Run Stress Test
          </button>
          
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border bg-emerald-500/5 border-emerald-500/30 text-emerald-500 transition-all duration-300">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse-slow"></div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">API Gateway</span>
                <span className="text-[9px] opacity-80 font-bold leading-none">Operational</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ingress Requests', value: totalUsage.toLocaleString(), icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Deflected Traffic', value: Math.floor(totalUsage * 0.05).toLocaleString(), icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Active Edge Keys', value: keys.length.toString(), icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg Latency', value: totalUsage > 0 ? '4ms' : '0ms', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm group hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Traffic (Vercel)</span>
             </div>
          </div>
          <h3 className="text-slate-900 dark:text-white font-black text-xl mb-12">Traffic Activity</h3>
          <div className="h-[350px] w-full">
            <Suspense fallback={<ChartSkeleton />}>
              <DashboardChart data={chartData} theme={theme} />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm flex flex-col">
          <h3 className="text-slate-900 dark:text-white font-black text-xl mb-10">Resource Utilization</h3>
          <div className="space-y-12 flex-1">
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Plan Limit Usage</span>
                <span className="text-indigo-600">{(totalUsage / monthlyLimit * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden p-1">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${totalUsage / monthlyLimit > 0.9 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`} 
                  style={{ width: `${Math.min((totalUsage / monthlyLimit) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-center italic">Calculated in real-time on Edge</p>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-indigo-500/5 border border-slate-100 dark:border-indigo-500/10 rounded-[2.5rem] mt-auto">
              <p className="text-[#0F172A] dark:text-white font-black mb-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-600" /> Boundary Hardening
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-8 font-medium">
                Active Rules: {activeRulesCount}. <br/>
                <span className="text-amber-500">Note:</span> Vercel Edge is stateless. Rules are simulated in this demo environment.
              </p>
              <button 
                onClick={() => navigate(AppRoute.Rules)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/30 text-xs uppercase tracking-widest active:scale-95"
              >
                Open Firewall Controls
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
