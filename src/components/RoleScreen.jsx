'use client';

export default function RoleScreen({ role, onSelect, onContinue }) {
  return (
    <>
      <div className="hero role-hero">
        <div className="hero-badge">Welcome</div>
        <h1>Who are you negotiating for?</h1>
        <p>
          The Agent works for both sides of the deal — freelancers who want
          fair rates, and employers who want to budget right.
        </p>
      </div>

      <div className="form-body" style={{ padding: '24px 20px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', textAlign: 'center', marginBottom: 16 }}>
          I am a...
        </p>

        <div className="role-cards">
          <div
            className={`role-card ${role === 'contractor' ? 'sel-contractor' : ''}`}
            onClick={() => onSelect('contractor')}
          >
            <div className="role-icon blue">📸</div>
            <div className="role-text">
              <h3>Contractor</h3>
              <p>Photographer or videographer — I want to know what to charge and how to negotiate confidently.</p>
            </div>
            <div className={`role-check ${role === 'contractor' ? 'blue' : ''}`}>
              {role === 'contractor' && '✓'}
            </div>
          </div>

          <div
            className={`role-card ${role === 'employer' ? 'sel-employer' : ''}`}
            onClick={() => onSelect('employer')}
          >
            <div className="role-icon purple">🏢</div>
            <div className="role-text">
              <h3>Employer / Client</h3>
              <p>Brand, agency, or business — I want to know what's fair to offer a creative professional.</p>
            </div>
            <div className={`role-check ${role === 'employer' ? 'purple' : ''}`}>
              {role === 'employer' && '✓'}
            </div>
          </div>
        </div>

        <button
          className={`btn ${role === 'employer' ? 'purple' : 'blue'}`}
          onClick={onContinue}
          disabled={!role}
        >
          Continue as {role === 'employer' ? 'Employer' : role === 'contractor' ? 'Contractor' : '...'} →
        </button>
      </div>
    </>
  );
}
