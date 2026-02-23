'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorBannerContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const detail = searchParams.get('detail');

  if (error !== 'install_failed') return null;

  return (
    <div className="bg-red-50 border-b border-red-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-start gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <div>
          <p className="text-[13px] font-semibold text-red-800">
            Installation could not be completed
          </p>
          {detail && (
            <p className="text-[12px] text-red-600 mt-0.5 font-mono">
              {decodeURIComponent(detail)}
            </p>
          )}
          <p className="text-[12px] text-red-500 mt-1">
            Please try again. If the issue persists, make sure you have a Wix
            site selected and that your browser allows pop-ups.
          </p>
        </div>
      </div>
    </div>
  );
}

export function InstallErrorBanner() {
  return (
    <Suspense fallback={null}>
      <ErrorBannerContent />
    </Suspense>
  );
}
