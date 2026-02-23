export default function Home() {
  return (
    <div className="noise-overlay gradient-mesh min-h-screen relative">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0c6efc] to-[#ff5c35] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">WixHub Sync</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs text-[var(--muted)] hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-xs text-[var(--muted)] hover:text-white transition-colors">How it Works</a>
          <a href="#architecture" className="text-xs text-[var(--muted)] hover:text-white transition-colors">Architecture</a>
          <a
            href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 rounded-full border border-[var(--border)] hover:border-[var(--muted)] transition-all hover:bg-white/[0.03]"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="fade-up delay-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-[var(--muted)] font-medium tracking-wide uppercase">Vame Ltd — Full Stack Integration</span>
          </div>

          {/* Heading */}
          <h1 className="fade-up delay-2 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6">
            <span className="text-white">Wix</span>
            <span className="mx-3 md:mx-4 inline-block">
              <svg className="w-8 h-8 md:w-12 md:h-12 inline-block align-middle" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="url(#sync-grad)" strokeWidth="2" strokeDasharray="4 3" className="dash-animated" />
                <path d="M14 24h20M28 18l6 6-6 6M20 18l-6 6 6 6" stroke="url(#sync-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="sync-grad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#0c6efc" />
                    <stop offset="1" stopColor="#ff5c35" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="text-white">HubSpot</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0c6efc] via-[#8b5cf6] to-[#ff5c35]">
              in perfect sync.
            </span>
          </h1>

          <p className="fade-up delay-3 text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Real-time bi-directional contact sync with loop prevention, form capture with UTM attribution, and a drag-and-drop field mapping dashboard. No Zapier. No middleware. Just a direct, secure connection.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up delay-4 flex flex-wrap gap-4 mb-16">
            <a
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0c6efc] to-[#3d8bfd] text-white text-sm font-medium transition-all hover:shadow-[0_0_32px_rgba(12,110,252,0.3)] hover:scale-[1.02]"
            >
              Open Dashboard
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a
              href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-sm font-medium transition-all hover:bg-white/[0.04] hover:border-[var(--muted)]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View Source
            </a>
          </div>

          {/* Live Sync Visualization */}
          <div className="fade-up delay-5 relative">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs text-[var(--muted)] font-mono">LIVE SYNC VISUALIZATION</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-mono">CONNECTED</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
                {/* Wix Side */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#0c6efc]/20 to-[#0c6efc]/5 border border-[#0c6efc]/20 icon-glow-blue mb-4 float-animation">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M7 12l4-6 4 6-4 6-4-6zm10 0l4-6 4 6-4 6-4-6zm-5 8l4-6 4 6-4 6-4-6z" fill="#0c6efc" opacity="0.9"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold mb-1">Wix CRM</div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">Contacts & Forms</div>
                </div>

                {/* Sync Arrows */}
                <div className="relative flex flex-col items-center justify-center gap-3">
                  <div className="w-full h-[2px] bg-gradient-to-r from-[#0c6efc] to-[#ff5c35] sync-line rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center z-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#arrow-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      <defs>
                        <linearGradient id="arrow-grad" x1="4" y1="12" x2="20" y2="12">
                          <stop stopColor="#0c6efc" />
                          <stop offset="1" stopColor="#ff5c35" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="w-full h-[2px] bg-gradient-to-l from-[#0c6efc] to-[#ff5c35] sync-line-reverse rounded-full" />
                </div>

                {/* HubSpot Side */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/5 border border-[#ff5c35]/20 icon-glow-orange mb-4 float-animation" style={{ animationDelay: '1s' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="12" r="3" fill="#ff5c35" opacity="0.9"/>
                      <circle cx="24" cy="18" r="2.5" fill="#ff5c35" opacity="0.7"/>
                      <circle cx="8" cy="20" r="2" fill="#ff5c35" opacity="0.6"/>
                      <path d="M16 15v3m0 0l6 1.5M16 18l-6 3" stroke="#ff5c35" strokeWidth="1" opacity="0.5"/>
                    </svg>
                  </div>
                  <div className="text-sm font-semibold mb-1">HubSpot CRM</div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">Contacts & Properties</div>
                </div>
              </div>

              {/* Sync Stats Bar */}
              <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-4 gap-4">
                {[
                  { label: 'Sync Latency', value: '< 30s', color: 'text-emerald-400' },
                  { label: 'Loop Prevention', value: '3 Layers', color: 'text-[#0c6efc]' },
                  { label: 'Auth Protocol', value: 'OAuth 2.0', color: 'text-purple-400' },
                  { label: 'Encryption', value: 'AES-256', color: 'text-[#ff5c35]' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-base md:text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-[var(--muted)] mt-0.5 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] text-[var(--accent-wix)] font-mono tracking-widest uppercase mb-3 block">Core Features</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything Klaviyo does.<br />
              <span className="text-[var(--muted)]">Built natively for Wix.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Feature 1: Bi-directional Sync */}
            <div className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c6efc]/20 to-[#0c6efc]/5 border border-[#0c6efc]/15 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c6efc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bi-directional Contact Sync</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                Create or update a contact on either platform and it appears on the other within seconds. Three-layer loop prevention ensures no infinite sync cycles.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Event Dedup', 'Echo Suppression', 'Data Change Detection'].map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#0c6efc]/10 text-[#0c6efc] border border-[#0c6efc]/15 font-mono">{tag}</span>
                ))}
              </div>
            </div>

            {/* Feature 2: Form Capture */}
            <div className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/5 border border-[#ff5c35]/15 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Form & Lead Capture</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                Wix form submissions automatically create HubSpot contacts with full UTM attribution tracking. Know exactly which campaign drove each lead.
              </p>
              <div className="flex flex-wrap gap-2">
                {['UTM Source', 'UTM Medium', 'UTM Campaign', 'Heuristic Matching'].map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#ff5c35]/10 text-[#ff5c35] border border-[#ff5c35]/15 font-mono">{tag}</span>
                ))}
              </div>
            </div>

            {/* Feature 3: Field Mapping */}
            <div className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/15 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Configurable Field Mapping</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                Visual dashboard to map Wix contact fields to HubSpot properties. Choose sync direction per field, apply transforms, and toggle mappings on or off.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Drag & Map', 'Transform Pipes', 'Bi-directional'].map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/15 font-mono">{tag}</span>
                ))}
              </div>
            </div>

            {/* Feature 4: Security */}
            <div className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/15 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">OAuth 2.0 Security</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                Dual OAuth flows for both Wix and HubSpot. Tokens encrypted at rest with AES-256-CBC. Webhook signatures verified via HMAC-SHA256 and JWT.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AES-256-CBC', 'HMAC-SHA256', 'JWT Verify', 'Auto-Refresh'].map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-mono">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] text-[var(--accent)] font-mono tracking-widest uppercase mb-3 block">Setup Flow</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Connected in<br />
              <span className="text-[var(--muted)]">three steps.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Install on Wix',
                description: 'Add the app to your Wix site from the dashboard. OAuth handles all authentication automatically.',
                gradient: 'from-[#0c6efc]',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0c6efc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Connect HubSpot',
                description: 'Click "Connect HubSpot" in the dashboard. Authorize with one click and you\'re linked.',
                gradient: 'from-[#ff5c35]',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5c35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Sync & Map Fields',
                description: 'Configure which fields sync and in which direction. Hit "Sync Now" or let webhooks handle it in real-time.',
                gradient: 'from-emerald-400',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="card-hover relative rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
                <span className={`text-6xl font-black tracking-tighter bg-gradient-to-b ${item.gradient} to-transparent bg-clip-text text-transparent opacity-30 absolute top-4 right-6`}>
                  {item.step}
                </span>
                <div className="mb-5">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture / Tech Stack */}
      <section id="architecture" className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] text-purple-400 font-mono tracking-widest uppercase mb-3 block">Under the Hood</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Built for<br />
              <span className="text-[var(--muted)]">production reliability.</span>
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden">
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-[var(--border)]">
              {[
                { label: 'Framework', value: 'Next.js 16', sub: 'App Router + TypeScript' },
                { label: 'Database', value: 'MongoDB Atlas', sub: 'Free Tier, 5 Collections' },
                { label: 'Hosting', value: 'Vercel', sub: 'Edge Network + Serverless' },
                { label: 'Testing', value: '80 Tests', sub: 'Vitest + Testing Library' },
                { label: 'Wix SDK', value: 'REST APIs', sub: 'Contacts v4 + Forms' },
                { label: 'HubSpot SDK', value: '@hubspot/api-client', sub: 'v13+ with Strict Enums' },
                { label: 'Encryption', value: 'AES-256-CBC', sub: 'Tokens Encrypted at Rest' },
                { label: 'Webhooks', value: 'Real-time', sub: 'JWT + HMAC Verification' },
              ].map((item) => (
                <div key={item.label} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="text-[10px] text-[var(--muted)] font-mono uppercase tracking-wider mb-2">{item.label}</div>
                  <div className="text-sm font-semibold mb-0.5">{item.value}</div>
                  <div className="text-[11px] text-[var(--muted)]">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* API Routes Overview */}
            <div className="border-t border-[var(--border)] p-8">
              <div className="text-[10px] text-[var(--muted)] font-mono uppercase tracking-wider mb-4">15 API Routes</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { group: 'Auth', routes: ['wix/install', 'wix/callback', 'hubspot/connect', 'hubspot/callback'], color: '#0c6efc' },
                  { group: 'Webhooks', routes: ['wix/contact', 'wix/form', 'hubspot'], color: '#ff5c35' },
                  { group: 'Dashboard', routes: ['mappings', 'fields/wix', 'fields/hubspot', 'sync/trigger', 'sync/status', 'installation/status'], color: '#a855f7' },
                ].map((group) => (
                  <div key={group.group} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4">
                    <div className="text-xs font-semibold mb-3" style={{ color: group.color }}>{group.group}</div>
                    <div className="space-y-1.5">
                      {group.routes.map((route) => (
                        <div key={route} className="text-[11px] font-mono text-[var(--muted)] flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: group.color, opacity: 0.5 }} />
                          /api/{group.group.toLowerCase()}/{route}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sync Engine Deep Dive */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] text-emerald-400 font-mono tracking-widest uppercase mb-3 block">Loop Prevention</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Three layers.<br />
              <span className="text-[var(--muted)]">Zero infinite loops.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                layer: 'Layer 1',
                title: 'Event Deduplication',
                description: 'Each webhook event ID is stored in a TTL collection. If we\'ve seen it before, we skip it immediately.',
                color: '#0c6efc',
                icon: '🔵',
              },
              {
                layer: 'Layer 2',
                title: 'Echo Suppression',
                description: 'If we synced a contact to platform B less than 5 seconds ago, we suppress the echo webhook from B.',
                color: '#ff5c35',
                icon: '🟠',
              },
              {
                layer: 'Layer 3',
                title: 'Data Change Detection',
                description: 'Compare the incoming field values against what\'s already in the target. If they\'re identical, don\'t sync.',
                color: '#10b981',
                icon: '🟢',
              },
            ].map((layer) => (
              <div key={layer.layer} className="card-hover rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm p-8">
                <div className="text-[10px] font-mono tracking-widest uppercase mb-4" style={{ color: layer.color }}>{layer.layer}</div>
                <h3 className="text-lg font-semibold mb-3">{layer.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Default Field Mappings */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[var(--muted)] font-mono tracking-widest uppercase mb-3 block">Out of the Box</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Default Field Mappings
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 border-b border-[var(--border)] bg-white/[0.02]">
              <span className="text-[10px] font-mono text-[#0c6efc] uppercase tracking-wider">Wix Field</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">↔</span>
              <span className="text-[10px] font-mono text-[#ff5c35] uppercase tracking-wider text-right">HubSpot Property</span>
            </div>
            {[
              ['info.name.first', 'firstname'],
              ['info.name.last', 'lastname'],
              ['primaryInfo.email', 'email'],
              ['primaryInfo.phone', 'phone'],
              ['info.company', 'company'],
              ['info.jobTitle', 'jobtitle'],
            ].map(([wix, hs], i) => (
              <div key={wix} className={`grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 ${i < 5 ? 'border-b border-[var(--border)]' : ''} hover:bg-white/[0.02] transition-colors`}>
                <span className="text-sm font-mono text-[var(--foreground)]">{wix}</span>
                <svg width="20" height="12" viewBox="0 0 20 12" className="mx-4 opacity-30">
                  <path d="M0 6h20M14 1l5 5-5 5M6 1L1 6l5 5" stroke="url(#map-grad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="map-grad" x1="0" y1="6" x2="20" y2="6">
                      <stop stopColor="#0c6efc" />
                      <stop offset="1" stopColor="#ff5c35" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-mono text-[var(--foreground)] text-right">{hs}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 lg:px-20 py-12 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0c6efc] to-[#ff5c35] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-xs text-[var(--muted)]">
              Wix ↔ HubSpot Sync &middot; Built by <span className="text-[var(--foreground)]">Daniel Moenga</span> &middot; Vame Ltd Assignment
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Daniel-Moenga/wix-hubspot-sync-vame" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--muted)] hover:text-white transition-colors">GitHub</a>
            <a href="/dashboard" className="text-xs text-[var(--muted)] hover:text-white transition-colors">Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
