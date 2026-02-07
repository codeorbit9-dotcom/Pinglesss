
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
  ArrowRight,
  Home
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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md px-4 sm:px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to={AppRoute.Landing} className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">P</div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">Pingless</span>
            </Link>
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400">
               <ChevronRight className="w-4 h-4" /> 
               <span className="uppercase tracking-widest">Documentation</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop: Back to Home Button */}
            <Link 
              to={AppRoute.Landing}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Developer Desk Link */}
            <Link 
              to={AppRoute.Developers} 
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-500 dark:hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <Code className="w-4 h-4" />
              Developer Desk
            </Link>

            {/* Sign In Link */}
            <Link 
              to={AppRoute.Login} 
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
            >
              Sign In
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            
            {/* Mobile Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex pt-20 lg:pt-24 min-h-screen">
        {/* Responsive Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-slate-800 p-6 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:z-30 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <div className="space-y-8">
            {/* Mobile Header in Sidebar */}
            <div className="lg:hidden flex items-center justify-between mb-6">
               <span className="font-black text-lg">Menu</span>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Primary Mobile Actions */}
            <div className="lg:hidden space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <Link 
                to={AppRoute.Landing} 
                className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Landing Page
              </Link>
              <Link 
                to={AppRoute.Developers} 
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300"
              >
                <Code className="w-4 h-4" /> Developer Desk
              </Link>
            </div>

            {/* Navigation Sections */}
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Contents</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-left ${
                    activeSection === s.id 
                      ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <s.icon className={`w-4 h-4 ${activeSection === s.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                  {s.title}
                </button>
              ))}
            </div>
            
            {/* Sidebar Footer Info */}
            <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-indigo-500 mb-2 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> System Status
                  </p>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <p className="text-xs font-bold">All Systems Operational</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-12 max-w-4xl mx-auto">
          {/* Big Back Button (Desktop) */}
          <div className="hidden lg:block mb-10">
             <Link 
               to={AppRoute.Landing} 
               className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/30 transition-all font-bold group shadow-sm"
             >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
               Return to Landing Page
             </Link>
          </div>

          <div className="space-y-32 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-32">
              <h1 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">Pingless Documentation</h1>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Pingless is an edge-based API protection proxy that blocks bots, malicious IPs, abusive traffic, and unauthorized access before requests reach your backend. 
                  It works without SDKs or backend code changes.
                </p>
              </div>
            </section>

            {/* Request Flow Section */}
            <section id="request-flow" className="scroll-mt-32">
               <h2 className="text-3xl font-black mb-12 flex items-center gap-3 text-slate-900 dark:text-white">
                 <ArrowRight className="w-8 h-8 text-indigo-500" /> Proxy Request Flow
               </h2>
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                    To protect your API, you simply redirect your client-side requests to the Pingless Proxy URL and provide two specific headers.
                  </p>
                  
                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4">Required Headers</p>
                        <div className="space-y-4">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                              <span className="font-mono text-sm font-black text-slate-700 dark:text-slate-200">X-Pingless-Key</span>
                              <span className="text-xs text-slate-500">Your generated proxy token (ping_...)</span>
                           </div>
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <span className="font-mono text-sm font-black text-slate-700 dark:text-slate-200">X-Pingless-Target</span>
                              <span className="text-xs text-slate-500">The actual API URL you want to hit</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-black text-xl text-slate-900 dark:text-white">Example Client Implementation</h4>
                        <div className="bg-[#020617] rounded-2xl p-6 font-mono text-[11px] md:text-xs leading-relaxed text-slate-300 overflow-x-auto shadow-2xl border border-slate-800">
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
              <h2 className="text-3xl font-black mb-12 flex items-center gap-3 text-slate-900 dark:text-white">
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
                  <div key={i} className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-all hover:border-indigo-500/30 hover:shadow-md">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20 flex-shrink-0">{item.step}</div>
                    <p className="font-bold text-lg text-slate-700 dark:text-slate-200">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section id="features" className="scroll-mt-32">
              <h2 className="text-3xl font-black mb-12 text-slate-900 dark:text-white">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Edge Protection', icon: Globe, desc: 'Traffic is filtered at the edge, not your server.' },
                  { title: 'Bot Blocking', icon: Shield, desc: 'Detects scrapers, automated bots, and suspicious patterns.' },
                  { title: 'No SDK Required', icon: Terminal, desc: 'No code changes. Works as a transparent proxy layer.' },
                  { title: 'Rate Limiting', icon: Activity, desc: 'Protect endpoints from brute force and volumetric abuse.' },
                  { title: 'Key Validation', icon: Lock, desc: 'Block unauthorized access instantly at the boundary.' },
                  { title: 'Real-Time Logs', icon: FileText, desc: 'Instant visibility into allowed and deflected requests.' },
                ].map((f, i) => (
                  <div key={i} className="space-y-4 p-6 rounded-[2rem] hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <f.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">{f.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-32 text-center py-20 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[3rem] border border-indigo-500/10">
               <HelpCircle className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
               <h2 className="text-3xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">Need further help?</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Our engineering team is ready to assist with your custom setup.</p>
               <a href="mailto:contactpingless@gmail.com" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
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
