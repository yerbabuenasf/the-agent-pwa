'use client';

import { useState, useEffect } from 'react';
import RoleScreen     from '@/components/RoleScreen';
import ContractorForm from '@/components/ContractorForm';
import EmployerForm   from '@/components/EmployerForm';
import ResultScreen   from '@/components/ResultScreen';
import HistoryScreen  from '@/components/HistoryScreen';
import ProfileScreen  from '@/components/ProfileScreen';

function usePWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
}

const HISTORY_KEY = 'agent_history';
const PROFILE_KEY = 'agent_profile';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
}

export default function App() {
  usePWA();

  // ── All state at the top ───────────────────────────────────
  const [screen,  setScreen]  = useState('role');
  const [role,    setRole]    = useState('');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [anim,    setAnim]    = useState('');
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [navTab,  setNavTab]  = useState('rates'); // 'rates' | 'history' | 'profile'

  // ── Load persisted data on mount ──────────────────────────
  useEffect(() => {
    setHistory(loadHistory());
    const p = loadProfile();
    setProfile(p);
    if (p.defaultRole) setRole(p.defaultRole);
  }, []);

  const isContractor = role === 'contractor';
  const navColor     = isContractor ? 'blue' : 'purple';

  // ── Navigation helpers ─────────────────────────────────────
  function goForward(next) { setAnim('slide-in');   setScreen(next); }
  function goBackward(next) { setAnim('slide-back'); setScreen(next); }

  function goBack() {
    if (screen === 'result' || screen === 'error') goBackward('form');
    else if (screen === 'form') goBackward('role');
  }

  function goRole() {
    setAnim('slide-back');
    setScreen('role');
    setResult(null);
    setNavTab('rates');
  }

  function goTab(tab) {
    setNavTab(tab);
    setAnim('slide-in');
    if (tab === 'rates')   { setScreen('role'); setResult(null); }
    if (tab === 'history') setScreen('history');
    if (tab === 'profile') setScreen('profile');
  }

  // ── History helpers ────────────────────────────────────────
  function saveToHistory(formData, res) {
    const item = {
      id:          Date.now(),
      date:        new Date().toISOString(),
      role,
      mediaType:   formData.mediaType,
      projectType: formData.projectType || formData.useCase || 'Project',
      recommended: res.recommended,
      floor:       res.floor,
      ceiling:     res.ceiling,
      result:      res,
    };
    const next = [item, ...history].slice(0, 50); // keep last 50
    setHistory(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  }

  function deleteHistory(id) {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  }

  function viewHistoryItem(item) {
    setRole(item.role);
    setResult(item.result);
    setNavTab('rates');
    goForward('result');
  }

  // ── Profile save ───────────────────────────────────────────
  function saveProfile(data) {
    setProfile(data);
    if (data.defaultRole) setRole(data.defaultRole);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch {}
  }

  // ── API call ───────────────────────────────────────────────
  async function handleFormSubmit(formData) {
    goForward('loading');
    setError('');
    try {
      const res = await fetch('/api/rate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role, ...formData }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      saveToHistory(formData, data);
      goForward('result');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      goForward('error');
    }
  }

  // ── Render current screen ──────────────────────────────────
  function renderScreen() {
    switch (screen) {
      case 'role':
        return (
          <RoleScreen
            role={role}
            onSelect={setRole}
            onContinue={() => role && goForward('form')}
          />
        );
      case 'form':
        return isContractor
          ? <ContractorForm onSubmit={handleFormSubmit} defaultLocation={profile.location} />
          : <EmployerForm   onSubmit={handleFormSubmit} defaultLocation={profile.location} />;
      case 'loading':
        return (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-title">Analyzing the market...</div>
            <div className="loading-sub">
              Claude is calculating rates based on your project details, usage rights, and market conditions.
            </div>
          </div>
        );
      case 'result':
        return (
          <ResultScreen
            role={role}
            result={result}
            onBack={goBack}
          />
        );
      case 'error':
        return (
          <div>
            <div className="error-banner">⚠️ {error}</div>
            <div className="cta-wrap">
              <button className="btn blue" onClick={goBack}>← Try Again</button>
            </div>
          </div>
        );
      case 'history':
        return (
          <HistoryScreen
            history={history}
            onView={viewHistoryItem}
            onDelete={deleteHistory}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onSave={saveProfile}
          />
        );
      default:
        return null;
    }
  }

  const showBack    = screen === 'form' || screen === 'result' || screen === 'error';
  const showLoading = screen === 'loading';
  const profileInitial = profile.name ? profile.name.trim()[0].toUpperCase() : 'J';

  return (
    <div className="app-shell">

      <nav className="top-nav">
        {showBack ? (
          <button className={`back-btn ${navColor}`} onClick={goBack}>‹ Back</button>
        ) : (
          <div className="logo">the <span>agent</span></div>
        )}
        {showBack && (
          <div className="logo" onClick={goRole} style={{ cursor: 'pointer' }}>
            the <span>agent</span>
          </div>
        )}
        <div className="avatar" onClick={() => goTab('profile')} style={{ cursor: 'pointer' }}>
          {profileInitial}
        </div>
      </nav>

      <div key={screen} className={`screen-content ${anim}`}>
        {renderScreen()}
      </div>

      {!showLoading && (
        <nav className="bottom-nav">
          <button className="bn-item" onClick={() => goTab('rates')}>
            <span className="bn-icon">💰</span>
            <span className={`bn-label ${navTab === 'rates' ? 'active' : ''}`}>Rates</span>
          </button>
          <button className="bn-item" onClick={() => goTab('history')}>
            <span className="bn-icon">📋</span>
            <span className={`bn-label ${navTab === 'history' ? 'active' : ''}`}>History</span>
          </button>
          <button className="bn-item" onClick={() => goTab('profile')}>
            <span className="bn-icon">👤</span>
            <span className={`bn-label ${navTab === 'profile' ? 'active' : ''}`}>Profile</span>
          </button>
        </nav>
      )}

    </div>
  );
}
