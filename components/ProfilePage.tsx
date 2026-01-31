
import React from 'react';
import { User as UserIcon, Mail, Shield, Trash2, Save, LogOut } from 'lucide-react';
import { User, AppRoute } from '../types';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate(AppRoute.Landing);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, preferences and security settings.</p>
      </header>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {user.name?.[0] || 'D'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                  {user.plan} PLAN
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  defaultValue={user.name}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  defaultValue={user.email}
                  disabled
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-10 py-3 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/80 p-8 space-y-6">
           <div>
             <h4 className="text-slate-900 dark:text-white font-bold mb-2 flex items-center gap-2">
               <Shield className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Security Options
             </h4>
             <p className="text-slate-500 dark:text-slate-400 text-sm">Review your account security and authentication methods.</p>
           </div>
           
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-slate-500 text-xs">Add an extra layer of security to your account.</p>
                </div>
                <button className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">Enable</button>
             </div>
             
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-2xl text-slate-600 dark:text-slate-300 font-medium transition-all"
              >
                <LogOut className="w-5 h-5" /> Sign Out from This Device
             </button>
           </div>
        </div>

        <div className="p-8 border-t border-slate-200 dark:border-slate-800">
           <div className="flex items-center justify-between p-6 border-2 border-rose-500/20 bg-rose-500/5 rounded-2xl">
             <div>
               <h4 className="text-rose-500 font-bold mb-1">Delete Account</h4>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Once you delete your account, all your edge rules and API keys will be permanently removed.</p>
             </div>
             <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
               <Trash2 className="w-4 h-4" /> Delete
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
