'use client';
import { useState } from 'react';

export default function ProfileScreen({ profile, onSave }) {
  const [form, setForm]   = useState({ name: profile.name || '', location: profile.location || '', defaultRole: profile.defaultRole || '' });
  const [saved, setSaved] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = form.name ? form.name.trim()[0].toUpperCase() : '?';

  return (
    <div className="profile-screen">

      {/* Avatar hero */}
      <div className="profile-hero">
        <div className="profile-avatar-lg">{initial}</div>
        <div className="profile-name-display">{form.name || 'Your Name'}</div>
        {form.defaultRole && (
          <div className="profile-role-badge">
            {form.defaultRole === 'contractor' ? '📸 Contractor' : '🏢 Employer'}
          </div>
        )}
      </div>

      <div className="profile-body">

        <div className="fcard">
          <div className="fcard-label">Your Name</div>
          <input
            type="text"
            className="fcard-input"
            placeholder="e.g. Joey Blue"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
          />
        </div>

        <div className="fcard">
          <div className="fcard-label">Default Location</div>
          <input
            type="text"
            className="fcard-input"
            placeholder="e.g. Los Angeles, CA"
            value={form.location}
            onChange={(e) => set('location')(e.target.value)}
          />
          <p className="profile-field-hint">Pre-fills the location field on every form</p>
        </div>

        <div className="fcard">
          <div className="fcard-label">I am usually a...</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            <button
              className={`role-pill ${form.defaultRole === 'contractor' ? 'role-pill-blue' : ''}`}
              onClick={() => set('defaultRole')(form.defaultRole === 'contractor' ? '' : 'contractor')}
            >
              📸 Contractor
            </button>
            <button
              className={`role-pill ${form.defaultRole === 'employer' ? 'role-pill-purple' : ''}`}
              onClick={() => set('defaultRole')(form.defaultRole === 'employer' ? '' : 'employer')}
            >
              🏢 Employer
            </button>
          </div>
          <p className="profile-field-hint">Pre-selects your role on the home screen</p>
        </div>

        <button className="btn blue" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Profile'}
        </button>

        <p className="profile-privacy-note">
          🔒 Your profile is stored locally on your device only
        </p>
      </div>
    </div>
  );
}
