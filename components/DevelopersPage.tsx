import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Instagram, 
  Code2, 
  Sparkles,
  Award,
  User as UserIcon
} from 'lucide-react';
import { AppRoute } from '../types';
import Logo from './Logo';

const DevelopersPage: React.FC = () => {
  const devs = [
    {
      name: "Shoaib Akhtar",
      role: "Founder & CEO",
      bio: "Product-driven founder focused on building fast, privacy-first, and scalable systems. Obsessed with solving real-world problems through clean UX, smart architecture, and zero-bloat engineering. Building the future of edge security.",
      socials: {
        instagram: "shoaibakhtarx"
      },
      tags: ["Founder", "CEO", "Architecture"]
    },
    {
      name: "Shubham Kashyap",
      role: "Co-Founder & CTO",
      bio: "Engineering-first builder with deep experience in backend systems, APIs, and infrastructure. Passionate about performance, security, and turning complex ideas into simple products. Architecting high-availability systems.",
      socials: {
        instagram: "shubham_kashyap_.007"
      },
      tags: ["Co-Founder", "CTO", "Infrastructure"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#E5E7EB] transition-colors duration-300">
      {/* Decorative Nodes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to={AppRoute.Landing} className="flex items-center gap-2 group">
            <Logo size="sm" />
            <span className="text-xl font-black tracking-tighter">Pingless</span>
          </Link>
          <Link to={AppRoute.Docs} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Docs
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative">
        <header className="text-center mb-24 animate-fade-slide">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-6">
            <Sparkles className="w-3 h-3" /> BUILT BY BUILDERS
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Developer's Desk</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Designed by founders who understand real problems, not just features.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {devs.map((dev, idx) => (
            <div 
              key={idx} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Placeholder Image (Icon-based) */}
                <div className="w-44 h-44 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden mb-10 shadow-xl group-hover:border-indigo-500/50 transition-colors duration-500 flex items-center justify-center">
                  <UserIcon className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-3xl font-black tracking-tight">{dev.name}</h3>
                      {idx === 0 && <Award className="w-6 h-6 text-amber-500" title="Main Founder" />}
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] leading-none mb-6">{dev.role}</p>
                  </div>

                  {/* Enlarged Bio Text */}
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-[1.6] text-lg md:text-xl italic">
                    "{dev.bio}"
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 pt-6">
                    {dev.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-center gap-4">
                   {dev.socials.instagram && (
                     <a 
                       href={`https://instagram.com/${dev.socials.instagram}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all shadow-md group/social scale-110"
                       title={`Follow ${dev.name} on Instagram`}
                     >
                       <Instagram className="w-7 h-7" />
                     </a>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-40 text-center animate-fade-slide">
           <div className="max-w-3xl mx-auto space-y-8">
              <Code2 className="w-16 h-16 text-indigo-500 mx-auto opacity-20" />
              <h2 className="text-4xl font-black tracking-tight">Built with passion. Built for developers.</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">
                Pingless started as a solution to a personal problem: how to secure APIs without the overhead of massive enterprise WAFs. Today, it serves thousands of requests every minute across the globe.
              </p>
              <div className="pt-8 flex justify-center items-center gap-12">
                 <div className="text-center">
                    <p className="text-3xl font-black text-indigo-600">2024</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Founded</p>
                 </div>
                 <div className="h-12 w-px bg-slate-200 dark:bg-slate-800"></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-indigo-600">Global</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reach</p>
                 </div>
                 <div className="h-12 w-px bg-slate-200 dark:bg-slate-800"></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-indigo-600">Secure</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Infrastructure</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-6 text-[#475569] dark:text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to={AppRoute.Landing} className="flex items-center gap-2 group">
             <Logo size="sm" className="opacity-80 group-hover:opacity-100" />
            <span className="text-lg font-black text-[#0F172A] dark:text-white tracking-tighter">Pingless</span>
          </Link>
          <p className="text-xs font-medium">© 2026 Pingless Inc. Dedicated to clear, trusted security.</p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
            <Link to={AppRoute.Landing} className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to={AppRoute.Docs} className="hover:text-indigo-600 transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DevelopersPage;