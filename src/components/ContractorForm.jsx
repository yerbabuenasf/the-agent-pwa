'use client';
import { useState } from 'react';

const MEDIA_TYPES = [
  { id: 'photo',       label: 'Photo',         icon: '📷', desc: 'Photography only' },
  { id: 'video',       label: 'Video',         icon: '🎬', desc: 'Videography only' },
  { id: 'photo+video', label: 'Photo + Video', icon: '✨', desc: 'Both together' },
];

const PROJECT_TYPES_PHOTO = ['Commercial', 'Wedding', 'Editorial', 'Social Content', 'Event', 'Real Estate', 'Portrait', 'Product'];
const PROJECT_TYPES_VIDEO = ['Commercial / Ad', 'Wedding Film', 'Brand Story', 'Social / Reels', 'Documentary', 'Music Video', 'Corporate', 'Event'];
const PROJECT_TYPES_BOTH  = ['Commercial Campaign', 'Wedding Day', 'Brand Content', 'Social Package', 'Product Launch', 'Event Coverage'];

const CLIENT_TYPES  = ['Ad Agency', 'Small Business', 'Fortune 500', 'Individual / Personal', 'Nonprofit'];
const USAGE_OPTIONS = ['1-Year Digital', '2-Year Digital Exclusive', 'Print + Digital', 'Unlimited / In Perpetuity', 'Editorial Only'];
const TIMELINE_OPTS = ['Same day', '2–3 business days', '5 business days', '1–2 weeks', '1 month+'];
const EXP_LEVELS    = ['Emerging (0–2 yrs)', 'Mid-Level (3–6 yrs)', 'Senior (7–12 yrs)', 'Top-Tier (12+ yrs)'];

function SelectCard({ label, options, value, onChange }) {
  return (
    <div className="card">
      <div className="block-label">{label}</div>
      <div className="tags">
        {options.map((o) => (
          <button key={o} className={`tag ${value === o ? 'sel-blue' : ''}`} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ContractorForm({ onSubmit }) {
  const [form, setForm] = useState({
    mediaType:      '',
    projectType:    '',
    deliverables:   '',
    clientType:     '',
    usageRights:    '',
    timeline:       '',
    experienceLevel: 1,
    location:       '',
  });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // When media type changes, reset project type
  const handleMediaType = (id) => {
    setForm((f) => ({ ...f, mediaType: id, projectType: '' }));
  };

  const projectTypeOptions =
    form.mediaType === 'photo'       ? PROJECT_TYPES_PHOTO :
    form.mediaType === 'video'       ? PROJECT_TYPES_VIDEO :
    form.mediaType === 'photo+video' ? PROJECT_TYPES_BOTH  : [];

  const expLabel   = EXP_LEVELS[form.experienceLevel];
  const expPercent = (form.experienceLevel / (EXP_LEVELS.length - 1)) * 100;
  const thumbLeft  = `calc(${expPercent}% - 11px)`;

  const canSubmit = form.mediaType && form.projectType && form.deliverables && form.clientType && form.usageRights && form.timeline;

  return (
    <>
      <div className="hero blue-hero">
        <div className="hero-eyebrow blue">📸 Contractor Mode</div>
        <h1>What's this project worth?</h1>
        <p>Tell us about the job and we'll give you a rate, a range, and the words to back it up.</p>
      </div>

      <div className="form-body">

        {/* Media Type — big 3-card selector */}
        <div className="card">
          <div className="block-label">What are you shooting?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {MEDIA_TYPES.map((m) => {
              const selected = form.mediaType === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMediaType(m.id)}
                  style={{
                    flex: 1, padding: '14px 8px', borderRadius: 14,
                    border: `2px solid ${selected ? '#4F8EF7' : '#E5E7EB'}`,
                    background: selected ? '#EEF4FF' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{m.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selected ? '#4F8EF7' : '#0F172A' }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Type — appears after media type is chosen */}
        {form.mediaType && (
          <SelectCard
            label="Project Type"
            options={projectTypeOptions}
            value={form.projectType}
            onChange={set('projectType')}
          />
        )}

        <div className="card">
          <div className="block-label">Deliverables</div>
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
              'e.g. 30 edited photos + 1 BTS reel'
            }
            value={form.deliverables}
            onChange={(e) => set('deliverables')(e.target.value)}
          />
        </div>

        <SelectCard label="Client Type"         options={CLIENT_TYPES}   value={form.clientType}  onChange={set('clientType')} />
        <SelectCard label="Usage Rights"        options={USAGE_OPTIONS}  value={form.usageRights} onChange={set('usageRights')} />
        <SelectCard label="Turnaround Timeline" options={TIMELINE_OPTS}  value={form.timeline}    onChange={set('timeline')} />

        <div className="card">
          <div className="block-label">Your Location <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 10 }}>(optional)</span></div>
          <input
            type="text"
            style={{
              width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
              padding: '10px 12px', fontSize: 14, fontFamily: 'inherit',
              color: '#0F172A', background: '#F7F9FC', outline: 'none',
            }}
            placeholder="e.g. New York, NY"
            value={form.location}
            onChange={(e) => set('location')(e.target.value)}
          />
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="block-label" style={{ marginBottom: 0 }}>Your Experience Level</span>
            <span className="slider-val">{expLabel.split(' (')[0]}</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-track">
              <div className="slider-fill blue" style={{ width: `${expPercent}%` }} />
              <div className="slider-thumb blue" style={{ left: thumbLeft }} />
              <input
                type="range" min={0} max={3} step={1}
                value={form.experienceLevel}
                onChange={(e) => set('experienceLevel')(Number(e.target.value))}
                style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 24, top: -10 }}
              />
            </div>
            <div className="slider-ticks">
              <span className="slider-tick">Emerging</span>
              <span className="slider-tick">Mid</span>
              <span className="slider-tick">Senior</span>
              <span className="slider-tick">Top-Tier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-wrap">
        <button className="btn blue" onClick={() => onSubmit(form)} disabled={!canSubmit}>
          ✦ Calculate My Rate
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
