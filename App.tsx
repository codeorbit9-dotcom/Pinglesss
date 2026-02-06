
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { User, AppRoute, PlanType } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { ensureUserExists, subscribeToUser, updateUserPlan } from './services/database';

// Eagerly loaded components for fast initial paint
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

// Lazy loaded components (heavy libraries like Recharts are here)
const Layout = lazy(() => import('./components/Layout'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const KeysPage = lazy(() => import('./components/KeysPage'));
const RulesPage = lazy(() => import('./components/RulesPage'));
const BillingPage = lazy(() => import('./components/BillingPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const DocsPage = lazy(() => import('./components/DocsPage'));
const DevelopersPage = lazy(() => import('./components/DevelopersPage'));
const PlaygroundPage = lazy(() => import('./components/PlaygroundPage'));

// Lightweight loading component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Edge Console...</p>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
        } catch (e) {
          console.error("User init failed", e);
        }
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // Show a minor overlay only if we are transitioning to a page that REQUIRES auth
  // This allows the Landing page to show instantly

  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes - No loading block */}
            <Route path={AppRoute.Landing} element={user && authInitialized ? <Navigate to={AppRoute.Dashboard} /> : <LandingPage />} />
            <Route path={AppRoute.Login} element={user && authInitialized ? <Navigate to={AppRoute.Dashboard} /> : <AuthPage mode="login" />} />
            <Route path={AppRoute.Signup} element={user && authInitialized ? <Navigate to={AppRoute.Dashboard} /> : <AuthPage mode="signup" />} />
            <Route path={AppRoute.Docs} element={<DocsPage />} />
            <Route path={AppRoute.Developers} element={<DevelopersPage />} />
            
            {/* Protected Routes - Use authInitialized to guard */}
            <Route element={authInitialized ? (user ? <Layout user={user} /> : <Navigate to={AppRoute.Login} />) : <PageLoader />}>
              <Route path={AppRoute.Dashboard} element={<Dashboard user={user!} />} />
              <Route path={AppRoute.Keys} element={<KeysPage user={user!} />} />
              <Route path={AppRoute.Rules} element={<RulesPage user={user!} />} />
              <Route path={AppRoute.Billing} element={<BillingPage user={user!} />} />
              <Route path={AppRoute.Profile} element={<ProfilePage user={user!} />} />
              <Route path={AppRoute.Playground} element={<PlaygroundPage user={user!} />} />
            </Route>

            <Route path="*" element={<Navigate to={AppRoute.Landing} />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
