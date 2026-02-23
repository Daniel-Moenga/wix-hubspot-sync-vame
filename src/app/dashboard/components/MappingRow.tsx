'use client';

interface MappingRowProps {
  mapping: {
    _id: string;
    wixFieldLabel: string;
    wixField: string;
    hubspotPropertyLabel: string;
    hubspotProperty: string;
    transformType: string;
    direction: string;
    isActive: boolean;
    isDefault: boolean;
  };
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

const directionIcons: Record<string, string> = {
  both: '\u2194',
  wix_to_hubspot: '\u2192',
  hubspot_to_wix: '\u2190',
};

const directionLabels: Record<string, string> = {
  both: 'Both',
  wix_to_hubspot: 'Wix \u2192 HS',
  hubspot_to_wix: 'HS \u2192 Wix',
};

const transformLabels: Record<string, string> = {
  identity: 'None',
  lowercase: 'Lowercase',
  uppercase: 'Uppercase',
  date_format: 'Date',
  enum_map: 'Map Values',
};

export function MappingRow({ mapping, onDelete, onToggle }: MappingRowProps) {
  return (
    <tr className={`transition-colors ${mapping.isActive ? '' : 'opacity-50'}`}>
      {/* Active Toggle */}
      <td className="py-2.5 px-3">
        <button
          onClick={() => onToggle(mapping._id, mapping.isActive)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            mapping.isActive ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              mapping.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
            }`}
            style={{ transform: mapping.isActive ? 'translateX(18px)' : 'translateX(2px)' }}
          />
        </button>
      </td>

      {/* Wix Field */}
      <td className="py-2.5 px-3">
        <div>
          <span className="text-sm font-medium text-gray-900">{mapping.wixFieldLabel}</span>
          <span className="text-xs text-gray-400 ml-1.5 font-mono">{mapping.wixField}</span>
        </div>
      </td>

      {/* Direction */}
      <td className="py-2.5 px-3 text-center">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
          title={directionLabels[mapping.direction]}
        >
          {directionIcons[mapping.direction] || '\u2194'}
        </span>
      </td>

      {/* HubSpot Property */}
      <td className="py-2.5 px-3">
        <div>
          <span className="text-sm font-medium text-gray-900">{mapping.hubspotPropertyLabel}</span>
          <span className="text-xs text-gray-400 ml-1.5 font-mono">{mapping.hubspotProperty}</span>
        </div>
      </td>

      {/* Transform */}
      <td className="py-2.5 px-3">
        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          {transformLabels[mapping.transformType] || mapping.transformType}
        </span>
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3 text-right">
        <button
          onClick={() => onDelete(mapping._id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          title="Delete mapping"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
