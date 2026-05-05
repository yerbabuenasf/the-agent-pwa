'use client';
import { useState } from 'react';

const ICONS = {
  contractor: { low: 'Floor', mid: 'Target', high: 'Ceiling' },
  employer:   { low: 'Minimum', mid: 'Fair', high: 'Top-Tier' },
};

const fmt = (n) => `$${Number(n).toLocaleString()}`;

// Parse deliverables string into a clean array of line items
function parseDeliverables(str = '') {
  return str
    .split(/[,\n+•\-–]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

function ApprovalSheet({ role, result, formData, onClose }) {
  const [approved, setApproved] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const isContractor = role === 'contractor';
  const color = isContractor ? 'blue' : 'purple';

  const deliverables   = parseDeliverables(formData?.deliverables);
  const usageRights    = formData?.usageRights  || null;
  const timeline       = formData?.timeline     || null;
  const projectType    = formData?.projectType  || formData?.useCase || null;
  const mediaType      = formData?.mediaType    || null;
  const videoServices  = formData?.videoServices || [];
  const providesCamera = formData?.providesCamera ?? null;

  const SERVICE_ICONS = {
    'Direct':        '🎬',
    'Shoot':         '📹',
    'Edit':          '✂️',
    'Color Correct': '🎨',
    'Sound Design':  '🎧',
  };

  const handleApprove = () => setApproved(true);

  const handleCopyProposal = () => {
    const serviceLines = videoServices.map((id) => `• ${SERVICE_ICONS[id] || '🎥'} ${id}`);
    const cameraLine = providesCamera !== null
      ? (providesCamera ? `• 📦 Camera & equipment provided` : `• 📦 Client provides camera equipment`)
      : null;

    const lines = [
      `📋 PROJECT PROPOSAL`,
      ``,
      `Rate: ${fmt(result.recommended)}`,
      `Range: ${fmt(result.floor)} – ${fmt(result.ceiling)}`,
      ``,
      `DELIVERABLES`,
      ...deliverables.map((d) => `• ${d}`),
      ...(serviceLines.length > 0 ? [``, `VIDEO SERVICES`, ...serviceLines] : []),
      cameraLine,
      ``,
      usageRights ? `Usage Rights: ${usageRights}` : null,
      timeline    ? `Timeline: ${timeline}`         : null,
      ``,
      approved
        ? `✅ Status: APPROVED`
        : `Please review and confirm by replying.`,
      ``,
      `— Powered by The Agent`,
    ].filter((l) => l !== null).join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Proposal header */}
        <div className="proposal-header">
          <div className="proposal-tag">Project Proposal</div>
          <div className="proposal-rate">{fmt(result.recommended)}</div>
          <div className={`result-range ${color}`} style={{ fontSize: 13 }}>
            Range: {fmt(result.floor)} – {fmt(result.ceiling)}
          </div>
        </div>

        <div className="sheet-body">

          {/* Meta row */}
          {(projectType || mediaType) && (
            <div className="proposal-meta-row">
              {mediaType    && <span className="proposal-meta-chip">{mediaType === 'photo' ? '📷 Photo' : mediaType === 'video' ? '🎬 Video' : '✨ Photo + Video'}</span>}
              {projectType  && <span className="proposal-meta-chip">{projectType}</span>}
            </div>
          )}

          {/* Deliverables list */}
          <div className="proposal-section">
            <div className="proposal-section-title">What's included</div>
            {deliverables.length > 0 || videoServices.length > 0 ? (
              <div className="deliverables-list">
                {deliverables.map((d, i) => (
                  <div className="deliverable-row" key={`d-${i}`}>
                    <div className={`deliverable-dot ${color}-dot`} />
                    <span className="deliverable-text">{d}</span>
                  </div>
                ))}
                {videoServices.length > 0 && (
                  <>
                    {videoServices.map((id) => (
                      <div className="deliverable-row" key={`vs-${id}`}>
                        <span className="deliverable-service-icon">{SERVICE_ICONS[id] || '🎥'}</span>
                        <span className="deliverable-text">{id}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <p className="proposal-empty">No deliverables specified.</p>
            )}
          </div>

          {/* Usage + timeline + camera */}
          {(usageRights || timeline || providesCamera !== null) && (
            <div className="proposal-section">
              <div className="proposal-section-title">Terms</div>
              <div className="proposal-terms">
                {usageRights && (
                  <div className="proposal-term-row">
                    <span className="proposal-term-label">Usage Rights</span>
                    <span className="proposal-term-value">{usageRights}</span>
                  </div>
                )}
                {timeline && (
                  <div className="proposal-term-row">
                    <span className="proposal-term-label">Timeline</span>
                    <span className="proposal-term-value">{timeline}</span>
                  </div>
                )}
                {providesCamera !== null && (
                  <div className="proposal-term-row">
                    <span className="proposal-term-label">Camera & Equipment</span>
                    <span className="proposal-term-value">{providesCamera ? 'Provided by contractor' : 'Provided by client'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approve / approved */}
          {!approved ? (
            <>
              <button className={`btn ${color}`} onClick={handleApprove}>
                ✓ Approve This Proposal
              </button>
              <div className="proposal-action-row">
                <button className={`btn outline-${color}`} onClick={handleCopyProposal}>
                  {copied ? '✓ Copied!' : '📋 Copy Proposal'}
                </button>
                <button className="sheet-cancel-btn-inline" onClick={onClose}>
                  Not yet
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="approved-card">
                <div className="approved-check">✓</div>
                <div className="approved-title">Proposal Approved!</div>
                <div className="approved-sub">
                  {fmt(result.recommended)} agreed. Copy and send to confirm.
                </div>
              </div>
              <button className={`btn outline-${color}`} onClick={handleCopyProposal}>
                {copied ? '✓ Copied!' : '📋 Copy Approved Proposal'}
              </button>
              <button className="sheet-cancel-btn" onClick={onClose}>Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultScreen({ role, result, formData, onBack }) {
  const [copied,    setCopied]    = useState(false);
  const [showSheet, setShowSheet] = useState(false);

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
            ↗ Send Proposal
          </button>
          <button className={`btn outline-${color}`} onClick={onBack}>
            ← Edit
          </button>
        </div>
      </div>

      {copied && <div className="toast">Copied to clipboard ✓</div>}

      {showSheet && (
        <ApprovalSheet
          role={role}
          result={result}
          formData={formData}
          onClose={() => setShowSheet(false)}
        />
      )}
    </>
  );
}
