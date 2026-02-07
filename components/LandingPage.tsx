import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Check,
  ShieldAlert,
  Sun,
  Moon,
  ArrowRight,
  Activity,
  Cpu,
  Clock,
  BookOpen,
  Globe,
  Lock,
  Terminal,
  Server,
  ChevronDown,
  Zap,
  MousePointer2,
  Code2,
  Layers,
  BarChart3,
  Users,
  Sparkles
} from 'lucide-react';
import { AppRoute } from '../types';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-indigo-600 transition-colors group"
      >
        <span className="text-lg md:text-xl font-bold tracking-tight">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#E5E7EB] transition-colors duration-300 min-h-screen overflow-x-hidden relative">
      
      {/* BACKGROUND LAYER: Cyber Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-60"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={AppRoute.Landing} className="flex items-center gap-3 group">
            <Logo size="md" />
            <span className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tighter">Pingless</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-[#475569] dark:text-slate-400">
            <a href="#how" className="hover:text-indigo-600 dark:hover:text-white transition-colors">How it Works</a>
            <a href="#why" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to={AppRoute.Login} className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 hover:text-indigo-600">Login</Link>
            <Link to={AppRoute.Signup} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="stagger-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black tracking-widest uppercase mb-8">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            Edge-Level API Firewall — No SDK Required
          </div>
          
          <h1 className="stagger-2 text-6xl md:text-9xl font-black text-[#0F172A] dark:text-white tracking-tighter mb-10 leading-[0.9]">
            The Shield <br />
            <span className="text-indigo-600 inline-block">For Your APIs.</span>
          </h1>

          <p className="stagger-3 text-lg md:text-2xl text-[#475569] dark:text-slate-400 max-w-4xl mx-auto lg:mx-0 mb-14 leading-relaxed font-medium">
            Pingless is the modern API gateway that blocks bots, scrapers, and malicious IPs before they ever touch your backend. Redirect your traffic to our global edge proxy in 60 seconds.
          </p>

          <div className="stagger-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full">
            <Link to={AppRoute.Signup} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-6 rounded-[2rem] text-lg font-black transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group active:scale-95">
              Secure My API <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={AppRoute.Docs} className="w-full sm:w-auto glass-card text-[#0F172A] dark:text-white px-12 py-6 rounded-[2rem] text-lg font-black transition-all flex items-center justify-center gap-3 group active:scale-95">
              <BookOpen className="w-6 h-6 text-indigo-500 group-hover:rotate-6 transition-transform" /> Documentation
            </Link>
          </div>

          {/* Floating Edge Nodes Graphic */}
          <div className="mt-24 w-full relative h-64 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            
            <div className="relative flex items-center gap-6 md:gap-12 animate-float">
               <div className="w-16 h-16 md:w-24 md:h-24 glass-card rounded-[2rem] flex items-center justify-center shadow-2xl group transition-all hover:scale-110">
                  <Terminal className="w-8 h-8 md:w-12 md:h-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
               </div>
               
               <div className="flex-1 h-0.5 w-16 md:w-32 bg-indigo-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500 animate-[slide_2s_infinite]"></div>
               </div>

               <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] relative">
                  <div className="absolute inset-0 rounded-[2.5rem] bg-indigo-400 animate-ping opacity-20"></div>
                  <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-white" />
               </div>

               <div className="flex-1 h-0.5 w-16 md:w-32 bg-indigo-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500 animate-[slide_2s_infinite_0.5s]"></div>
               </div>

               <div className="w-16 h-16 md:w-24 md:h-24 glass-card rounded-[2rem] flex items-center justify-center shadow-2xl group transition-all hover:scale-110">
                  <Server className="w-8 h-8 md:w-12 md:h-12 text-slate-400 group-hover:text-emerald-500 transition-colors" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Pingless Section */}
      <section id="why" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Built for the modern edge.</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg">
              Enterprise-grade security without the enterprise-grade complexity or price tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'No SDK Overhead', 
                desc: 'Zero dependencies. Redirect your traffic and add two headers. That is it.',
                icon: Layers,
                color: 'text-indigo-500',
                bg: 'bg-indigo-500/10'
              },
              { 
                title: 'Ultra-Low Latency', 
                desc: 'Requests are processed at the edge in < 1ms, ensuring no perceptible impact on speed.',
                icon: Zap,
                color: 'text-amber-500',
                bg: 'bg-amber-500/10'
              },
              { 
                title: 'Bot Neutralization', 
                desc: 'Intelligent patterns identify and deflect automated scrapers before they hit your CPU.',
                icon: ShieldAlert,
                color: 'text-rose-500',
                bg: 'bg-rose-500/10'
              },
              { 
                title: 'Secret Vaulting', 
                desc: 'Safely store and inject your actual API keys at the edge so clients never see them.',
                icon: Lock,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10'
              },
              { 
                title: 'Traffic Analytics', 
                desc: 'Get deep visibility into ingress traffic, blocked attempts, and regional usage.',
                icon: BarChart3,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              { 
                title: 'Scales with You', 
                desc: 'Our global network of 250+ nodes grows automatically as your traffic spikes.',
                icon: Globe,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 shadow-inner`}>
                   <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how" className="py-32 px-6 bg-slate-900/5 dark:bg-slate-900/40 backdrop-blur-sm relative z-10 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Integration in <span className="text-indigo-600">60 seconds.</span></h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Stop messing with complex firewall configs. Pingless works where your code lives.</p>
              </div>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Generate a Proxy Key', desc: 'Create a new key in the dashboard and link it to your target URL.' },
                  { step: '02', title: 'Update your Fetch calls', desc: 'Change your base API URL to proxy.pingless.app.' },
                  { step: '03', title: 'Deploy to the Edge', desc: 'That is it. Your traffic is now proxied and protected globally.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-indigo-600 font-black text-2xl tracking-tighter pt-1">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-black mb-2">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="absolute -inset-4 bg-indigo-500/20 blur-[80px] rounded-full"></div>
               <div className="relative bg-[#020617] rounded-[2.5rem] p-8 shadow-2xl border border-white/10 font-mono text-[11px] md:text-xs overflow-hidden">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <pre className="text-indigo-400 leading-relaxed overflow-x-auto whitespace-pre">
{`// BEFORE: Directly hitting your server
fetch('https://api.myapp.com/v1/users', { ... });

// AFTER: Protected by Pingless Edge
fetch('https://proxy.pingless.app', {
  method: 'GET',
  headers: {
    'X-Pingless-Key': 'ping_live_823abc...',
    'X-Pingless-Target': 'https://api.myapp.com/v1/users'
  }
});`}
                  </pre>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Edge Protection Enabled</span>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500 font-black uppercase text-[10px]">Secure</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Simple, honest pricing.</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg">Choose a plan that scales with your traffic.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-12 rounded-[3.5rem] border border-slate-200 dark:border-white/5 relative flex flex-col group">
              <div className="mb-10">
                <h3 className="text-2xl font-black mb-2">Free Tier</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Perfect for side projects & hobbyists.</p>
              </div>
              <div className="mb-12 flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">$0</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ month</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['100,000 Monthly Requests', 'Global Edge Proxy', 'Basic Firewall Rules', 'Community Support', '1 Active Key'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link to={AppRoute.Signup} className="w-full py-5 rounded-2xl bg-slate-100 dark:bg-white/5 text-center font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white relative flex flex-col shadow-2xl shadow-indigo-600/30 group">
              <div className="absolute top-8 right-12 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <div className="mb-10">
                <h3 className="text-2xl font-black mb-2">Pro Developer</h3>
                <p className="text-indigo-100/70 text-sm font-medium">Scale your production apps safely.</p>
              </div>
              <div className="mb-12 flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">$9</span>
                <span className="text-indigo-200/60 font-bold uppercase tracking-widest text-xs">/ month</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {['10,000,000 Monthly Requests', 'Ultra-Low Latency Routing', 'Advanced Domain Filtering', 'Priority Support', 'Unlimited Proxy Keys', 'Custom Domain Support (Beta)'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-300" /> {item}
                  </li>
                ))}
              </ul>
              <Link to={AppRoute.Signup} className="w-full py-5 rounded-2xl bg-white text-indigo-600 text-center font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 relative z-10 bg-white/30 dark:bg-slate-900/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Frequently asked questions.</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Everything you need to know about the Pingless proxy.</p>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="Does using Pingless slow down my API?" 
              answer="Hardly. Our proxy logic is written in Rust and runs on Cloudflare Workers (the fastest edge network in the world). Latency overhead is typically under 1ms, which is often faster than standard DNS resolution." 
            />
            <FAQItem 
              question="What if I exceed my request limit?" 
              answer="We won't cut you off instantly. You will receive an email notification when you reach 80% and 100% of your quota. For Free tier, further requests may be throttled until the next billing cycle unless you upgrade." 
            />
            <FAQItem 
              question="Can I use Pingless with any backend?" 
              answer="Yes! As long as your backend is accessible via HTTPS, Pingless can proxy it. We work with AWS, GCP, Vercel, Heroku, and even self-hosted servers." 
            />
            <FAQItem 
              question="How do I keep my real API keys hidden?" 
              answer="You store your real keys in our 'Secret Vault'. When a request hits our edge, we inject that secret into the headers of the forwarded request. Your client-side code only ever sees the Pingless proxy key." 
            />
            <FAQItem 
              question="Is my data logged or stored?" 
              answer="We only log metadata (timestamp, status code, latency) to provide you with analytics. We do NOT store or inspect the body of your requests or responses. Your privacy is our architecture." 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-900 border border-white/5 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-10"></div>
           <div className="relative z-10">
             <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">Ready to harden your <br /> API boundary?</h2>
             <p className="text-slate-400 max-w-xl mx-auto mb-12 font-medium text-lg">Join hundreds of developers securing their infrastructure at the edge today.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to={AppRoute.Signup} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group">
                 Get Started for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link to={AppRoute.Docs} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3">
                 View Documentation
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-200 dark:border-slate-800 relative z-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <Link to={AppRoute.Landing} className="flex items-center gap-3 group">
              <Logo size="md" />
              <span className="text-2xl font-black tracking-tighter">Pingless</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
              Global API protection and firewall. Secure your infrastructure at the edge without changing a single line of backend code.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                  <Activity className="w-5 h-5" />
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                  <Globe className="w-5 h-5" />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
               <li><a href="#how" className="hover:text-indigo-600 transition-colors">How it Works</a></li>
               <li><a href="#why" className="hover:text-indigo-600 transition-colors">Why Pingless</a></li>
               <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
               <li><Link to={AppRoute.Docs} className="hover:text-indigo-600 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
               <li><Link to={AppRoute.Developers} className="hover:text-indigo-600 transition-colors flex items-center gap-2">Developer's Desk <Sparkles className="w-3 h-3 text-amber-500" /></Link></li>
               <li><a href="mailto:contactpingless@gmail.com" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
               <li><a href="#" className="hover:text-indigo-600 transition-colors">Status</a></li>
               <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 Pingless Edge Security Inc.</p>
           <div className="flex gap-10">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> All Systems Operational
              </span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;