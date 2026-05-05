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

const VIDEO_SERVICES = [
  { id: 'Direct',        label: 'Direct',        icon: '🎬', desc: 'Creative direction on set' },
  { id: 'Shoot',         label: 'Shoot',         icon: '📹', desc: 'Camera operation' },
  { id: 'Edit',          label: 'Edit',          icon: '✂️',  desc: 'Video editing & assembly' },
  { id: 'Color Correct', label: 'Color Correct', icon: '🎨', desc: 'Color grading & correction' },
  { id: 'Sound Design',  label: 'Sound Design',  icon: '🎧', desc: 'Audio mix & sound design' },
];

function SelectCard({ label, options, value, onChange }) {
  return (
    <div className="fcard">
      <div className="fcard-label">{label}</div>
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

function MultiServiceCard({ label, hint, services, selected, onToggle, color = 'purple' }) {
  return (
    <div className="fcard video-services-card">
      <div className="fcard-label">{label}</div>
      {hint && <p className="video-services-hint">{hint}</p>}
      <div className="video-services-grid">
        {services.map((s) => {
          const active = selected.includes(s.id);
          return (
            <button
              key={s.id}
              className={`service-btn ${active ? `service-btn-${color}` : ''}`}
              onClick={() => onToggle(s.id)}
            >
              <span className="service-icon">{s.icon}</span>
              <span className="service-label">{s.label}</span>
              <span className="service-desc">{s.desc}</span>
              {active && <span className="service-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YesNoCard({ label, hint, value, onChange, color = 'purple' }) {
  return (
    <div className="fcard">
      <div className="fcard-label">{label}</div>
      {hint && <p className="video-services-hint">{hint}</p>}
      <div className="yes-no-row">
        <button
          className={`yes-no-btn ${value === true ? `yes-no-${color}` : ''}`}
          onClick={() => onChange(true)}
        >
          ✓ Yes
        </button>
        <button
          className={`yes-no-btn ${value === false ? `yes-no-${color}` : ''}`}
          onClick={() => onChange(false)}
        >
          ✕ No
        </button>
      </div>
    </div>
  );
}

const isVideo = (type) => type === 'video' || type === 'photo+video';

export default function EmployerForm({ onSubmit, defaultLocation = '' }) {
  const [form, setForm] = useState({
    mediaType:         '',
    useCase:           '',
    deliverables:      '',
    usageRights:       '',
    timeline:          '',
    talentLevel:       1,
    location:          defaultLocation,
    ownBudget:         '',
    videoServices:     [],
    equipmentProvided: null,
  });
  const [hasBudget, setHasBudget] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleMediaType = (id) => {
    setForm((f) => ({ ...f, mediaType: id, useCase: '', videoServices: [], equipmentProvided: null }));
  };

  const handleBudgetToggle = () => {
    setHasBudget((b) => !b);
    if (hasBudget) setForm((f) => ({ ...f, ownBudget: '' }));
  };

  const handleBudgetInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    set('ownBudget')(raw);
  };

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      videoServices: f.videoServices.includes(id)
        ? f.videoServices.filter((s) => s !== id)
        : [...f.videoServices, id],
    }));
  };

  const useCaseOptions =
    form.mediaType === 'photo'       ? USE_CASES_PHOTO :
    form.mediaType === 'video'       ? USE_CASES_VIDEO :
    form.mediaType === 'photo+video' ? USE_CASES_BOTH  : [];

  const talentLabel   = TALENT_LEVELS[form.talentLevel];
  const talentPercent = (form.talentLevel / (TALENT_LEVELS.length - 1)) * 100;
  const thumbLeft     = `calc(${talentPercent}% - 11px)`;

  const videoRequired = isVideo(form.mediaType);
  const canSubmit =
    form.mediaType &&
    form.useCase &&
    form.deliverables &&
    form.usageRights &&
    form.timeline &&
    (!videoRequired || (form.videoServices.length > 0 && form.equipmentProvided !== null));

  const budgetDisplay = form.ownBudget ? `$${Number(form.ownBudget).toLocaleString()}` : '';

  return (
    <>
      <div className="form-header purple-form-header">
        <div className="form-header-eyebrow">🏢 Employer</div>
        <h1 className="form-header-title">What should<br />you budget?</h1>
        <p className="form-header-sub">Describe the project and we'll show you the fair market rate — so you make an offer that lands.</p>
      </div>

      <div className="form-body">

        {/* Budget toggle */}
        <div className={`budget-toggle-card ${hasBudget ? 'budget-toggle-active' : ''}`}>
          <div className="budget-toggle-top">
            <div>
              <div className="budget-toggle-title">I have a set budget</div>
              <div className="budget-toggle-sub">Get recommendations tailored to what you can spend</div>
            </div>
            <button className={`toggle-btn ${hasBudget ? 'toggle-on' : ''}`} onClick={handleBudgetToggle} aria-label="Toggle budget">
              <div className="toggle-knob" />
            </button>
          </div>
          {hasBudget && (
            <div className="budget-input-wrap">
              <span className="budget-dollar">$</span>
              <input
                type="text" inputMode="numeric" className="budget-input"
                placeholder="e.g. 2,500"
                value={budgetDisplay.replace('$', '')}
                onChange={handleBudgetInput}
              />
            </div>
          )}
        </div>

        {/* Media Type */}
        <div className="fcard">
          <div className="fcard-label">What do you need?</div>
          <div className="media-type-row">
            {MEDIA_TYPES.map((m) => {
              const sel = form.mediaType === m.id;
              return (
                <button
                  key={m.id}
                  className={`media-btn ${sel ? 'media-btn-purple' : ''}`}
                  onClick={() => handleMediaType(m.id)}
                >
                  <span className="media-icon">{m.icon}</span>
                  <span className={`media-label ${sel ? 'media-label-purple' : ''}`}>{m.label}</span>
                  <span className="media-desc">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video-specific fields */}
        {videoRequired && (
          <>
            <MultiServiceCard
              label="Video Services Needed"
              hint="Select all you need the contractor to handle"
              services={VIDEO_SERVICES}
              selected={form.videoServices}
              onToggle={toggleService}
              color="purple"
            />
            <YesNoCard
              label="Will you provide camera equipment?"
              hint="If yes, the contractor won't need to bring their own camera package"
              value={form.equipmentProvided}
              onChange={set('equipmentProvided')}
              color="purple"
            />
          </>
        )}

        {form.mediaType && (
          <SelectCard label="What's it for?" options={useCaseOptions} value={form.useCase} onChange={set('useCase')} />
        )}

        <div className="fcard">
          <div className="fcard-label">Deliverables Needed</div>
          <textarea
            className="fcard-textarea"
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

        <div className="fcard">
          <div className="fcard-label">Location <span className="fcard-optional">(optional)</span></div>
          <input type="text" className="fcard-input" placeholder="e.g. Los Angeles, CA"
            value={form.location} onChange={(e) => set('location')(e.target.value)} />
        </div>

        <div className="fcard">
          <div className="fcard-slider-header">
            <span className="fcard-label" style={{ marginBottom: 0 }}>Talent Level Preferred</span>
            <span className="slider-val">{talentLabel.split(' (')[0]}</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-track">
              <div className="slider-fill purple" style={{ width: `${talentPercent}%` }} />
              <div className="slider-thumb" style={{ left: thumbLeft }} />
              <input type="range" min={0} max={3} step={1} value={form.talentLevel}
                onChange={(e) => set('talentLevel')(Number(e.target.value))}
                style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 24, top: -10 }} />
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
          ✦ {hasBudget && form.ownBudget ? 'Analyze My Budget' : 'Get Fair Budget Range'}
        </button>
        {!canSubmit && <p className="cta-hint">Fill in all fields above to continue</p>}
      </div>
    </>
  );
}
