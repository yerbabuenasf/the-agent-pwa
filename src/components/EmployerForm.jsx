'use client';
import { useState } from 'react';

const MEDIA_TYPES = [
  { id: 'photo',       label: 'Photo',         icon: '📷', desc: 'Photography only' },
  { id: 'video',       label: 'Video',         icon: '🎬', desc: 'Videography only' },
  { id: 'photo+video', label: 'Photo + Video', icon: '✨', desc: 'Both together' },
];

const USE_CASES_PHOTO = ['Product Launch', 'Brand / Lifestyle', 'Social Media', 'Website / Editorial', 'Event Coverage', 'E-commerce'];
const USE_CASES_VIDEO = ['Commercial / Ad', 'Brand Story', 'Social / Reels', 'Product Demo', 'Event Recap', 'Corporate / Internal'];
const USE_CASES_BOTH  = ['Full Campaign', 'Product Launch', 'Brand Content', 'Social Package', 'Event Coverage', 'Website Refresh'];

const USAGE_OPTIONS = ['1-Year Digital', '2-Year Digital Exclusive', 'Print + Digital', 'Unlimited / In Perpetuity', 'Editorial Only'];
const TIMELINE_OPTS = ['Same day', '2–3 business days', '5 business days', '1–2 weeks', '1 month+'];
const TALENT_LEVELS = ['Emerging (budget-friendly)', 'Experienced (mid-market)', 'Senior (premium)', 'Top-Tier (agency-level)'];

function SelectCard({ label, options, value, onChange }) {
  return (
    <div className="card">
      <div className="block-label">{label}</div>
      <div className="tags">
        {options.map((o) => (
          <button key={o} className={`tag ${value === o ? 'sel-purple' : ''}`} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EmployerForm({ onSubmit }) {
  const [form, setForm] = useState({
    mediaType:    '',
    useCase:      '',
    deliverables: '',
    usageRights:  '',
    timeline:     '',
    talentLevel:  1,
    location:     '',
  });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleMediaType = (id) => {
    setForm((f) => ({ ...f, mediaType: id, useCase: '' }));
  };

  const useCaseOptions =
    form.mediaType === 'photo'       ? USE_CASES_PHOTO :
    form.mediaType === 'video'       ? USE_CASES_VIDEO :
    form.mediaType === 'photo+video' ? USE_CASES_BOTH  : [];

  const talentLabel   = TALENT_LEVELS[form.talentLevel];
  const talentPercent = (form.talentLevel / (TALENT_LEVELS.length - 1)) * 100;
  const thumbLeft     = `calc(${talentPercent}% - 11px)`;

  const canSubmit = form.mediaType && form.useCase && form.deliverables && form.usageRights && form.timeline;

  return (
    <>
      <div className="hero purple-hero">
        <div className="hero-eyebrow purple">🏢 Employer Mode</div>
        <h1>What should you budget for this?</h1>
        <p>Describe the project and we'll show you the fair market rate — so you make an offer that lands.</p>
      </div>

      <div className="form-body">

        {/* Media Type — big 3-card selector */}
        <div className="card">
          <div className="block-label">What do you need?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {MEDIA_TYPES.map((m) => {
              const selected = form.mediaType === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMediaType(m.id)}
                  style={{
                    flex: 1, padding: '14px 8px', borderRadius: 14,
                    border: `2px solid ${selected ? '#7B5CF7' : '#E5E7EB'}`,
                    background: selected ? '#F5F0FF' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selected ? '#7B5CF7' : '#0F172A' }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {form.mediaType && (
          <SelectCard
            label="What's it for?"
            options={useCaseOptions}
            value={form.useCase}
            onChange={set('useCase')}
          />
        )}

        <div className="card">
          <div className="block-label">Deliverables Needed</div>
          <textarea
            style={{
              width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
              padding: '10px 12px', fontSize: 14, fontFamily: 'inherit',
              color: '#0F172A', background: '#F7F9FC', resize: 'none', outline: 'none',
              minHeight: 72, lineHeight: 1.5,
            }}
            placeholder={
              form.mediaType === 'photo'       ? 'e.g. 30 edited images, 5 hero shots' :
              form.mediaType === 'video'       ? 'e.g. 60-sec hero video + 3 social cuts' :
              form.mediaType === 'photo+video' ? 'e.g. 20 photos + 60-sec video + BTS reel' :
              'e.g. 30 photos + 1 hero video'
            }
            value={form.deliverables}
            onChange={(e) => set('deliverables')(e.target.value)}
          />
        </div>

        <SelectCard label="Usage Rights You Need" options={USAGE_OPTIONS} value={form.usageRights} onChange={set('usageRights')} />
        <SelectCard label="Timeline"              options={TIMELINE_OPTS} value={form.timeline}    onChange={set('timeline')} />

        <div className="card">
          <div className="block-label">Location <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span></div>
          <input
            type="text"
            style={{
              width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
              padding: '10px 12px', fontSize: 14, fontFamily: 'inherit',
              color: '#0F172A', background: '#F7F9FC', outline: 'none',
            }}
            placeholder="e.g. Los Angeles, CA"
            value={form.location}
            onChange={(e) => set('location')(e.target.value)}
          />
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="block-label" style={{ marginBottom: 0 }}>Talent Level Preferred</span>
            <span className="slider-val">{talentLabel.split(' (')[0]}</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-track">
              <div className="slider-fill purple" style={{ width: `${talentPercent}%` }} />
              <div className="slider-thumb purple" style={{ left: thumbLeft }} />
              <input
                type="range" min={0} max={3} step={1}
                value={form.talentLevel}
                onChange={(e) => set('talentLevel')(Number(e.target.value))}
                style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 24, top: -10 }}
              />
            </div>
            <div className="slider-ticks">
              <span className="slider-tick">Emerging</span>
              <span className="slider-tick">Experienced</span>
              <span className="slider-tick">Senior</span>
              <span className="slider-tick">Top-Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-wrap">
        <button className="btn purple" onClick={() => onSubmit(form)} disabled={!canSubmit}>
          ✦ Get Fair Budget Range
        </button>
        {!canSubmit && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
            Fill in all fields above to continue
          </p>
        )}
      </div>
    </>
  );
}
