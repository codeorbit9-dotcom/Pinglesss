
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  Shield, 
  Zap, 
  Loader2, 
  Rocket, 
  Activity, 
  CreditCard,
  Key,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import { User, ApiKey, PlanType } from '../types';
import { subscribeToKeys } from '../services/database';
import { createCheckoutSession } from '../services/stripe';

const BillingPage: React.FC<{ user: User }> = ({ user }) => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToKeys(user.id, (data) => {
      setKeys(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.id]);

  const totalUsage = useMemo(() => keys.reduce((acc, k) => acc + (k.usage || 0), 0), [keys]);
  const limit = user.plan === 'Pro' ? 10000000 : 100000; 
  const usagePercent = Math.min((totalUsage / limit) * 100, 100);

  // Key-wise distribution for detailed breakdown
  const keyBreakdown = useMemo(() => {
    return [...keys]
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5); // Show top 5 keys
  }, [keys]);

  if (!user) return null;

  const handleUpgrade = async (plan: PlanType) => {
    if (user.plan === plan) return;
    setUpgradingPlan(plan);
    try {
      await createCheckoutSession(user.id, plan);
    } catch (error) {
      console.error("Upgrade failed:", error);
      setUpgradingPlan(null);
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Usage & Billing</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Monitor your edge quota and manage your subscription.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
           <Shield className="w-5 h-5 text-indigo-500" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Current Plan</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{user.plan} Developer</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Usage Overview Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-indigo-500" /> Monthly Quota Usage
              </h2>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Next Reset: 1st of Month</span>
            </div>
            
            <div className="space-y-8">
              <div className="flex justify-between text-base">
                <span className="text-slate-500 font-bold text-sm">Aggregated Request Throughput</span>
                <span className="text-slate-900 dark:text-white font-black">{totalUsage.toLocaleString()} / {limit.toLocaleString()}</span>
              </div>
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${usagePercent > 90 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]'}`}
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Detailed Breakdown Section */}
            <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" /> Quota Distribution by Key
                  </h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700">Export Logs</button>
               </div>

               <div className="space-y-6">
                 {keyBreakdown.length === 0 ? (
                   <div className="text-center py-10 text-slate-400 text-sm font-medium italic bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      No usage data detected across your keys yet.
                   </div>
                 ) : keyBreakdown.map((key) => {
                   const keyShare = totalUsage > 0 ? (key.usage / totalUsage) * 100 : 0;
                   return (
                     <div key={key.id} className="group">
                        <div className="flex justify-between items-center mb-2">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                 <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{key.name}</span>
                           </div>
                           <div className="flex items-center gap-4 text-[11px] font-black">
                              <span className="text-slate-400">{key.usage.toLocaleString()} reqs</span>
                              <span className="text-indigo-600">{keyShare.toFixed(1)}%</span>
                           </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-all duration-700"
                             style={{ width: `${keyShare}%` }}
                           ></div>
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>
        </div>

        {/* Pricing/Upgrade Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[60px] rounded-full"></div>
            <div className="relative z-10 space-y-6">
              <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md">
                 <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Unlock Unlimited Edge Rules</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                Upgrade to Pro for 10M requests, advanced domain filtering, and dedicated edge locations.
              </p>
              <button 
                onClick={() => handleUpgrade('Pro')}
                disabled={user.plan === 'Pro' || upgradingPlan === 'Pro'}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {upgradingPlan === 'Pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : user.plan === 'Pro' ? 'Already Active' : 'Upgrade to Pro — $9/mo'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
             <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> Saved Methods
             </h4>
             <div className="text-center py-8">
                <p className="text-slate-400 text-xs font-medium italic">No payment methods linked.</p>
             </div>
             <button className="w-full py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">
                Link Stripe
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
