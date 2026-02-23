'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const InstanceContext = createContext<string | null>(null);

export function useInstanceId() {
  const ctx = useContext(InstanceContext);
  if (!ctx) throw new Error('useInstanceId must be used within DashboardLayout');
  return ctx;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // Wix passes instance data as a query param
      const instance = params.get('instance');
      const directInstanceId = params.get('instanceId');

      if (directInstanceId) {
        setInstanceId(directInstanceId);
        return;
      }

      if (instance) {
        // Decode the Wix instance JWT (base64url encoded payload)
        const parts = instance.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          setInstanceId(payload.instanceId || payload.instance_id);
          return;
        }
      }

      // Fallback: use a demo instance ID for development
      if (process.env.NODE_ENV === 'development') {
        setInstanceId('demo-instance-id');
        return;
      }

      setError('Missing instance context. Please access this page through the Wix dashboard.');
    } catch (err) {
      setError(`Failed to initialize: ${String(err)}`);
    }
  }, []);

  // Listen for HubSpot connection messages from popup
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'HUBSPOT_CONNECTED') {
        window.location.reload();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Configuration Error</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!instanceId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <InstanceContext.Provider value={instanceId}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </InstanceContext.Provider>
  );
}
