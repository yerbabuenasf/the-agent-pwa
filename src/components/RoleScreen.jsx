'use client';

export default function RoleScreen({ role, onSelect, onContinue }) {
  return (
    <div className="role-screen">
      <div className="role-desktop-wrap">

        {/* Left col on desktop — hero text */}
        <div className="role-hero-col">
          <div className="role-header-eyebrow">Photo & Video Rate Negotiator</div>
          <h1 className="role-header-title">Know Your<br />Worth.</h1>
          <p className="role-header-sub">
            Real market rates, negotiation scripts, and budget guidance — for photo & video professionals.
          </p>
          <div className="role-hero-badges">
            <span className="role-badge">📷 Photographers</span>
            <span className="role-badge">🎬 Videographers</span>
            <span className="role-badge">🏢 Brands & Agencies</span>
          </div>
          <p className="role-footer">Free to try &nbsp;·&nbsp; No account needed</p>
        </div>

        {/* Right col on desktop — role picker */}
        <div className="role-cards-col">
          <p className="role-prompt">I am a —</p>

          <div className="role-cards-v2">
            <button
              className={`role-card-v2 ${role === 'contractor' ? 'active-blue' : ''}`}
              onClick={() => onSelect('contractor')}
            >
              <div className="rcv2-top">
                <div className="rcv2-icon">📸</div>
                {role === 'contractor' && <div className="rcv2-check blue-check">✓</div>}
              </div>
              <div className="rcv2-label">Contractor</div>
              <div className="rcv2-desc">Photographer or videographer — find out what to charge and how to negotiate.</div>
            </button>

            <button
              className={`role-card-v2 ${role === 'employer' ? 'active-purple' : ''}`}
              onClick={() => onSelect('employer')}
            >
              <div className="rcv2-top">
                <div className="rcv2-icon">🏢</div>
                {role === 'employer' && <div className="rcv2-check purple-check">✓</div>}
              </div>
              <div className="rcv2-label">Employer</div>
              <div className="rcv2-desc">Brand or agency — get a fair market budget and an offer that lands.</div>
            </button>
          </div>

          <button
            className={`role-cta ${!role ? 'role-cta-disabled' : role === 'employer' ? 'role-cta-purple' : 'role-cta-blue'}`}
            onClick={onContinue}
            disabled={!role}
          >
            {!role
              ? 'Select a role to continue'
              : `Get My ${role === 'contractor' ? 'Rate' : 'Budget'} →`}
          </button>

          {/* Mobile-only footer — desktop shows it in the hero column */}
          <p className="role-footer role-footer-mobile">Free to try &nbsp;·&nbsp; No account needed</p>
        </div>

      </div>
    </div>
  );
}
