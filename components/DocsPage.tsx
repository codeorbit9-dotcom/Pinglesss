
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  BookOpen, 
  Shield, 
  Lock, 
  Activity, 
  Cpu, 
  Globe, 
  ArrowLeft,
  Terminal,
  FileText,
  HelpCircle,
  Menu,
  X,
  CreditCard,
  History,
  Check,
  Code,
  ArrowRight
} from 'lucide-react';
import { AppRoute } from '../types';

const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'request-flow', title: 'Request Flow', icon: ArrowRight },
    { id: 'how-it-works', title: 'How it Works', icon: Cpu },
    { id: 'features', title: 'Key Features', icon: Code },
    { id: 'getting-started', title: 'Getting Started', icon: History },
    { id: 'pricing', title: 'Pricing', icon: CreditCard },
    { id: 'privacy', title: 'Privacy Policy', icon: Shield },
    { id: 'developers', title: 'Developers', icon: Code },
    { id: 'contact', title: 'Contact Support', icon: HelpCircle },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#E5E7EB]">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to={AppRoute.Landing} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
              <span className="text-xl font-black tracking-tighter">Pingless</span>
            </Link>
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400">
               <ChevronRight className="w-4 h-4" /> 
               <span className="uppercase tracking-widest">Documentation</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to={AppRoute.Developers} 
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 dark:hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <Code className="w-4 h-4" />
              Developer Desk
            </Link>
            <Link 
              to={AppRoute.Login} 
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
            >
              Sign In
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ml-2"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex pt-24 min-h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-24 bottom-0 left-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] p-6 
          transition-transform lg:translate-x-0 z-40 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                  activeSection === s.id 
                    ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.title}
              </button>
            ))}
          </div>
          
          <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Last Updated</p>
                <p className="text-xs font-bold">January 2026</p>
             </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-12 max-w-4xl">
          <div className="space-y-32 pb-32">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <h1 className="text-4xl lg:text-5xl font-black mb-8 tracking-tighter">Pingless Documentation</h1>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Pingless is an edge-based API protection proxy that blocks bots, malicious IPs, abusive traffic, and unauthorized access before requests reach your backend. 
                  It works without SDKs or backend code changes.
                </p>
              </div>
            </section>

            {/* NEW: Request Flow Section */}
            <section id="request-flow" className="scroll-mt-32">
               <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
                 <ArrowRight className="w-8 h-8 text-indigo-500" /> Proxy Request Flow
               </h2>
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                    To protect your API, you simply redirect your client-side requests to the Pingless Proxy URL and provide two specific headers.
                  </p>
                  
                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4">Required Headers</p>
                        <div className="space-y-4">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                              <span className="font-mono text-sm font-black">X-Pingless-Key</span>
                              <span className="text-xs text-slate-500">Your generated proxy token (ping_...)</span>
                           </div>
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <span className="font-mono text-sm font-black">X-Pingless-Target</span>
                              <span className="text-xs text-slate-500">The actual API URL you want to hit</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-black text-xl">Example Client Implementation</h4>
                        <div className="bg-[#020617] rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto shadow-2xl">
                           <pre>{`fetch('https://proxy.pingless.app', {
  method: 'GET',
  headers: {
    'X-Pingless-Key': 'ping_abc123...',
    'X-Pingless-Target': 'https://api.yourbackend.com/v1/user'
  }
})
.then(res => res.json())
.then(data => console.log('Protected Data:', data));`}</pre>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="scroll-mt-32">
              <h2 className="text-3xl font-black mb-12 flex items-center gap-3">
                <Cpu className="w-8 h-8 text-indigo-500" /> How Pingless Works
              </h2>
              <div className="space-y-6">
                {[
                  { step: 1, text: 'Connect your API endpoint to Pingless' },
                  { step: 2, text: 'All incoming requests pass through Pingless edge' },
                  { step: 3, text: 'Pingless evaluates traffic using rules (IP, rate, auth, behavior)' },
                  { step: 4, text: 'Legit requests are forwarded to your backend' },
                  { step: 5, text: 'Malicious traffic is blocked at the edge' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-all hover:border-indigo-500/30">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">{item.step}</div>
                    <p className="font-bold text-lg">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-32">
              <h2 className="text-3xl font-black mb-12">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Edge Protection', icon: Globe, desc: 'Traffic is filtered at the edge, not your server.' },
                  { title: 'Bot Blocking', icon: Shield, desc: 'Detects scrapers, automated bots, and suspicious patterns.' },
                  { title: 'No SDK Required', icon: Terminal, desc: 'No code changes. Works as a transparent proxy layer.' },
                  { title: 'Rate Limiting', icon: Activity, desc: 'Protect endpoints from brute force and volumetric abuse.' },
                  { title: 'Key Validation', icon: Lock, desc: 'Block unauthorized access instantly at the boundary.' },
                  { title: 'Real-Time Logs', icon: FileText, desc: 'Instant visibility into allowed and deflected requests.' },
                ].map((f, i) => (
                  <div key={i} className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <f.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-black text-xl">{f.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-32 text-center py-20 bg-indigo-600/5 rounded-[3rem] border border-indigo-500/10">
               <HelpCircle className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
               <h2 className="text-3xl font-black mb-4 tracking-tight">Need further help?</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Our engineering team is ready to assist with your custom setup.</p>
               <a href="mailto:contactpingless@gmail.com" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                  Contact Support <ArrowLeft className="w-5 h-5 rotate-180" />
               </a>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
