
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { User, AppRoute, PlanType } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { ensureUserExists, subscribeToUser, updateUserPlan } from './services/database';

// Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import KeysPage from './components/KeysPage';
import RulesPage from './components/RulesPage';
import BillingPage from './components/BillingPage';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import DocsPage from './components/DocsPage';
import DevelopersPage from './components/DevelopersPage';
import PlaygroundPage from './components/PlaygroundPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await ensureUserExists(firebaseUser);
        setUser(userData);
        const unsubUser = subscribeToUser(firebaseUser.uid, (updatedUser) => {
          setUser(updatedUser);
        });
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout_success') === 'true') {
          const newPlan = params.get('plan') as PlanType;
          if (newPlan) {
            await updateUserPlan(firebaseUser.uid, newPlan);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
        return () => unsubUser();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path={AppRoute.Landing} element={user ? <Navigate to={AppRoute.Dashboard} /> : <LandingPage />} />
          <Route path={AppRoute.Login} element={user ? <Navigate to={AppRoute.Dashboard} /> : <AuthPage mode="login" />} />
          <Route path={AppRoute.Signup} element={user ? <Navigate to={AppRoute.Dashboard} /> : <AuthPage mode="signup" />} />
          <Route path={AppRoute.Docs} element={<DocsPage />} />
          <Route path={AppRoute.Developers} element={<DevelopersPage />} />
          
          <Route element={user ? <Layout user={user} /> : <Navigate to={AppRoute.Login} />}>
            <Route path={AppRoute.Dashboard} element={<Dashboard user={user!} />} />
            <Route path={AppRoute.Keys} element={<KeysPage user={user!} />} />
            <Route path={AppRoute.Rules} element={<RulesPage user={user!} />} />
            <Route path={AppRoute.Billing} element={<BillingPage user={user!} />} />
            <Route path={AppRoute.Profile} element={<ProfilePage user={user!} />} />
            <Route path={AppRoute.Playground} element={<PlaygroundPage user={user!} />} />
          </Route>

          <Route path="*" element={<Navigate to={AppRoute.Landing} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
