'use client';

import { useState, useEffect } from 'react';
import RoleScreen     from '@/components/RoleScreen';
import ContractorForm from '@/components/ContractorForm';
import EmployerForm   from '@/components/EmployerForm';
import ResultScreen   from '@/components/ResultScreen';

function usePWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);
}

export default function App() {
  usePWA();

  // ── All state at the top ───────────────────────────────────
  const [screen, setScreen] = useState('role');
  const [role,   setRole]   = useState('');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');
  const [anim,   setAnim]   = useState('');

  const isContractor = role === 'contractor';
  const navColor     = isContractor ? 'blue' : 'purple';

  // ── Navigation helpers ─────────────────────────────────────
  function goForward(next) {
    setAnim('slide-in');
    setScreen(next);
  }

  function goBackward(next) {
    setAnim('slide-back');
    setScreen(next);
  }

  function goBack() {
    if (screen === 'result' || screen === 'error') goBackward('form');
    else if (screen === 'form') goBackward('role');
  }

  function goRole() {
    setAnim('slide-back');
    setScreen('role');
    setResult(null);
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
          ? <ContractorForm onSubmit={handleFormSubmit} />
          : <EmployerForm   onSubmit={handleFormSubmit} />;
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
      default:
        return null;
    }
  }

  const showBack = screen === 'form' || screen === 'result' || screen === 'error';

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
        <div className="avatar">J</div>
      </nav>

      <div key={screen} className={`screen-content ${anim}`}>
        {renderScreen()}
      </div>

      <nav className="bottom-nav">
        <button className="bn-item" onClick={goRole}>
          <span className="bn-icon">💰</span>
          <span className="bn-label active">Rates</span>
        </button>
        <button className="bn-item">
          <span className="bn-icon">📋</span>
          <span className="bn-label">History</span>
        </button>
        <button className="bn-item">
          <span className="bn-icon">👤</span>
          <span className="bn-label">Profile</span>
        </button>
      </nav>

    </div>
  );
}
