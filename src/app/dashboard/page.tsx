'use client';

import { useInstanceId } from './layout';
import { ConnectionStatus } from './components/ConnectionStatus';
import { HubSpotConnectButton } from './components/HubSpotConnectButton';
import { FieldMappingTable } from './components/FieldMappingTable';
import { SyncStatusPanel } from './components/SyncStatusPanel';

export default function DashboardPage() {
  const instanceId = useInstanceId();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            HubSpot Integration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sync contacts between your Wix site and HubSpot CRM
          </p>
        </div>
        <HubSpotConnectButton instanceId={instanceId} />
      </div>

      {/* Connection Status */}
      <ConnectionStatus instanceId={instanceId} />

      {/* Field Mappings */}
      <FieldMappingTable instanceId={instanceId} />

      {/* Sync Controls */}
      <SyncStatusPanel instanceId={instanceId} />
    </div>
  );
}
