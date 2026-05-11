import Link from 'next/link';

export const metadata = {
  title: 'The Agent — Rate Intelligence for Photo & Video Creatives',
  description: 'Real market rates, negotiation scripts, and budget guidance for photographers, videographers, and the brands that hire them.',
};

export default function LandingPage() {
  return (
    <div className="landing">

      {/* ── Nav ────────────────────────────────────────── */}
      <nav className="lnav">
        <div className="lnav-inner">
          <div className="lnav-logo">the <span>agent</span></div>
          <Link href="/app" className="lnav-cta">Try it Free →</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="lhero">
        <div className="lhero-inner">
          <div className="lhero-text">
            <div className="l-eyebrow">Rate Intelligence for Photo & Video Professionals</div>
            <h1 className="lhero-h1">Know Your<br />Worth.</h1>
            <p className="lhero-sub">
              Real market rates, negotiation scripts, and budget guidance
              for photographers, videographers, and the brands that hire them.
            </p>
            <div className="lhero-actions">
              <Link href="/app" className="l-btn-primary">Get My Rate →</Link>
            </div>
            <p className="lhero-footnote">Free to try · No account needed</p>
          </div>

          {/* App mockup */}
          <div className="lhero-mockup-wrap">
            <div className="lhero-mockup">
              <div className="mockup-topbar">
                <div className="mockup-dots">
                  <span /><span /><span />
                </div>
                <span className="mockup-app-title">the <b>agent</b></span>
                <div className="mockup-avatar" />
              </div>
              <div className="mockup-rate-hero">
                <div className="mockup-rate-label">Recommended Rate</div>
                <div className="mockup-rate-val">$2,400</div>
                <div className="mockup-rate-range">Range: $1,600 – $3,200</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-section-label">Rate Breakdown</div>
                <div className="mockup-bar-row">
                  <span className="mbr-lbl">Floor</span>
                  <div className="mbr-track"><div className="mbr-fill" style={{ width: '44%', background: '#94A3B8' }} /></div>
                  <span className="mbr-amt">$1,600</span>
                </div>
                <div className="mockup-bar-row">
                  <span className="mbr-lbl">Target</span>
                  <div className="mbr-track"><div className="mbr-fill" style={{ width: '72%', background: '#2563EB' }} /></div>
                  <span className="mbr-amt">$2,400</span>
                </div>
                <div className="mockup-bar-row">
                  <span className="mbr-lbl">Ceiling</span>
                  <div className="mbr-track"><div className="mbr-fill" style={{ width: '100%', background: '#1E40AF' }} /></div>
                  <span className="mbr-amt">$3,200</span>
                </div>
                <div className="mockup-factors">
                  <div className="mockup-factor">
                    <span className="mf-icon">🏢</span>
                    <span className="mf-text">Large brand client</span>
                    <span className="mf-badge up">+$</span>
                  </div>
                  <div className="mockup-factor">
                    <span className="mf-icon">🎬</span>
                    <span className="mf-text">Video editing included</span>
                    <span className="mf-badge up">+$</span>
                  </div>
                  <div className="mockup-factor">
                    <span className="mf-icon">📄</span>
                    <span className="mf-text">2-year usage rights</span>
                    <span className="mf-badge up">+$</span>
                  </div>
                </div>
                <div className="mockup-script-card">
                  <div className="mockup-script-title">💬 If they say it's too high...</div>
                  <div className="mockup-script-text">"I totally understand budget constraints. This rate reflects the usage rights and post-production..."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────── */}
      <section className="lstats">
        <div className="lstats-inner">
          <div className="lstat">
            <div className="lstat-num">~2 min</div>
            <div className="lstat-label">To your rate</div>
          </div>
          <div className="lstat-div" />
          <div className="lstat">
            <div className="lstat-num">instant</div>
            <div className="lstat-label">Rate calculation</div>
          </div>
          <div className="lstat-div" />
          <div className="lstat">
            <div className="lstat-num">$0</div>
            <div className="lstat-label">Free to try</div>
          </div>
          <div className="lstat-div" />
          <div className="lstat">
            <div className="lstat-num">2</div>
            <div className="lstat-label">Roles: shoot or hire</div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────── */}
      <section className="lroles">
        <div className="lsection-inner">
          <div className="l-eyebrow center">Built for both sides of the deal</div>
          <h2 className="lh2 center">Are you the shooter<br />or the buyer?</h2>
          <div className="lroles-grid">

            <div className="lrole-card lrole-blue">
              <div className="lrole-icon">📸</div>
              <div className="lrole-title">Photographers &<br />Videographers</div>
              <ul className="lrole-list">
                <li>Know your market rate before the client calls</li>
                <li>Get word-for-word scripts when they push back</li>
                <li>Understand what drives your rate up or down</li>
                <li>Never leave money on the table again</li>
              </ul>
              <Link href="/app" className="l-btn-role l-btn-blue">Get My Rate →</Link>
            </div>

            <div className="lrole-card lrole-purple">
              <div className="lrole-icon">🏢</div>
              <div className="lrole-title">Brands &<br />Agencies</div>
              <ul className="lrole-list">
                <li>Know the fair market rate before you reach out</li>
                <li>Make offers that serious talent actually accept</li>
                <li>Get budget-saving tips without losing quality</li>
                <li>Stop lowballing and losing great creatives</li>
              </ul>
              <Link href="/app" className="l-btn-role l-btn-purple">Get My Budget →</Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="lfeatures">
        <div className="lsection-inner">
          <div className="l-eyebrow center">What you get</div>
          <h2 className="lh2 center">Everything you need to<br />price your work right</h2>
          <div className="lfeatures-grid">
            <div className="lfeat">
              <div className="lfeat-icon">💰</div>
              <div className="lfeat-title">Market-accurate rates</div>
              <p className="lfeat-desc">Floor, ceiling, and recommended rate tailored to your media type, deliverables, client, usage rights, and location.</p>
            </div>
            <div className="lfeat">
              <div className="lfeat-icon">💬</div>
              <div className="lfeat-title">Negotiation scripts</div>
              <p className="lfeat-desc">Word-for-word language to use when a client pushes back — confident, professional, written for your exact situation.</p>
            </div>
            <div className="lfeat">
              <div className="lfeat-icon">📊</div>
              <div className="lfeat-title">Rate breakdown</div>
              <p className="lfeat-desc">See exactly what's driving your number — usage rights, turnaround, client type, equipment — so you can defend every dollar.</p>
            </div>
            <div className="lfeat">
              <div className="lfeat-icon">📋</div>
              <div className="lfeat-title">Proposal builder</div>
              <p className="lfeat-desc">Turn your rate into a polished proposal with deliverables, terms, and an approve button — ready to send in seconds.</p>
            </div>
            <div className="lfeat">
              <div className="lfeat-icon">📱</div>
              <div className="lfeat-title">Works anywhere</div>
              <p className="lfeat-desc">Mobile-first app you can add to your home screen. Pull up your rate on set, in a coffee shop, or right before a call.</p>
            </div>
            <div className="lfeat">
              <div className="lfeat-icon">🗂️</div>
              <div className="lfeat-title">Rate history</div>
              <p className="lfeat-desc">Every calculation is saved locally. Look back at past projects, track your rates over time, and spot patterns in your pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section className="lhow">
        <div className="lsection-inner">
          <div className="l-eyebrow center">Simple by design</div>
          <h2 className="lh2 center">Your rate in under 2 minutes</h2>
          <div className="lhow-steps">
            <div className="lhow-step">
              <div className="lstep-num">1</div>
              <div className="lstep-title">Pick your role</div>
              <p className="lstep-desc">Contractor (photographer or videographer) or employer (brand or agency)</p>
            </div>
            <div className="lhow-arrow">→</div>
            <div className="lhow-step">
              <div className="lstep-num">2</div>
              <div className="lstep-title">Describe the project</div>
              <p className="lstep-desc">Media type, deliverables, usage rights, timeline, and client type — takes about 90 seconds</p>
            </div>
            <div className="lhow-arrow">→</div>
            <div className="lhow-step">
              <div className="lstep-num">3</div>
              <div className="lstep-title">Get your number</div>
              <p className="lstep-desc">The Agent analyzes the market and returns a rate range, breakdown, and negotiation script instantly</p>
            </div>
          </div>
          <div className="lhow-cta">
            <Link href="/app" className="l-btn-primary">Try it now — it's free →</Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="lfinal">
        <div className="lsection-inner center">
          <h2 className="lh2 lh2-white">Ready to know your worth?</h2>
          <p className="lfinal-sub">Join photographers, videographers, and brands using The Agent to negotiate smarter.</p>
          <Link href="/app" className="l-btn-primary l-btn-lg">Get Started Free →</Link>
          <p className="lfinal-note">No account needed · Works on mobile & desktop</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="lfooter">
        <div className="lfooter-inner">
          <div className="lnav-logo">the <span>agent</span></div>
          <p className="lfooter-sub">Rate intelligence for photo & video creatives.</p>
          <p className="lfooter-copy">© 2025 The Agent</p>
        </div>
      </footer>

    </div>
  );
}
