
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Check,
  MousePointerClick,
  ShieldAlert,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Clock,
  BookOpen,
  Globe,
  Lock
} from 'lucide-react';
import { AppRoute } from '../types';
import { useTheme } from '../context/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#E5E7EB] transition-colors duration-300 min-h-screen overflow-x-hidden">
      {/* Decorative Edge Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none opacity-40">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Pingless Logo" className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black text-[#0F172A] dark:text-white tracking-tighter">Pingless</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#475569] dark:text-slate-400">
            <a href="#how" className="hover:text-indigo-600 dark:hover:text-white transition-colors">How it Works</a>
            <Link to={AppRoute.Docs} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Documentation</Link>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to={AppRoute.Login} className="hidden sm:block text-sm font-bold text-[#475569] dark:text-slate-300 hover:text-indigo-600 transition-colors">Login</Link>
            <Link to={AppRoute.Signup} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-8 animate-fade-slide">
            EDGE-LEVEL API PROTECTION — NO SDK REQUIRED
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-[#0F172A] dark:text-white tracking-tighter mb-8 leading-[1] animate-fade-slide [animation-delay:100ms]">
            Block API Abuse. <br />
            <span className="text-indigo-600">At the Edge.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#475569] dark:text-slate-400 max-w-5xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium animate-fade-slide [animation-delay:200ms]">
            Pingless is a global edge proxy that blocks bots, malicious IPs, scraping, and unauthorized requests 
            before they reach your infrastructure — ensuring zero latency hit and zero code changes to your backend.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-slide [animation-delay:300ms]">
            <Link to={AppRoute.Signup} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2 group">
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={AppRoute.Docs} className="w-full sm:w-auto bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-[#0F172A] dark:text-white px-10 py-5 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> View Documentation
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4 text-[#475569] dark:text-slate-500 font-bold text-xs uppercase tracking-widest animate-fade-slide [animation-delay:400ms]">
             <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-500"/> Global Edge</div>
             <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-500"/> Bot Protection</div>
             <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-500"/> Zero Exposure</div>
             <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-indigo-500"/> SDK-Free</div>
             <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500"/> &lt; 10ms Latency</div>
          </div>
        </div>

        {/* Floating Animation Graphic */}
        <div className="max-w-7xl mx-auto mt-24 relative animate-fade-slide [animation-delay:500ms]">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full"></div>
            <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="text-center md:text-left space-y-4">
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Traffic Flow</div>
                        <h3 className="text-2xl font-black">Malicious Traffic is Deflected</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm font-medium">Bots and scrapers are identified at our global edge nodes and blocked before they ever hit your database.</p>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center gap-8 relative">
                        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <MousePointerClick className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 relative">
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full animate-[ping_2s_infinite]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-[ping_2s_infinite_1s]"></div>
                        </div>
                        <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-600/30">
                            <img src="/logo.png" alt="Pingless" className="w-12 h-12 invert brightness-0" />
                        </div>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 relative">
                             <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-[ping_2s_infinite_1.5s]"></div>
                        </div>
                        <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Why Pingless Section */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950/20 border-y border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white mb-16 text-center lg:text-left">Why developers switch to Pingless</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Blocks Abuse Before It Costs You', desc: 'Stops bots & scrapers at the edge, saving your database from junk traffic.', icon: ShieldAlert },
              { title: 'Zero Code Changes', desc: 'Works as a simple proxy layer. Swap your API URL and you are protected.', icon: Cpu },
              { title: 'Lower API Bills', desc: 'Block junk traffic early. Stop paying for compute and bandwidth you dont need.', icon: Activity },
              { title: 'Built for Indie SaaS', desc: 'Simple, flat pricing with no enterprise traps or "Contact Sales" requirements.', icon: Shield },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-500/30">
                <div className="bg-indigo-600/10 p-3 rounded-2xl w-fit mb-6">
                  <f.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-3 leading-tight">{f.title}</h3>
                <p className="text-[#475569] dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0F172A] dark:text-white mb-4 tracking-tight">Keep It Honest Pricing</h2>
            <p className="text-[#475569] dark:text-slate-400 font-medium">No "Contact Sales" nonsense. Scale at your own pace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:scale-105">
              <div className="mb-8">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Free Tier</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black text-[#0F172A] dark:text-white">$0</span>
                </div>
                <p className="text-[#475569] dark:text-slate-400 text-sm mt-2 font-medium">For local dev & hobby apps</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 100k requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Basic IP & bot blocking
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Email Support
                </li>
              </ul>
              <Link to={AppRoute.Signup} className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F172A] dark:text-white rounded-2xl font-black text-center transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white dark:bg-[#020617] border-4 border-indigo-600 p-10 rounded-[2.5rem] shadow-2xl flex flex-col relative scale-110 z-10">
              <div className="absolute top-0 right-10 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-b-xl">Most Popular</div>
              <div className="mb-8">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Growth Plan</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black text-[#0F172A] dark:text-white">$9.9</span>
                  <span className="text-[#475569] dark:text-slate-500 font-bold">/mo</span>
                </div>
                <p className="text-[#475569] dark:text-slate-400 text-sm mt-2 font-medium">Scale without complexity</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#0F172A] dark:text-white font-bold">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Advanced Edge Rules
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 10M requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Priority Edge Locations
                </li>
              </ul>
              <Link to={AppRoute.Signup} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-center transition-all shadow-xl shadow-indigo-600/30">
                Upgrade to Pro
              </Link>
            </div>

            {/* Custom / Startup */}
            <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col transition-all hover:scale-105">
              <div className="mb-8">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Scale Tier</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black text-[#0F172A] dark:text-white">$49.9</span>
                  <span className="text-[#475569] dark:text-slate-500 font-bold">/mo</span>
                </div>
                <p className="text-[#475569] dark:text-slate-400 text-sm mt-2 font-medium">For high-traffic backends</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 100M requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Dedicated support
                </li>
                <li className="flex items-center gap-3 text-sm text-[#475569] dark:text-slate-300">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Custom limits
                </li>
              </ul>
              <Link to={AppRoute.Signup} className="w-full py-4 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-[#0F172A] dark:text-white rounded-2xl font-black text-center transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-6 text-[#475569] dark:text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Pingless" className="w-6 h-6" />
            <span className="text-lg font-black text-[#0F172A] dark:text-white tracking-tighter">Pingless</span>
          </div>
          <p className="text-xs font-medium">© 2024 Pingless Inc. Clear &gt; Clever. Trust &gt; Flash.</p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
            <Link to={AppRoute.Docs} className="hover:text-indigo-600 transition-colors">Docs</Link>
            <a href="mailto:contactpingless@gmail.com" className="hover:text-indigo-600 transition-colors">Contact</a>
            <a href="https://instagram.com/shoaibakhtarx" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Instagram</a>
            <Link to={AppRoute.Docs} className="hover:text-indigo-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
