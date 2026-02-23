'use client';

import { useState, useEffect, useCallback } from 'react';
import { MappingRow } from './MappingRow';
import { AddMappingModal } from './AddMappingModal';

interface Mapping {
  _id: string;
  wixField: string;
  wixFieldLabel: string;
  hubspotProperty: string;
  hubspotPropertyLabel: string;
  transformType: string;
  direction: string;
  isActive: boolean;
  isDefault: boolean;
}

export interface FieldOption {
  key: string;
  label: string;
  type: string;
}

export function FieldMappingTable({ instanceId }: { instanceId: string }) {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [wixFields, setWixFields] = useState<FieldOption[]>([]);
  const [hubspotProperties, setHubspotProperties] = useState<FieldOption[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [mappingsRes, wixRes, hubspotRes] = await Promise.all([
        fetch(`/api/mappings?instanceId=${instanceId}`).then((r) => r.json()),
        fetch(`/api/fields/wix?instanceId=${instanceId}`).then((r) => r.json()),
        fetch(`/api/fields/hubspot?instanceId=${instanceId}`).then((r) => r.json()).catch(() => ({ properties: [] })),
      ]);

      setMappings(mappingsRes.mappings || []);
      setWixFields(wixRes.fields || []);
      setHubspotProperties(hubspotRes.properties || []);
    } catch (err) {
      console.error('Failed to fetch mapping data:', err);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (mappingId: string) => {
    try {
      await fetch(`/api/mappings?instanceId=${instanceId}&mappingId=${mappingId}`, {
        method: 'DELETE',
      });
      setMappings((prev) => prev.filter((m) => m._id !== mappingId));
    } catch (err) {
      console.error('Failed to delete mapping:', err);
    }
  };

  const handleToggle = async (mappingId: string, isActive: boolean) => {
    try {
      await fetch('/api/mappings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceId, mappingId, isActive: !isActive }),
      });
      setMappings((prev) =>
        prev.map((m) => (m._id === mappingId ? { ...m, isActive: !isActive } : m)),
      );
    } catch (err) {
      console.error('Failed to toggle mapping:', err);
    }
  };

  const handleAddMapping = (newMapping: Mapping) => {
    setMappings((prev) => [...prev, newMapping]);
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Field Mappings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure how fields sync between Wix and HubSpot
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Mapping
        </button>
      </div>

      {mappings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No field mappings configured yet.</p>
          <p className="text-xs mt-1">Click &ldquo;Add Mapping&rdquo; to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Active</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Wix Field</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Direction</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">HubSpot Property</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Transform</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mappings.map((m) => (
                <MappingRow
                  key={m._id}
                  mapping={m}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddMappingModal
          instanceId={instanceId}
          wixFields={wixFields}
          hubspotProperties={hubspotProperties}
          existingMappings={mappings}
          onSave={handleAddMapping}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
