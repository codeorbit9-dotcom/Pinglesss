
import React, { useState, useEffect } from 'react';
import { Check, Shield, Zap, Loader2, Rocket, Activity, CreditCard } from 'lucide-react';
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

  const totalUsage = keys.reduce((acc, k) => acc + (k.usage || 0), 0);
  const freeLimit = user.plan === 'Pro' ? 10000000 : 100000; 
  const usagePercent = Math.min((totalUsage / freeLimit) * 100, 100);

  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-20">
      <header className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight tracking-tighter">Scale your protection.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">
          Current plan: <span className="text-indigo-600 font-black">{user.plan}</span>
        </p>
      </header>

      {/* Usage Monitor */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Activity className="w-8 h-8 text-indigo-500" /> Monthly Edge Usage
          </h2>
          {loading && <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />}
        </div>
        <div className="space-y-8">
          <div className="flex justify-between text-base">
            <span className="text-slate-500 font-black uppercase tracking-widest text-xs">Total Proxy Traffic Aggregation</span>
            <span className="text-slate-900 dark:text-white font-black tracking-tight">{totalUsage.toLocaleString()} / {freeLimit.toLocaleString()} requests</span>
          </div>
          <div className="w-full h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${usagePercent > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
             <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-md">
               Usage is aggregated in real-time across all global edge locations. {user.plan === 'Free' ? 'Upgrade to Pro to unlock 10M requests and priority routing.' : 'Your high-volume limit is active and secured.'}
             </p>
             <button className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest whitespace-nowrap ml-6">View Breakdown</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Free Plan */}
        <div className={`bg-white dark:bg-slate-900/50 border-2 ${user.plan === 'Free' ? 'border-indigo-500/30' : 'border-slate-200 dark:border-slate-800'} p-10 rounded-[2.5rem] flex flex-col shadow-sm transition-all`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-8">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Basic</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">$0</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold">Perfect for early development.</p>
            <ul className="space-y-6 mb-12">
              {['100k requests / month', '3 Edge Rules', 'Standard Proxy Path', 'Email Support'].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-bold">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs ${user.plan === 'Free' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}>
            {user.plan === 'Free' ? 'Current Plan' : 'Active'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`bg-white dark:bg-slate-900 border-4 ${user.plan === 'Pro' ? 'border-emerald-500' : 'border-indigo-600'} p-10 rounded-[3rem] flex flex-col relative overflow-hidden shadow-2xl shadow-indigo-600/10 transition-all hover:scale-[1.02]`}>
          {user.plan !== 'Pro' && (
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-black px-6 py-2 uppercase tracking-widest rounded-bl-2xl">Recommended</div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-8">
              <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Startup</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">$9.9</h2>
              <span className="text-slate-500 dark:text-slate-400 font-black text-xl">/mo</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold">For scaling applications.</p>
            <ul className="space-y-6 mb-12">
              {['10 Million requests / month', 'Unlimited Edge Rules', 'Detailed Analytics', 'Priority Global Routing'].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-900 dark:text-white text-sm font-black">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => handleUpgrade('Pro')}
            disabled={user.plan === 'Pro' || upgradingPlan === 'Pro'}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl flex items-center justify-center gap-3 ${
              user.plan === 'Pro' 
              ? 'bg-emerald-500 text-white cursor-default' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
            }`}
          >
            {upgradingPlan === 'Pro' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : user.plan === 'Pro' ? (
              <><Check className="w-6 h-6" /> Current Plan</>
            ) : (
              <><CreditCard className="w-6 h-6" /> Upgrade Now</>
            )}
          </button>
        </div>

        {/* Ultra Plan */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] flex flex-col shadow-sm opacity-60 grayscale-[0.5]">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Enterprise</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">$49.9</h2>
              <span className="text-slate-500 font-black text-xl">/mo</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold">Zero-limit infrastructure.</p>
            <ul className="space-y-6 mb-12">
              {['100 Million requests / month', 'Dedicated IP pool', '99.99% Uptime SLA', 'Dedicated Account Manager'].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm font-bold">
                  <Check className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-600 hover:text-indigo-600 font-black uppercase tracking-widest text-xs transition-all">Talk to Sales</button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
