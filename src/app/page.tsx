export default function Home() {
  return (
    <div className="min-h-screen sky-wash">
      {/* Nav */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #116dff 0%, #36a6f9 100%)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5M6.5 4.5L3 8l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1a1d26' }}>
            WixHub Sync
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#features" className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium">How It Works</a>
          <a href="#tech" className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium">Tech</a>
          <a
            href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium px-4 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--sky-300)] hover:bg-[var(--sky-50)] transition-all"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          <div className="animate-in animate-in-d1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--sky-50)] border border-[var(--sky-200)] mb-7">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--sky-500)]" />
            <span className="text-[12px] font-medium text-[var(--sky-600)]">Wix Marketplace Integration</span>
          </div>

          <h1 className="animate-in animate-in-d2 text-[44px] md:text-[56px] leading-[1.08] font-extrabold tracking-[-0.03em] text-[var(--foreground)] mb-5" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Keep your Wix contacts<br />
            and HubSpot CRM<br />
            <span style={{ color: 'var(--sky-500)' }}>perfectly in sync.</span>
          </h1>

          <p className="animate-in animate-in-d3 text-[17px] leading-[1.65] text-[var(--muted)] max-w-xl mb-8">
            A native Wix app that syncs contacts both ways with HubSpot, captures form submissions with UTM tracking, and gives you a clean dashboard to map fields exactly how you want.
          </p>

          <div className="animate-in animate-in-d4 flex items-center gap-3">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-200/50"
              style={{ background: 'linear-gradient(135deg, #116dff 0%, #36a6f9 100%)' }}
            >
              Open Dashboard
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a
              href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold border border-[var(--border)] hover:border-[var(--sky-300)] hover:bg-[var(--sky-50)] transition-all text-[var(--foreground)]"
            >
              View Source Code
            </a>
          </div>
        </div>

        {/* Sync Diagram */}
        <div className="animate-in animate-in-d5 mt-16 rounded-xl border border-[var(--border)] bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-[6px] h-[6px] rounded-full bg-green-500" />
            <span className="text-[12px] font-medium text-green-600">Live connection</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
            {/* Wix */}
            <div className="rounded-xl bg-[var(--sky-50)] border border-[var(--sky-200)] p-5 text-center">
              <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #116dff, #3d8bfd)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 10l3.5-5L12 10l-3.5 5L5 10Z" fill="white" fillOpacity="0.9"/>
                  <path d="M12 10l3.5-5L19 10l-3.5 5L12 10Z" fill="white" fillOpacity="0.7"/>
                  <path d="M8.5 16l3.5-5 3.5 5-3.5 5-3.5-5Z" fill="white" fillOpacity="0.5"/>
                </svg>
              </div>
              <div className="text-[14px] font-semibold mb-0.5" style={{ fontFamily: 'Figtree, sans-serif' }}>Wix CRM</div>
              <div className="text-[12px] text-[var(--muted)]">Contacts & Forms</div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1.5 px-2">
              <div className="flex items-center gap-1">
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                  <path d="M4 8h40" stroke="var(--sky-300)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
                  <path d="M38 4l6 4-6 4" stroke="var(--sky-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-[var(--sky-500)] bg-[var(--sky-50)] px-2 py-0.5 rounded">SYNC</span>
              <div className="flex items-center gap-1">
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                  <path d="M44 16H4" stroke="var(--sky-300)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
                  <path d="M10 20l-6-4 6-4" stroke="var(--sky-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* HubSpot */}
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-5 text-center">
              <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff5c35, #ff7a59)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="2.5" fill="white" fillOpacity="0.9"/>
                  <circle cx="18" cy="14" r="2" fill="white" fillOpacity="0.7"/>
                  <circle cx="6" cy="15" r="1.5" fill="white" fillOpacity="0.6"/>
                  <path d="M12 10.5v2.5l4.5 2M12 13l-4.5 3" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="text-[14px] font-semibold mb-0.5" style={{ fontFamily: 'Figtree, sans-serif' }}>HubSpot CRM</div>
              <div className="text-[12px] text-[var(--muted)]">Contacts & Properties</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-5 border-t border-[var(--border-light)] grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '< 30s', label: 'Sync latency' },
              { value: '3-layer', label: 'Loop prevention' },
              { value: 'OAuth 2.0', label: 'Authentication' },
              { value: 'AES-256', label: 'Token encryption' },
            ].map((s) => (
              <div key={s.label} className="text-center py-2">
                <div className="text-[15px] font-bold text-[var(--foreground)]" style={{ fontFamily: 'Figtree, sans-serif' }}>{s.value}</div>
                <div className="text-[11px] text-[var(--muted-light)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold text-[var(--sky-500)] tracking-wide uppercase mb-2">What it does</p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.025em]" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Four features, one install.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Feature 1 */}
          <div className="card-lift rounded-xl border border-[var(--border)] bg-white p-7">
            <div className="w-10 h-10 rounded-lg bg-[var(--sky-50)] border border-[var(--sky-200)] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sky-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold mb-1.5" style={{ fontFamily: 'Figtree, sans-serif' }}>Bi-directional Contact Sync</h3>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">
              Create or update a contact on either side — it shows up on the other within seconds. The sync engine has three layers of loop prevention so nothing goes haywire.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Event dedup', 'Echo suppression', 'Change detection'].map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--sky-50)] text-[var(--sky-600)] font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card-lift rounded-xl border border-[var(--border)] bg-white p-7">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <path d="M7 8h4M7 12h10M7 16h6"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold mb-1.5" style={{ fontFamily: 'Figtree, sans-serif' }}>Form & Lead Capture</h3>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">
              When someone fills out a Wix form, their info lands in HubSpot automatically — with UTM source, medium, and campaign pulled from the page URL. You know exactly which ad brought them in.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['utm_source', 'utm_medium', 'utm_campaign', 'Auto-match fields'].map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card-lift rounded-xl border border-[var(--border)] bg-white p-7">
            <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4"/>
                <circle cx="15" cy="9" r="1" fill="#7c3aed"/>
                <circle cx="15" cy="15" r="1" fill="#7c3aed"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold mb-1.5" style={{ fontFamily: 'Figtree, sans-serif' }}>Field Mapping Dashboard</h3>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">
              A visual UI inside your Wix admin where you pick which Wix fields map to which HubSpot properties, choose the sync direction, and apply transforms like lowercase or date formatting.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Visual mapper', 'Direction control', 'Transforms'].map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Feature 4 */}
          <div className="card-lift rounded-xl border border-[var(--border)] bg-white p-7">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 className="text-[16px] font-bold mb-1.5" style={{ fontFamily: 'Figtree, sans-serif' }}>OAuth 2.0 Security</h3>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">
              Proper OAuth for both platforms — Wix Advanced OAuth with 5-min tokens, HubSpot Authorization Code flow with 30-min tokens. Everything encrypted at rest, webhooks signature-verified.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['AES-256-CBC', 'HMAC-SHA256', 'JWT verify', 'Auto-refresh'].map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold text-[var(--sky-500)] tracking-wide uppercase mb-2">Get started</p>
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.025em]" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Three steps to connected.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                title: 'Install on your Wix site',
                desc: 'Add the app from the Wix dashboard. The OAuth handshake happens behind the scenes — you just click install.',
                color: '#116dff',
                bg: 'var(--sky-50)',
                border: 'var(--sky-200)',
              },
              {
                num: '2',
                title: 'Connect your HubSpot account',
                desc: 'Hit "Connect HubSpot" in the dashboard panel. Authorize once, and the tokens are stored encrypted.',
                color: '#ff5c35',
                bg: '#fff7f5',
                border: '#ffd4c8',
              },
              {
                num: '3',
                title: 'Configure & go live',
                desc: 'Tweak the field mappings if you want, or just use the defaults. Contacts start syncing in real-time.',
                color: '#059669',
                bg: '#f0fdf4',
                border: '#bbf7d0',
              },
            ].map((step) => (
              <div key={step.num} className="card-lift rounded-xl bg-white border border-[var(--border)] p-7 relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold mb-5"
                  style={{ background: step.color, fontFamily: 'Figtree, sans-serif' }}
                >
                  {step.num}
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>{step.title}</h3>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sync Engine */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold text-[var(--sky-500)] tracking-wide uppercase mb-2">Reliability</p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.025em]" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Three layers, zero loops.
          </h2>
          <p className="text-[15px] text-[var(--muted)] mt-3 max-w-lg mx-auto">
            The hardest part of bi-directional sync is preventing infinite loops. Here&apos;s how we handle it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              layer: 'Layer 1',
              title: 'Event Dedup',
              desc: 'Every webhook event ID gets stored in a TTL collection. If we\'ve processed it before, we drop it immediately.',
              num: '01',
            },
            {
              layer: 'Layer 2',
              title: 'Echo Suppression',
              desc: 'If we pushed data to HubSpot 3 seconds ago and now get a webhook back from HubSpot, that\'s an echo. We skip it.',
              num: '02',
            },
            {
              layer: 'Layer 3',
              title: 'Data Comparison',
              desc: 'Before writing to the target, we compare the incoming values with what\'s already there. Identical? No write needed.',
              num: '03',
            },
          ].map((item) => (
            <div key={item.num} className="rounded-xl border border-[var(--border)] bg-white p-7">
              <div className="text-[11px] font-bold text-[var(--sky-500)] tracking-wide uppercase mb-3">{item.layer}</div>
              <h3 className="text-[16px] font-bold mb-2" style={{ fontFamily: 'Figtree, sans-serif' }}>{item.title}</h3>
              <p className="text-[14px] text-[var(--muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Default Mappings */}
      <section className="py-20" style={{ background: 'var(--surface-alt)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold text-[var(--sky-500)] tracking-wide uppercase mb-2">Out of the box</p>
            <h2 className="text-[28px] md:text-[32px] font-extrabold tracking-[-0.025em]" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Default field mappings
            </h2>
            <p className="text-[14px] text-[var(--muted)] mt-2">These are created automatically when you install. You can change them anytime in the dashboard.</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-[1fr_40px_1fr] items-center px-5 py-2.5 bg-[var(--surface-alt)] border-b border-[var(--border)]">
              <span className="text-[11px] font-semibold text-[var(--sky-600)] uppercase tracking-wider">Wix Field</span>
              <span className="text-center text-[11px] text-[var(--muted-light)]">↔</span>
              <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider text-right">HubSpot</span>
            </div>
            {[
              ['info.name.first', 'firstname'],
              ['info.name.last', 'lastname'],
              ['primaryInfo.email', 'email'],
              ['primaryInfo.phone', 'phone'],
              ['info.company', 'company'],
              ['info.jobTitle', 'jobtitle'],
            ].map(([wix, hs], i) => (
              <div key={wix} className={`grid grid-cols-[1fr_40px_1fr] items-center px-5 py-3 ${i < 5 ? 'border-b border-[var(--border-light)]' : ''} hover:bg-[var(--sky-50)]/30 transition-colors`}>
                <span className="text-[13px] font-mono text-[var(--foreground)]">{wix}</span>
                <div className="flex justify-center">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M1 5h14M11 1.5L15 5l-4 3.5M5 1.5L1 5l4 3.5" stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[13px] font-mono text-[var(--foreground)] text-right">{hs}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold text-[var(--sky-500)] tracking-wide uppercase mb-2">Under the hood</p>
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-[-0.025em]" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Built on solid foundations.
          </h2>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Framework', value: 'Next.js 16', sub: 'App Router, TypeScript' },
              { label: 'Database', value: 'MongoDB Atlas', sub: '5 collections, TTL indexes' },
              { label: 'Hosting', value: 'Vercel', sub: 'Serverless, edge network' },
              { label: 'Tests', value: '80 unit tests', sub: 'Vitest + Testing Library' },
            ].map((item, i) => (
              <div key={item.label} className={`p-5 ${i < 3 ? 'border-r border-[var(--border-light)]' : ''} border-b border-[var(--border-light)]`}>
                <div className="text-[10px] font-semibold text-[var(--muted-light)] uppercase tracking-wider mb-1.5">{item.label}</div>
                <div className="text-[14px] font-bold" style={{ fontFamily: 'Figtree, sans-serif' }}>{item.value}</div>
                <div className="text-[12px] text-[var(--muted)]">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Wix SDK', value: 'REST API v4', sub: 'Contacts, Forms' },
              { label: 'HubSpot SDK', value: '@hubspot/api-client', sub: 'v13+ strict enums' },
              { label: 'Encryption', value: 'AES-256-CBC', sub: 'Tokens at rest' },
              { label: 'Webhooks', value: 'Real-time', sub: 'JWT + HMAC verify' },
            ].map((item, i) => (
              <div key={item.label} className={`p-5 ${i < 3 ? 'border-r border-[var(--border-light)]' : ''}`}>
                <div className="text-[10px] font-semibold text-[var(--muted-light)] uppercase tracking-wider mb-1.5">{item.label}</div>
                <div className="text-[14px] font-bold" style={{ fontFamily: 'Figtree, sans-serif' }}>{item.value}</div>
                <div className="text-[12px] text-[var(--muted)]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* API Routes */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { group: 'Auth', color: '#116dff', bg: 'var(--sky-50)', routes: ['/api/auth/wix/install', '/api/auth/wix/callback', '/api/auth/hubspot/connect', '/api/auth/hubspot/callback'] },
            { group: 'Webhooks', color: '#ff5c35', bg: '#fff7f5', routes: ['/api/webhooks/wix/contact', '/api/webhooks/wix/form', '/api/webhooks/hubspot'] },
            { group: 'Dashboard', color: '#7c3aed', bg: '#faf5ff', routes: ['/api/mappings', '/api/fields/wix', '/api/fields/hubspot', '/api/sync/trigger', '/api/sync/status', '/api/installation/status'] },
          ].map((g) => (
            <div key={g.group} className="rounded-xl border border-[var(--border)] bg-white p-5">
              <div className="text-[12px] font-bold mb-3" style={{ color: g.color, fontFamily: 'Figtree, sans-serif' }}>
                {g.group} — {g.routes.length} routes
              </div>
              <div className="space-y-1">
                {g.routes.map((r) => (
                  <div key={r} className="text-[12px] font-mono text-[var(--muted)] py-0.5">{r}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #116dff 0%, #36a6f9 100%)' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5M6.5 4.5L3 8l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[13px] text-[var(--muted)]">
              Built by <span className="text-[var(--foreground)] font-medium">Daniel Moenga</span> · Vame Ltd Assignment
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">GitHub</a>
            <a href="/dashboard" className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
