
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Key, 
  ShieldAlert, 
  CreditCard, 
  User as UserIcon, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { auth } from '../services/firebase';
import { User, AppRoute } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate(AppRoute.Landing);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  const navItems = [
    { name: 'Dashboard', path: AppRoute.Dashboard, icon: LayoutDashboard },
    { name: 'API Keys', path: AppRoute.Keys, icon: Key },
    { name: 'Firewall', path: AppRoute.Rules, icon: ShieldAlert },
    { name: 'Billing', path: AppRoute.Billing, icon: CreditCard },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-[#E5E7EB] transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" onError={handleImageError} className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">Pingless</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-[#475569] dark:text-slate-400">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[#475569] dark:text-slate-400">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col 
        bg-white dark:bg-[#020617] transition-all duration-300 ease-in-out
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" onError={handleImageError} className="w-10 h-10" />
            <span className="text-xl font-black tracking-tighter text-[#0F172A] dark:text-white">Pingless</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-600/20' 
                  : 'text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {/* Desktop Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden lg:flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             <span className="font-bold text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <Link
            to={AppRoute.Profile}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === AppRoute.Profile 
              ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' 
              : 'text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-bold text-sm">Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#475569] dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-12 lg:p-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
