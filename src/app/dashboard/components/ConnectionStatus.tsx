'use client';

import { useEffect, useState } from 'react';

interface StatusData {
  wixConnected: boolean;
  hubspotConnected: boolean;
  hubspotPortalId: string | null;
  syncEnabled: boolean;
  lastSyncAt: string | null;
  errorCount: number;
  contactCount: number;
}

export function ConnectionStatus({ instanceId }: { instanceId: string }) {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/installation/status?instanceId=${instanceId}`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [instanceId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wix Status */}
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Wix</p>
            <p className="text-xs text-gray-500">Connected</p>
          </div>
        </div>

        {/* HubSpot Status */}
        <div className={`flex items-center gap-3 p-3 rounded-lg ${
          status?.hubspotConnected ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            status?.hubspotConnected ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          <div>
            <p className="text-sm font-medium text-gray-900">HubSpot</p>
            <p className="text-xs text-gray-500">
              {status?.hubspotConnected
                ? `Portal ${status.hubspotPortalId}`
                : 'Not connected'}
            </p>
          </div>
        </div>

        {/* Synced Contacts */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-blue-600 font-bold text-lg">{status?.contactCount ?? 0}</div>
          <div>
            <p className="text-sm font-medium text-gray-900">Synced</p>
            <p className="text-xs text-gray-500">Contacts</p>
          </div>
        </div>

        {/* Errors */}
        <div className={`flex items-center gap-3 p-3 rounded-lg ${
          (status?.errorCount ?? 0) > 0 ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <div className={`font-bold text-lg ${
            (status?.errorCount ?? 0) > 0 ? 'text-red-600' : 'text-gray-400'
          }`}>
            {status?.errorCount ?? 0}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Errors</p>
            <p className="text-xs text-gray-500">Unresolved</p>
          </div>
        </div>
      </div>

      {status?.lastSyncAt && (
        <p className="mt-3 text-xs text-gray-400">
          Last sync: {new Date(status.lastSyncAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
