'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function decodeShareData(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad  = b64 + '=='.slice(0, (4 - b64.length % 4) % 4);
    return JSON.parse(atob(pad));
  } catch { return null; }
}

const fmt = (n) => `$${Number(n).toLocaleString()}`;

function ShareView() {
  const params  = useSearchParams();
  const [data,     setData]     = useState(null);
  const [approved, setApproved] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [invalid,  setInvalid]  = useState(false);

  useEffect(() => {
    const d = params.get('d');
    if (!d) { setInvalid(true); return; }
    const decoded = decodeShareData(d);
    if (!decoded?.result) { setInvalid(true); return; }
    setData(decoded);
  }, [params]);

  const handleApprove = () => {
    setApproved(true);
  };

  const handleCopyApproval = () => {
    if (!data) return;
    const { role, result } = data;
    const isContractor = role === 'contractor';
    const text = isContractor
      ? `✅ I've reviewed and approved the rate of ${fmt(result.recommended)} for this project. Looking forward to working together!`
      : `✅ I've reviewed the budget proposal of ${fmt(result.recommended)} and I'm good to move forward. Let's connect!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (invalid) {
    return (
      <div className="share-page">
        <div className="share-invalid">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <h2>Link not found</h2>
          <p>This link may have expired or been modified.</p>
          <a href="/app" className="share-cta-link">Try The Agent →</a>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="share-page">
        <div className="share-loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const { role, result } = data;
  const isContractor = role === 'contractor';
  const color        = isContractor ? 'blue' : 'purple';

  const LABELS = {
    contractor: { low: 'Floor', mid: 'Target', high: 'Ceiling' },
    employer:   { low: 'Minimum', mid: 'Fair', high: 'Top-Tier' },
  };
  const labels   = LABELS[role];
  const floorPct = 44;
  const midPct   = Math.round((result.recommended / result.ceiling) * 95);

  return (
    <div className="share-page">

      {/* Header */}
      <div className="share-topbar">
        <div className="logo">the <span>agent</span></div>
        <div className="share-topbar-tag">Rate Proposal</div>
      </div>

      {/* Hero */}
      <div className={`result-hero ${color}-hero`}>
        <div className="result-sub">
          {isContractor ? 'Proposed Rate' : 'Proposed Budget'}
        </div>
        <div className="result-rate">{fmt(result.recommended)}</div>
        <div className={`result-range ${color}`}>
          Range: {fmt(result.floor)} – {fmt(result.ceiling)}
        </div>
        {result.rationale && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 10, lineHeight: 1.5 }}>
            {result.rationale}
          </p>
        )}
      </div>

      <div className="form-body" style={{ paddingBottom: 0 }}>

        {/* Approve section */}
        {!approved ? (
          <div className="approve-card">
            <div className="approve-title">
              {isContractor
                ? 'Does this rate work for you?'
                : 'Does this budget work for you?'}
            </div>
            <div className="approve-sub">
              This rate was calculated based on current market data. Tap below to approve.
            </div>
            <button className={`btn ${color}`} onClick={handleApprove}>
              ✓ Approve This {isContractor ? 'Rate' : 'Budget'}
            </button>
          </div>
        ) : (
          <div className="approved-card">
            <div className="approved-check">✓</div>
            <div className="approved-title">Rate Approved!</div>
            <div className="approved-sub">
              You've agreed to {fmt(result.recommended)}. Copy the message below to send back.
            </div>
            <button className="btn outline-blue" onClick={handleCopyApproval}>
              {copied ? '✓ Copied!' : '📋 Copy Approval Message'}
            </button>
          </div>
        )}

        {/* Rate bars */}
        <div className="card">
          <div className="block-label">Rate Breakdown</div>
          <div className="bar-row">
            <span className="bar-lbl">{labels.low}</span>
            <div className="bar-track"><div className="bar-fill low" style={{ width: `${floorPct}%` }} /></div>
            <span className="bar-amt">{fmt(result.floor)}</span>
          </div>
          <div className="bar-row">
            <span className="bar-lbl">{labels.mid}</span>
            <div className="bar-track"><div className={`bar-fill mid-${color[0]}`} style={{ width: `${midPct}%` }} /></div>
            <span className="bar-amt">{fmt(result.recommended)}</span>
          </div>
          <div className="bar-row">
            <span className="bar-lbl">{labels.high}</span>
            <div className="bar-track"><div className={`bar-fill high-${color[0]}`} style={{ width: '100%' }} /></div>
            <span className="bar-amt">{fmt(result.ceiling)}</span>
          </div>
        </div>

        {/* Factors */}
        {result.factors?.length > 0 && (
          <div className="factors-card">
            <div className="factors-title">What's shaping this rate</div>
            {result.factors.map((f, i) => (
              <div className="factor-row" key={i}>
                <span className="f-icon">{f.icon}</span>
                <span className="f-text">{f.text}</span>
                <span className={`badge ${f.impact}`}>{f.impact === 'up' ? '+$' : f.impact === 'down' ? '–$' : 'info'}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="share-footer">
          <p className="share-footer-text">Rate calculated with The Agent — rate negotiation for photo & video professionals.</p>
          <a href="/app" className="share-cta-link">Get your own rate →</a>
        </div>

      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="share-page">
        <div className="share-loading"><div className="spinner" /></div>
      </div>
    }>
      <ShareView />
    </Suspense>
  );
}
