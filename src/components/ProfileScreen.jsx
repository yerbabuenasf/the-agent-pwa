'use client';
import { useState, useRef } from 'react';

// Resize image to max 300x300 and return base64
function resizeImage(file, maxSize = 300) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale  = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileScreen({ profile, onSave }) {
  const [form,    setForm]    = useState({
    name:        profile.name        || '',
    location:    profile.location    || '',
    defaultRole: profile.defaultRole || '',
    avatar:      profile.avatar      || '',
  });
  const [saved,    setSaved]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const base64 = await resizeImage(file);
    set('avatar')(base64);
    setUploading(false);
    // Clear input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemovePhoto = () => set('avatar')('');

  const initial = form.name ? form.name.trim()[0].toUpperCase() : '?';

  return (
    <div className="profile-screen">

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar hero */}
      <div className="profile-hero">
        <div className="avatar-upload-wrap" onClick={handleAvatarClick}>
          {form.avatar ? (
            <img src={form.avatar} alt="Avatar" className="profile-avatar-photo" />
          ) : (
            <div className="profile-avatar-lg">
              {uploading ? '⏳' : initial}
            </div>
          )}
          <div className="avatar-upload-badge">
            {uploading ? '...' : '📷'}
          </div>
        </div>

        <div className="profile-name-display">{form.name || 'Your Name'}</div>

        {form.defaultRole && (
          <div className="profile-role-badge">
            {form.defaultRole === 'contractor' ? '📸 Contractor' : '🏢 Employer'}
          </div>
        )}

        {form.avatar && (
          <button className="avatar-remove-btn" onClick={handleRemovePhoto}>
            Remove photo
          </button>
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
