import { FieldMappingRecord, TransformType } from '@/types/mappings';
import { WixContact } from '@/types/wix';
import { HubSpotContact } from '@/types/hubspot';
import { getDb } from '@/lib/db';

/**
 * Get a nested value from an object using dot-notation path.
 * Supports array indexing: "info.emails[0].email"
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Set a nested value on an object using dot-notation path.
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] == null || typeof current[part] !== 'object') {
      const nextPart = parts[i + 1];
      current[part] = /^\d+$/.test(nextPart) ? [] : {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * Apply a transformation to a field value.
 */
export function transformValue(
  value: unknown,
  transformType: TransformType,
  transformConfig?: Record<string, string> | null,
): string | null {
  if (value == null || value === '') return null;

  const strValue = String(value);

  switch (transformType) {
    case 'identity':
      return strValue;
    case 'lowercase':
      return strValue.toLowerCase();
    case 'uppercase':
      return strValue.toUpperCase();
    case 'date_format':
      try {
        return new Date(strValue).getTime().toString();
      } catch {
        return strValue;
      }
    case 'enum_map':
      if (transformConfig && strValue in transformConfig) {
        return transformConfig[strValue];
      }
      return strValue;
    default:
      return strValue;
  }
}

/**
 * Reverse a transformation (for HubSpot → Wix direction).
 */
export function reverseTransformValue(
  value: unknown,
  transformType: TransformType,
  transformConfig?: Record<string, string> | null,
): string | null {
  if (value == null || value === '') return null;

  const strValue = String(value);

  switch (transformType) {
    case 'identity':
      return strValue;
    case 'lowercase':
    case 'uppercase':
      return strValue; // Can't reverse case transforms meaningfully
    case 'date_format':
      try {
        const ts = parseInt(strValue, 10);
        return isNaN(ts) ? strValue : new Date(ts).toISOString();
      } catch {
        return strValue;
      }
    case 'enum_map':
      if (transformConfig) {
        const reverseMap = Object.entries(transformConfig).find(([, v]) => v === strValue);
        if (reverseMap) return reverseMap[0];
      }
      return strValue;
    default:
      return strValue;
  }
}

/**
 * Map Wix contact data to HubSpot properties using field mappings.
 */
export function mapWixToHubSpot(
  wixContact: WixContact,
  mappings: FieldMappingRecord[],
): Record<string, string> {
  const properties: Record<string, string> = {};

  for (const mapping of mappings) {
    if (!mapping.isActive) continue;
    if (mapping.direction === 'hubspot_to_wix') continue;

    const rawValue = getNestedValue(
      wixContact as unknown as Record<string, unknown>,
      mapping.wixField,
    );

    const transformed = transformValue(rawValue, mapping.transformType, mapping.transformConfig);
    if (transformed !== null) {
      properties[mapping.hubspotProperty] = transformed;
    }
  }

  return properties;
}

/**
 * Map HubSpot contact data to Wix contact structure using field mappings.
 */
export function mapHubSpotToWix(
  hubspotContact: HubSpotContact,
  mappings: FieldMappingRecord[],
): Record<string, unknown> {
  const wixData: Record<string, unknown> = {};

  for (const mapping of mappings) {
    if (!mapping.isActive) continue;
    if (mapping.direction === 'wix_to_hubspot') continue;

    const rawValue = hubspotContact.properties[mapping.hubspotProperty];
    const transformed = reverseTransformValue(
      rawValue,
      mapping.transformType,
      mapping.transformConfig,
    );

    if (transformed !== null) {
      setNestedValue(wixData, mapping.wixField, transformed);
    }
  }

  return wixData;
}

/**
 * Get active field mappings for an installation in a given direction.
 */
export async function getActiveFieldMappings(
  instanceId: string,
  direction: 'wix_to_hubspot' | 'hubspot_to_wix' | 'both',
): Promise<FieldMappingRecord[]> {
  const db = await getDb();

  const filter: Record<string, unknown> = {
    wixInstanceId: instanceId,
    isActive: true,
  };

  if (direction !== 'both') {
    filter.direction = { $in: [direction, 'both'] };
  }

  return db.collection<FieldMappingRecord>('field_mappings').find(filter).toArray();
}

/**
 * Check if mapped data is identical to current target data.
 * Used for Layer 3 of loop prevention.
 */
export function isDataIdentical(
  newProperties: Record<string, string>,
  currentProperties: Record<string, string | null>,
): boolean {
  for (const [key, value] of Object.entries(newProperties)) {
    const currentValue = currentProperties[key];
    if (value !== currentValue && !(value === '' && currentValue == null)) {
      return false;
    }
  }
  return true;
}
