export default function Home() {
  const WIX_INSTALL_URL =
    "https://www.wix.com/installer/install?appId=6ebb052f-b4f3-468e-b7e4-c143d267f589&redirectUrl=https://wix-hubspot-integration-vame.vercel.app/api/auth/wix/callback";
  const GITHUB_URL =
    "https://github.com/Daniel-Moenga/wix-hubspot-sync-vame";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ── */}
      <nav className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="5" fill="#116dff" />
            <path
              d="M6 10h8m-3.5-3.5L14 10l-3.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "Figtree, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "#1a1d26",
            }}
          >
            WixHub Sync
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#features"
            className="hidden md:block text-[13px] text-[#6e7787] hover:text-[#1a1d26] transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#get-started"
            className="hidden md:block text-[13px] text-[#6e7787] hover:text-[#1a1d26] transition-colors font-medium"
          >
            Get Started
          </a>
          <a
            href="#tech"
            className="hidden md:block text-[13px] text-[#6e7787] hover:text-[#1a1d26] transition-colors font-medium"
          >
            Tech
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-[#dfe3ea] hover:border-[#b8c0cc] hover:bg-[#f7f8fa] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-2xl">
          <div className="animate-in animate-in-d1 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e4e9f1] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-medium text-[#6e7787]">
              Wix Marketplace App
            </span>
          </div>

          <h1
            className="animate-in animate-in-d2 text-[40px] md:text-[50px] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#1a1d26] mb-5"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Keep{" "}
            <span style={{ color: "#116dff" }}>Wix</span> and{" "}
            <span style={{ color: "#ff5c35" }}>HubSpot</span>
            <br />
            contacts in sync.
          </h1>

          <p className="animate-in animate-in-d3 text-[16px] leading-[1.7] text-[#6e7787] max-w-lg mb-8">
            Bi-directional contact sync with loop prevention, form capture with
            UTM tracking, and a field mapping dashboard you can customize. Built
            as a native Wix app. No Zapier required.
          </p>

          <div className="animate-in animate-in-d4 flex flex-wrap items-center gap-3">
            <a
              href={WIX_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#116dff] text-white text-[14px] font-semibold hover:bg-[#0d5fd6] transition-colors"
            >
              Install on Wix
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-semibold border border-[#dfe3ea] hover:border-[#b8c0cc] hover:bg-[#f7f8fa] transition-all text-[#1a1d26]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View Source
            </a>
          </div>
        </div>

        {/* Sync Diagram */}
        <div className="animate-in animate-in-d5 mt-14 rounded-xl border border-[#e4e9f1] bg-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-medium text-emerald-600">
              Live sync active
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 items-center">
            {/* Wix */}
            <div className="rounded-lg border border-[#e4e9f1] p-5 text-center">
              <div
                className="text-[22px] font-extrabold mb-1"
                style={{ fontFamily: "Figtree, sans-serif", color: "#116dff" }}
              >
                Wix
              </div>
              <div className="text-[12px] text-[#9aa3b2]">
                CRM Contacts &amp; Forms
              </div>
            </div>

            {/* Arrows */}
            <div className="flex flex-col items-center gap-1.5 px-1">
              <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
                <path
                  d="M4 6h36"
                  stroke="#c8d2e0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />
                <path
                  d="M34 2l6 4-6 4"
                  stroke="#9aa3b2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[10px] font-bold text-[#9aa3b2] tracking-wider">
                SYNC
              </span>
              <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
                <path
                  d="M40 14H4"
                  stroke="#c8d2e0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />
                <path
                  d="M10 18l-6-4 6-4"
                  stroke="#9aa3b2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* HubSpot */}
            <div className="rounded-lg border border-[#e4e9f1] p-5 text-center">
              <div
                className="text-[22px] font-extrabold mb-1"
                style={{ fontFamily: "Figtree, sans-serif", color: "#ff5c35" }}
              >
                HubSpot
              </div>
              <div className="text-[12px] text-[#9aa3b2]">
                CRM Contacts &amp; Properties
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#edf1f7] grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "< 30s", label: "Sync latency" },
              { value: "3-layer", label: "Loop prevention" },
              { value: "OAuth 2.0", label: "Auth for both" },
              { value: "AES-256", label: "Encrypted tokens" },
            ].map((s) => (
              <div key={s.label} className="text-center py-1.5">
                <div
                  className="text-[14px] font-bold text-[#1a1d26]"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-[11px] text-[#9aa3b2] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold text-[#6e7787] tracking-wide uppercase mb-2">
            What it does
          </p>
          <h2
            className="text-[30px] md:text-[38px] font-extrabold tracking-[-0.025em]"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Four features, one install.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Bi-directional Sync */}
          <div className="card-lift rounded-xl border border-[#e4e9f1] bg-white p-6">
            <div className="w-9 h-9 rounded-lg bg-[#f0f7ff] border border-[#d4e6fc] flex items-center justify-center mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#116dff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h3
              className="text-[15px] font-bold mb-1.5"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Bi-directional Contact Sync
            </h3>
            <p className="text-[13px] text-[#6e7787] leading-relaxed mb-3">
              Create or update a contact on either side and it shows up on the
              other within seconds. Three layers of loop prevention keep things
              stable.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Event dedup", "Echo suppression", "Change detection"].map(
                (t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[#f0f7ff] text-[#116dff] font-medium"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Form Capture */}
          <div className="card-lift rounded-xl border border-[#e4e9f1] bg-white p-6">
            <div className="w-9 h-9 rounded-lg bg-[#fff5f2] border border-[#ffd4c8] flex items-center justify-center mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff5c35"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 8h4M7 12h10M7 16h6" />
              </svg>
            </div>
            <h3
              className="text-[15px] font-bold mb-1.5"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Form &amp; Lead Capture
            </h3>
            <p className="text-[13px] text-[#6e7787] leading-relaxed mb-3">
              Wix form submissions land in HubSpot automatically, with UTM
              source, medium, and campaign pulled from the page URL so you know
              which ad brought them in.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "utm_source",
                "utm_medium",
                "utm_campaign",
                "Auto-match fields",
              ].map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#fff5f2] text-[#e04420] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Field Mapping */}
          <div className="card-lift rounded-xl border border-[#e4e9f1] bg-white p-6">
            <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#e0d6ff] flex items-center justify-center mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0H5a2 2 0 01-2-2v-4m6 6h10a2 2 0 002-2v-4" />
                <circle cx="15" cy="9" r="1" fill="#7c3aed" />
                <circle cx="15" cy="15" r="1" fill="#7c3aed" />
              </svg>
            </div>
            <h3
              className="text-[15px] font-bold mb-1.5"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Field Mapping Dashboard
            </h3>
            <p className="text-[13px] text-[#6e7787] leading-relaxed mb-3">
              A visual UI inside your Wix admin panel where you pick which Wix
              fields map to which HubSpot properties, choose sync direction, and
              apply transforms.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Visual mapper", "Direction control", "Transforms"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#f5f3ff] text-[#7c3aed] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* OAuth Security */}
          <div className="card-lift rounded-xl border border-[#e4e9f1] bg-white p-6">
            <div className="w-9 h-9 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3
              className="text-[15px] font-bold mb-1.5"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              OAuth 2.0 Security
            </h3>
            <p className="text-[13px] text-[#6e7787] leading-relaxed mb-3">
              Proper OAuth for both platforms. Wix tokens refresh every 5
              minutes, HubSpot every 30 minutes. All tokens encrypted at rest
              with AES-256-CBC.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["AES-256-CBC", "HMAC-SHA256", "JWT verify", "Auto-refresh"].map(
                (t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[#f0fdf4] text-[#059669] font-medium"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Get Started / Testing Guide ── */}
      <section
        id="get-started"
        className="py-20"
        style={{ background: "#f9fafb" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold text-[#6e7787] tracking-wide uppercase mb-2">
              Try it out
            </p>
            <h2
              className="text-[30px] md:text-[38px] font-extrabold tracking-[-0.025em]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Get started in 5 minutes.
            </h2>
            <p className="text-[14px] text-[#6e7787] mt-2 max-w-md mx-auto">
              Follow these steps to install, connect, and test the full
              integration end-to-end.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="rounded-xl bg-white border border-[#e4e9f1] p-5 flex gap-4">
              <div
                className="w-7 h-7 rounded-full bg-[#116dff] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                1
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Create a Wix site (if you don&apos;t have one)
                </h3>
                <p className="text-[13px] text-[#6e7787] leading-relaxed">
                  Go to{" "}
                  <a
                    href="https://www.wix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#116dff] underline underline-offset-2"
                  >
                    wix.com
                  </a>
                  , sign up for free, and create any site. A blank site works
                  fine for testing.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl bg-white border border-[#e4e9f1] p-5 flex gap-4">
              <div
                className="w-7 h-7 rounded-full bg-[#116dff] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                2
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Install the app
                </h3>
                <p className="text-[13px] text-[#6e7787] leading-relaxed mb-2">
                  Click the button below. It opens the Wix installer, where you
                  pick your site and approve permissions. The OAuth flow runs
                  automatically.
                </p>
                <a
                  href={WIX_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#116dff] text-white text-[12px] font-semibold hover:bg-[#0d5fd6] transition-colors"
                >
                  Install on Wix
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl bg-white border border-[#e4e9f1] p-5 flex gap-4">
              <div
                className="w-7 h-7 rounded-full bg-[#ff5c35] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                3
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Connect HubSpot
                </h3>
                <p className="text-[13px] text-[#6e7787] leading-relaxed">
                  After installing, the app dashboard opens inside your Wix
                  admin panel. Click &quot;Connect HubSpot&quot; and authorize
                  with a{" "}
                  <a
                    href="https://app.hubspot.com/signup-hubspot/crm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff5c35] underline underline-offset-2"
                  >
                    free HubSpot CRM
                  </a>{" "}
                  account.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl bg-white border border-[#e4e9f1] p-5 flex gap-4">
              <div
                className="w-7 h-7 rounded-full bg-[#059669] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                4
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Test the sync
                </h3>
                <p className="text-[13px] text-[#6e7787] leading-relaxed">
                  Add a contact in your Wix CRM. Within 30 seconds, it should
                  appear in HubSpot. Try the reverse too: add a contact in
                  HubSpot and check Wix. Both directions work.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-xl bg-white border border-[#e4e9f1] p-5 flex gap-4">
              <div
                className="w-7 h-7 rounded-full bg-[#7c3aed] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                5
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  Test form capture (optional)
                </h3>
                <p className="text-[13px] text-[#6e7787] leading-relaxed">
                  Add a contact form to a Wix page, publish it, then visit the
                  page with{" "}
                  <code className="text-[12px] bg-[#f1f3f7] px-1.5 py-0.5 rounded">
                    ?utm_source=test&amp;utm_campaign=demo
                  </code>{" "}
                  in the URL. Submit the form and check HubSpot for the UTM
                  properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sync Engine ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold text-[#6e7787] tracking-wide uppercase mb-2">
            Reliability
          </p>
          <h2
            className="text-[30px] md:text-[38px] font-extrabold tracking-[-0.025em]"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Three layers, zero loops.
          </h2>
          <p className="text-[14px] text-[#6e7787] mt-2 max-w-md mx-auto">
            Bi-directional sync is hard because each write triggers a webhook on
            the other side. Here&apos;s how we prevent infinite loops.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              num: "01",
              title: "Event Dedup",
              desc: "Every webhook event ID gets stored in a TTL collection. If we've processed it before, we drop it immediately.",
            },
            {
              num: "02",
              title: "Echo Suppression",
              desc: "When we push data to HubSpot and get a webhook back within 5 seconds, that's our own echo. We skip it.",
            },
            {
              num: "03",
              title: "Data Comparison",
              desc: "Before writing to the target, we compare incoming values with what's already there. Identical data means no write needed.",
            },
          ].map((item) => (
            <div
              key={item.num}
              className="rounded-xl border border-[#e4e9f1] bg-white p-6"
            >
              <div className="text-[11px] font-bold text-[#9aa3b2] tracking-wider uppercase mb-3">
                Layer {item.num}
              </div>
              <h3
                className="text-[15px] font-bold mb-2"
                style={{ fontFamily: "Figtree, sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="text-[13px] text-[#6e7787] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Default Mappings ── */}
      <section className="py-20" style={{ background: "#f9fafb" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold text-[#6e7787] tracking-wide uppercase mb-2">
              Out of the box
            </p>
            <h2
              className="text-[26px] md:text-[30px] font-extrabold tracking-[-0.025em]"
              style={{ fontFamily: "Figtree, sans-serif" }}
            >
              Default field mappings
            </h2>
            <p className="text-[13px] text-[#6e7787] mt-2">
              Created automatically on install. Fully customizable in the
              dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-[#e4e9f1] bg-white overflow-hidden">
            <div className="grid grid-cols-[1fr_40px_1fr] items-center px-5 py-2.5 bg-[#f9fafb] border-b border-[#e4e9f1]">
              <span className="text-[11px] font-semibold text-[#116dff] uppercase tracking-wider">
                Wix Field
              </span>
              <span className="text-center text-[11px] text-[#c8d2e0]">
                &#8596;
              </span>
              <span className="text-[11px] font-semibold text-[#ff5c35] uppercase tracking-wider text-right">
                HubSpot
              </span>
            </div>
            {[
              ["info.name.first", "firstname"],
              ["info.name.last", "lastname"],
              ["primaryInfo.email", "email"],
              ["primaryInfo.phone", "phone"],
              ["info.company", "company"],
              ["info.jobTitle", "jobtitle"],
            ].map(([wix, hs], i) => (
              <div
                key={wix}
                className={`grid grid-cols-[1fr_40px_1fr] items-center px-5 py-3 ${
                  i < 5 ? "border-b border-[#edf1f7]" : ""
                } hover:bg-[#fafbfc] transition-colors`}
              >
                <span className="text-[13px] font-mono text-[#1a1d26]">
                  {wix}
                </span>
                <div className="flex justify-center">
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                  >
                    <path
                      d="M1 5h12M9 1.5L13 5l-4 3.5M5 1.5L1 5l4 3.5"
                      stroke="#c8d2e0"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-[13px] font-mono text-[#1a1d26] text-right">
                  {hs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section id="tech" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold text-[#6e7787] tracking-wide uppercase mb-2">
            Under the hood
          </p>
          <h2
            className="text-[30px] md:text-[38px] font-extrabold tracking-[-0.025em]"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            Built on solid foundations.
          </h2>
        </div>

        <div className="rounded-xl border border-[#e4e9f1] bg-white overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              {
                label: "Framework",
                value: "Next.js 16",
                sub: "App Router, TypeScript",
              },
              {
                label: "Database",
                value: "MongoDB Atlas",
                sub: "5 collections, TTL indexes",
              },
              {
                label: "Hosting",
                value: "Vercel",
                sub: "Serverless functions",
              },
              {
                label: "Tests",
                value: "80 unit tests",
                sub: "Vitest + Testing Library",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-5 ${
                  i < 3 ? "md:border-r border-[#edf1f7]" : ""
                } border-b border-[#edf1f7]`}
              >
                <div className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider mb-1.5">
                  {item.label}
                </div>
                <div
                  className="text-[14px] font-bold"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-[12px] text-[#6e7787]">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              {
                label: "Wix SDK",
                value: "REST API v4",
                sub: "Contacts, Forms",
              },
              {
                label: "HubSpot SDK",
                value: "@hubspot/api-client",
                sub: "v13+ strict enums",
              },
              {
                label: "Encryption",
                value: "AES-256-CBC",
                sub: "Tokens at rest",
              },
              {
                label: "Webhooks",
                value: "Real-time",
                sub: "JWT + HMAC verify",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-5 ${
                  i < 3 ? "md:border-r border-[#edf1f7]" : ""
                }`}
              >
                <div className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider mb-1.5">
                  {item.label}
                </div>
                <div
                  className="text-[14px] font-bold"
                  style={{ fontFamily: "Figtree, sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-[12px] text-[#6e7787]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* API Routes */}
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {[
            {
              group: "Auth",
              color: "#116dff",
              routes: [
                "/api/auth/wix/install",
                "/api/auth/wix/callback",
                "/api/auth/hubspot/connect",
                "/api/auth/hubspot/callback",
              ],
            },
            {
              group: "Webhooks",
              color: "#ff5c35",
              routes: [
                "/api/webhooks/wix/contact",
                "/api/webhooks/wix/form",
                "/api/webhooks/hubspot",
              ],
            },
            {
              group: "Dashboard",
              color: "#7c3aed",
              routes: [
                "/api/mappings",
                "/api/fields/wix",
                "/api/fields/hubspot",
                "/api/sync/trigger",
                "/api/sync/status",
                "/api/installation/status",
              ],
            },
          ].map((g) => (
            <div
              key={g.group}
              className="rounded-xl border border-[#e4e9f1] bg-white p-5"
            >
              <div
                className="text-[12px] font-bold mb-3"
                style={{ color: g.color, fontFamily: "Figtree, sans-serif" }}
              >
                {g.group} - {g.routes.length} routes
              </div>
              <div className="space-y-1">
                {g.routes.map((r) => (
                  <div
                    key={r}
                    className="text-[12px] font-mono text-[#6e7787] py-0.5"
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e4e9f1] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="#116dff" />
              <path
                d="M6 10h8m-3.5-3.5L14 10l-3.5 3.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[13px] text-[#6e7787]">
              Built by{" "}
              <span className="text-[#1a1d26] font-medium">
                Daniel Moenga
              </span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-[#6e7787] hover:text-[#1a1d26] transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="#get-started"
              className="text-[13px] text-[#6e7787] hover:text-[#1a1d26] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
