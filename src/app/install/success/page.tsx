import Link from 'next/link';

type SearchParams = Promise<{ instanceId?: string }>;

export default async function InstallSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const instanceId = params.instanceId;
  const dashboardHref = instanceId
    ? `/dashboard?instanceId=${encodeURIComponent(instanceId)}`
    : '/dashboard';
  const homeHref = instanceId
    ? `/?installed=1&instanceId=${encodeURIComponent(instanceId)}`
    : '/?installed=1';

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-[#e5e7eb] shadow-sm p-8 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Installation complete
        </div>

        <h1
          className="text-[30px] md:text-[36px] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#111827] mb-3"
          style={{ fontFamily: 'Figtree, sans-serif' }}
        >
          Your Wix app is ready.
        </h1>
        <p className="text-[15px] text-[#4b5563] leading-relaxed mb-7">
          The integration has been installed successfully. Open the dashboard from Wix
          to manage field mappings and connect your HubSpot account.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={dashboardHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#116dff] text-white text-[14px] font-semibold hover:bg-[#0d5fd6] transition-colors"
          >
            Open App Dashboard
          </Link>
          <a
            href="https://manage.wix.com/dashboard/sites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#d1d5db] text-[#111827] text-[14px] font-semibold hover:bg-[#f9fafb] transition-colors"
          >
            Open Wix Admin
          </a>
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#6b7280] text-[14px] font-semibold hover:text-[#111827] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

