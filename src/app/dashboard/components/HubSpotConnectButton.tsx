'use client';

import { useEffect, useState } from 'react';

export function HubSpotConnectButton({ instanceId }: { instanceId: string }) {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`/api/installation/status?instanceId=${instanceId}`)
      .then((r) => r.json())
      .then((data) => setConnected(data.hubspotConnected))
      .catch(() => setConnected(false));
  }, [instanceId]);

  const handleConnect = () => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      `/api/auth/hubspot/connect?instanceId=${instanceId}`,
      'hubspot-connect',
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  if (connected === null) return null;

  if (connected) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        HubSpot Connected
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      Connect HubSpot
    </button>
  );
}
