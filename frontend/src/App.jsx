// Workshop Index design: warm document surfaces, ink navigation, cobalt state signals, and a persistent index spine.
import { useEffect, useState } from 'react';
import AppShell from './components/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reports from './pages/Reports.jsx';
import SalesEntry from './pages/SalesEntry.jsx';
import SalesHistory from './pages/SalesHistory.jsx';

const protectedViews = { dashboard: Dashboard, inventory: Inventory, 'new-sale': SalesEntry, sales: SalesHistory, reports: Reports };

function currentView() { return window.location.hash.replace('#/', '') || 'dashboard'; }

export default function App() {
  const [view, setView] = useState(currentView());
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('store_manager_user') || 'null'));

  useEffect(() => {
    const sync = () => setView(currentView());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const establishSession = ({ token, user }) => {
    localStorage.setItem('store_manager_token', token);
    localStorage.setItem('store_manager_user', JSON.stringify(user));
    setSession(user);
    window.location.hash = '#/dashboard';
  };

  const signOut = () => {
    localStorage.removeItem('store_manager_token');
    localStorage.removeItem('store_manager_user');
    setSession(null);
    window.location.hash = '#/login';
  };

  if (!session) {
    return view === 'register' ? <Register onAuthenticated={establishSession} /> : <Login onAuthenticated={establishSession} />;
  }

  const ActivePage = protectedViews[view] || Dashboard;
  return <AppShell user={session} activeView={view} onSignOut={signOut}><ActivePage /></AppShell>;
}

