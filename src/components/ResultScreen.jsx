'use client';
import { useState } from 'react';

const ICONS = {
  contractor: { low: 'Floor', mid: 'Target', high: 'Ceiling' },
  employer:   { low: 'Minimum', mid: 'Fair', high: 'Top-Tier' },
};

const fmt = (n) => `$${Number(n).toLocaleString()}`;

function ApprovalSheet({ role, result, onClose }) {
  const [approved, setApproved] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const isContractor = role === 'contractor';
  const color = isContractor ? 'blue' : 'purple';

  const handleApprove = () => setApproved(true);

  const handleCopyApproval = () => {
    const text = isContractor
      ? `✅ I've reviewed and approved the rate of ${fmt(result.recommended)} for this project. Looking forward to working together!`
      : `✅ I've reviewed the budget proposal of ${fmt(result.recommended)} and I'm good to move forward. Let's connect!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Rate summary */}
        <div className={`sheet-hero ${color}-hero`}>
          <div className="result-sub">
            {isContractor ? 'Proposed Rate' : 'Proposed Budget'}
          </div>
          <div className="sheet-rate">{fmt(result.recommended)}</div>
          <div className={`result-range ${color}`}>
            Range: {fmt(result.floor)} – {fmt(result.ceiling)}
          </div>
        </div>

        <div className="sheet-body">
          {/* Factors */}
          {result.factors?.length > 0 && (
            <div className="factors-card" style={{ marginBottom: 14 }}>
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

          {/* Approve or approved state */}
          {!approved ? (
            <>
              <p className="sheet-approve-prompt">
                {isContractor ? 'Does this rate work for you?' : 'Does this budget work for you?'}
              </p>
              <button className={`btn ${color}`} onClick={handleApprove}>
                ✓ Approve This {isContractor ? 'Rate' : 'Budget'}
              </button>
              <button className="sheet-cancel-btn" onClick={onClose}>
                Not yet
              </button>
            </>
          ) : (
            <div className="approved-card">
              <div className="approved-check">✓</div>
              <div className="approved-title">Rate Approved!</div>
              <div className="approved-sub">
                Copy the message below to send back to confirm.
              </div>
              <button className="btn outline-blue" onClick={handleCopyApproval}>
                {copied ? '✓ Copied!' : '📋 Copy Approval Message'}
              </button>
              <button className="sheet-cancel-btn" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultScreen({ role, result, onBack }) {
  const [copied,      setCopied]      = useState(false);
  const [showSheet,   setShowSheet]   = useState(false);

  const isContractor = role === 'contractor';
  const color        = isContractor ? 'blue' : 'purple';
  const labels       = ICONS[role];

  const floorPct = 44;
  const midPct   = Math.round((result.recommended / result.ceiling) * 95);
  const highPct  = 100;

  const handleCopy = () => {
    const text = isContractor
      ? `My rate for this project: ${fmt(result.recommended)}\nRange: ${fmt(result.floor)} – ${fmt(result.ceiling)}\n\n${result.script}`
      : `Fair market budget: ${fmt(result.recommended)}\nRange: ${fmt(result.floor)} – ${fmt(result.ceiling)}\n\n${result.script}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <>
      <div className={`result-hero ${color}-hero`}>
        <div className="result-sub">{isContractor ? 'Recommended Rate' : 'Fair Market Budget'}</div>
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

        {/* Rate Bars */}
        <div className="card">
          <div className="block-label">{isContractor ? 'Rate Breakdown' : 'Budget Breakdown'}</div>
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
            <div className="bar-track"><div className={`bar-fill high-${color[0]}`} style={{ width: `${highPct}%` }} /></div>
            <span className="bar-amt">{fmt(result.ceiling)}</span>
          </div>
        </div>

        {/* Factors */}
        {result.factors?.length > 0 && (
          <div className="factors-card">
            <div className="factors-title">
              {isContractor ? "What's driving your rate" : "What's shaping this budget"}
            </div>
            {result.factors.map((f, i) => (
              <div className="factor-row" key={i}>
                <span className="f-icon">{f.icon}</span>
                <span className="f-text">{f.text}</span>
                <span className={`badge ${f.impact}`}>{f.impact === 'up' ? '+$' : f.impact === 'down' ? '–$' : 'info'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Script */}
        {result.script && (
          <div className={`script-card ${color}`}>
            <div className={`script-title ${color}`}>
              💬 {isContractor ? "If they say it's too high..." : 'How to make an offer that lands...'}
            </div>
            <div className={`script-text ${isContractor ? '' : 'purple'}`}>
              "{result.script}"
            </div>
          </div>
        )}

        {/* Savings — employer only */}
        {!isContractor && result.savings?.length > 0 && (
          <>
            <div className="savings-divider">
              <div className="savings-line" />
              <span className="savings-label">Ways to bring the cost down</span>
              <div className="savings-line" />
            </div>
            <div className="savings-card">
              <div className="savings-title">💡 Budget-saving options</div>
              {result.savings.map((s, i) => (
                <div className="savings-row" key={i}>
                  <span className="f-icon">{s.icon}</span>
                  <span className="f-text">{s.suggestion}</span>
                  <span className="savings-impact">{s.impact}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="action-wrap">
        <button className={`btn ${color}`} onClick={handleCopy}>
          📋 {isContractor ? 'Copy Rate + Script' : 'Copy Budget + Script'}
        </button>
        <div className="action-row-2">
          <button className={`btn outline-${color}`} onClick={() => setShowSheet(true)}>
            ↗ Get Approval
          </button>
          <button className={`btn outline-${color}`} onClick={onBack}>
            ← Edit
          </button>
        </div>
      </div>

      {copied && <div className="toast">Copied to clipboard ✓</div>}

      {/* In-app approval sheet */}
      {showSheet && (
        <ApprovalSheet
          role={role}
          result={result}
          onClose={() => setShowSheet(false)}
        />
      )}
    </>
  );
}
