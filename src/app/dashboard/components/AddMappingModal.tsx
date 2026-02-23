'use client';

import { useState } from 'react';
import type { FieldOption } from './FieldMappingTable';

interface AddMappingModalProps {
  instanceId: string;
  wixFields: FieldOption[];
  hubspotProperties: FieldOption[];
  existingMappings: Array<{ hubspotProperty: string; wixFieldLabel: string }>;
  onSave: (mapping: any) => void;
  onClose: () => void;
}

export function AddMappingModal({
  instanceId,
  wixFields,
  hubspotProperties,
  existingMappings,
  onSave,
  onClose,
}: AddMappingModalProps) {
  const [wixField, setWixField] = useState('');
  const [hubspotProperty, setHubspotProperty] = useState('');
  const [transformType, setTransformType] = useState('identity');
  const [direction, setDirection] = useState('both');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out HubSpot properties that are already mapped
  const mappedHubspotKeys = new Set(existingMappings.map((m) => m.hubspotProperty));
  const availableHubspotProperties = hubspotProperties.filter(
    (p) => !mappedHubspotKeys.has(p.key),
  );

  const selectedWixField = wixFields.find((f) => f.key === wixField);
  const selectedHubspotProp = hubspotProperties.find((p) => p.key === hubspotProperty);

  const handleSave = async () => {
    if (!wixField || !hubspotProperty) {
      setError('Please select both a Wix field and a HubSpot property.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceId,
          wixField,
          wixFieldLabel: selectedWixField?.label || wixField,
          hubspotProperty,
          hubspotPropertyLabel: selectedHubspotProp?.label || hubspotProperty,
          transformType,
          direction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create mapping');
      }

      const data = await response.json();
      onSave(data.mapping);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add Field Mapping</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Map a Wix contact field to a HubSpot contact property
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Wix Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wix Field
            </label>
            <select
              value={wixField}
              onChange={(e) => setWixField(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a Wix field...</option>
              {wixFields.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>

          {/* HubSpot Property */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HubSpot Property
            </label>
            <select
              value={hubspotProperty}
              onChange={(e) => setHubspotProperty(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a HubSpot property...</option>
              {availableHubspotProperties.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label} ({p.key})
                </option>
              ))}
            </select>
          </div>

          {/* Transform Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transform
            </label>
            <select
              value={transformType}
              onChange={(e) => setTransformType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="identity">None (copy as-is)</option>
              <option value="lowercase">Lowercase</option>
              <option value="uppercase">Uppercase</option>
              <option value="date_format">Date Format</option>
              <option value="enum_map">Value Mapping</option>
            </select>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sync Direction
            </label>
            <div className="flex gap-2">
              {[
                { value: 'both', label: 'Both \u2194' },
                { value: 'wix_to_hubspot', label: 'Wix \u2192 HubSpot' },
                { value: 'hubspot_to_wix', label: 'HubSpot \u2192 Wix' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDirection(opt.value)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    direction === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !wixField || !hubspotProperty}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-md transition-colors"
          >
            {saving ? 'Saving...' : 'Add Mapping'}
          </button>
        </div>
      </div>
    </div>
  );
}
