'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessBannerContent() {
  const searchParams = useSearchParams();
  const installed = searchParams.get('installed');
  const instanceId = searchParams.get('instanceId');

  if (installed !== '1') return null;

  const dashboardHref = instanceId
    ? `/dashboard?instanceId=${encodeURIComponent(instanceId)}`
    : '/dashboard';

  return (
    <div className="bg-emerald-50 border-b border-emerald-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#047857"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-emerald-900">
              Installation completed successfully
            </p>
            <p className="text-[12px] text-emerald-700 mt-0.5">
              Your Wix app is ready. Open the dashboard to continue with HubSpot connection.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={dashboardHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open App Dashboard
          </a>
          <a
            href="https://manage.wix.com/dashboard/sites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-300 text-emerald-800 text-[12px] font-semibold hover:bg-emerald-100 transition-colors"
          >
            Open Wix Admin
          </a>
        </div>
      </div>
    </div>
  );
}

export function InstallSuccessBanner() {
  return (
    <Suspense fallback={null}>
      <SuccessBannerContent />
    </Suspense>
  );
}

