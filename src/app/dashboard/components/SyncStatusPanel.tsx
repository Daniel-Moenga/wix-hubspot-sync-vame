'use client';

import { useState } from 'react';

export function SyncStatusPanel({ instanceId }: { instanceId: string }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    syncedCount?: number;
    errorCount?: number;
  } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch('/api/sync/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceId, direction: 'both' }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          syncedCount: data.syncedCount,
          errorCount: data.errorCount,
        });
      } else {
        setResult({ success: false });
      }
    } catch {
      setResult({ success: false });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manual Sync</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Trigger a full contact sync between Wix and HubSpot
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {syncing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Now
            </>
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.success ? (
            <p>
              Sync complete: {result.syncedCount} contacts synced
              {(result.errorCount ?? 0) > 0 && `, ${result.errorCount} errors`}
            </p>
          ) : (
            <p>Sync failed. Please check that HubSpot is connected.</p>
          )}
        </div>
      )}
    </div>
  );
}
