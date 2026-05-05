'use client';
import { useState } from 'react';
import DeliverablesPicker, { serializeDeliverables } from './DeliverablesPicker';

const MEDIA_TYPES = [
  { id: 'photo',       label: 'Photo',         icon: '📷', desc: 'Photography only' },
  { id: 'video',       label: 'Video',         icon: '🎬', desc: 'Videography only' },
  { id: 'photo+video', label: 'Photo + Video', icon: '✨', desc: 'Both together' },
];

const PROJECT_TYPES_PHOTO = ['Commercial', 'Wedding', 'Editorial', 'Social Content', 'Event', 'Real Estate', 'Portrait', 'Product'];
const PROJECT_TYPES_VIDEO = ['Commercial / Ad', 'Wedding Film', 'Brand Story', 'Social / Reels', 'Documentary', 'Music Video', 'Corporate', 'Event'];
const PROJECT_TYPES_BOTH  = ['Commercial Campaign', 'Wedding Day', 'Brand Content', 'Social Package', 'Product Launch', 'Event Coverage'];

const CLIENT_TYPES  = ['Ad Agency', 'Small Business', 'Large Brand', 'Individual / Personal', 'Nonprofit'];
const USAGE_OPTIONS = ['1-Year Digital', '2-Year Digital Exclusive', 'Print + Digital', 'Unlimited / In Perpetuity', 'Editorial Only'];
const TIMELINE_OPTS = ['Same day', '2–3 business days', '5 business days', '1–2 weeks', '1 month+'];
const EXP_LEVELS    = ['Emerging (0–2 yrs)', 'Mid-Level (3–6 yrs)', 'Senior (7–12 yrs)', 'Top-Tier (12+ yrs)'];

const VIDEO_SERVICES = [
  { id: 'Direct',          label: 'Direct',          icon: '🎬', desc: 'Creative direction on set' },
  { id: 'Shoot',           label: 'Shoot',           icon: '📹', desc: 'Camera operation' },
  { id: 'Edit',            label: 'Edit',            icon: '✂️',  desc: 'Video editing & assembly' },
  { id: 'Color Correct',   label: 'Color Correct',   icon: '🎨', desc: 'Color grading & correction' },
  { id: 'Sound Design',    label: 'Sound Design',    icon: '🎧', desc: 'Audio mix & sound design' },
];

function SelectCard({ label, options, value, onChange, color = 'blue' }) {
  return (
    <div className="fcard">
      <div className="fcard-label">{label}</div>
      <div className="tags">
        {options.map((o) => (
          <button
            key={o}
            className={`tag ${value === o ? `sel-${color}` : ''}`}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiServiceCard({ label, hint, services, selected, onToggle, color = 'blue' }) {
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

function YesNoCard({ label, hint, value, onChange, color = 'blue' }) {
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

export default function ContractorForm({ onSubmit, defaultLocation = '' }) {
  const [form, setForm] = useState({
    mediaType:       '',
    projectType:     '',
    deliverables:    [],
    clientType:      '',
    usageRights:     '',
    timeline:        '',
    experienceLevel: 1,
    location:        defaultLocation,
    videoServices:   [],
    providesCamera:  null,
  });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleMediaType = (id) => {
    setForm((f) => ({ ...f, mediaType: id, projectType: '', deliverables: [], videoServices: [], providesCamera: null }));
  };

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      videoServices: f.videoServices.includes(id)
        ? f.videoServices.filter((s) => s !== id)
        : [...f.videoServices, id],
    }));
  };

  const projectTypeOptions =
    form.mediaType === 'photo'       ? PROJECT_TYPES_PHOTO :
    form.mediaType === 'video'       ? PROJECT_TYPES_VIDEO :
    form.mediaType === 'photo+video' ? PROJECT_TYPES_BOTH  : [];

  const expLabel   = EXP_LEVELS[form.experienceLevel];
  const expPercent = (form.experienceLevel / (EXP_LEVELS.length - 1)) * 100;
  const thumbLeft  = `calc(${expPercent}% - 11px)`;

  const videoRequired = isVideo(form.mediaType);
  const canSubmit =
    form.mediaType &&
    form.projectType &&
    form.deliverables.length > 0 &&
    form.clientType &&
    form.usageRights &&
    form.timeline &&
    (!videoRequired || (form.videoServices.length > 0 && form.providesCamera !== null));

  return (
    <>
      <div className="form-header blue-form-header">
        <div className="form-header-eyebrow">📸 Contractor</div>
        <h1 className="form-header-title">What's this<br />project worth?</h1>
        <p className="form-header-sub">Tell us about the job and we'll give you a rate, a range, and the words to back it up.</p>
      </div>

      <div className="form-body">

        {/* Media Type */}
        <div className="fcard">
          <div className="fcard-label">What are you shooting?</div>
          <div className="media-type-row">
            {MEDIA_TYPES.map((m) => {
              const sel = form.mediaType === m.id;
              return (
                <button
                  key={m.id}
                  className={`media-btn ${sel ? 'media-btn-blue' : ''}`}
                  onClick={() => handleMediaType(m.id)}
                >
                  <span className="media-icon">{m.icon}</span>
                  <span className={`media-label ${sel ? 'media-label-blue' : ''}`}>{m.label}</span>
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
              label="Video Services You'll Provide"
              hint="Select all that apply — each adds to your rate"
              services={VIDEO_SERVICES}
              selected={form.videoServices}
              onToggle={toggleService}
              color="blue"
            />
            <YesNoCard
              label="Do you provide your own camera & equipment?"
              hint="Bringing a camera package typically adds $300–800/day"
              value={form.providesCamera}
              onChange={set('providesCamera')}
              color="blue"
            />
          </>
        )}

        {form.mediaType && (
          <SelectCard label="Project Type" options={projectTypeOptions} value={form.projectType} onChange={set('projectType')} />
        )}

        {form.mediaType && (
          <DeliverablesPicker
            mediaType={form.mediaType}
            selected={form.deliverables}
            onChange={set('deliverables')}
            color="blue"
          />
        )}

        <SelectCard label="Client Type"         options={CLIENT_TYPES}  value={form.clientType}  onChange={set('clientType')} />
        <SelectCard label="Usage Rights"        options={USAGE_OPTIONS} value={form.usageRights} onChange={set('usageRights')} />
        <SelectCard label="Turnaround Timeline" options={TIMELINE_OPTS} value={form.timeline}    onChange={set('timeline')} />

        <div className="fcard">
          <div className="fcard-label">Your Location <span className="fcard-optional">(optional)</span></div>
          <input
            type="text"
            className="fcard-input"
            placeholder="e.g. New York, NY"
            value={form.location}
            onChange={(e) => set('location')(e.target.value)}
          />
        </div>

        <div className="fcard">
          <div className="fcard-slider-header">
            <span className="fcard-label" style={{ marginBottom: 0 }}>Your Experience Level</span>
            <span className="slider-val">{expLabel.split(' (')[0]}</span>
          </div>
          <div className="slider-wrap">
            <div className="slider-track">
              <div className="slider-fill blue" style={{ width: `${expPercent}%` }} />
              <div className="slider-thumb" style={{ left: thumbLeft }} />
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
        <button className="btn blue" onClick={() => onSubmit({ ...form, deliverables: serializeDeliverables(form.deliverables) })} disabled={!canSubmit}>
          ✦ Calculate My Rate
        </button>
        {!canSubmit && (
          <p className="cta-hint">Fill in all fields above to continue</p>
        )}
      </div>
    </>
  );
}
