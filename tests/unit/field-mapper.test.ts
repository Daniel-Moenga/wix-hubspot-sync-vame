import { describe, it, expect } from 'vitest';
import {
  getNestedValue,
  setNestedValue,
  transformValue,
  reverseTransformValue,
  mapWixToHubSpot,
  mapHubSpotToWix,
  isDataIdentical,
} from '@/lib/services/field-mapper';
import { FieldMappingRecord } from '@/types/mappings';

// ─── getNestedValue ───

describe('getNestedValue', () => {
  it('gets top-level values', () => {
    expect(getNestedValue({ name: 'Alice' }, 'name')).toBe('Alice');
  });

  it('gets nested values with dot notation', () => {
    const obj = { info: { name: { first: 'Alice' } } };
    expect(getNestedValue(obj, 'info.name.first')).toBe('Alice');
  });

  it('gets array values with bracket notation', () => {
    const obj = { emails: [{ email: 'a@b.com' }, { email: 'c@d.com' }] };
    expect(getNestedValue(obj, 'emails[1].email')).toBe('c@d.com');
  });

  it('returns undefined for missing paths', () => {
    expect(getNestedValue({ a: 1 }, 'b.c.d')).toBeUndefined();
  });

  it('returns undefined when traversing null', () => {
    expect(getNestedValue({ a: null } as Record<string, unknown>, 'a.b')).toBeUndefined();
  });

  it('handles empty path parts', () => {
    const obj = { info: { company: 'Acme' } };
    expect(getNestedValue(obj, 'info.company')).toBe('Acme');
  });
});

// ─── setNestedValue ───

describe('setNestedValue', () => {
  it('sets top-level values', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'name', 'Bob');
    expect(obj.name).toBe('Bob');
  });

  it('creates nested objects automatically', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'info.name.first', 'Bob');
    expect((obj.info as Record<string, unknown>)).toEqual({ name: { first: 'Bob' } });
  });

  it('creates arrays when next key is numeric', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'items.0.value', 'test');
    expect(Array.isArray(obj.items)).toBe(true);
  });

  it('overwrites existing values', () => {
    const obj: Record<string, unknown> = { info: { name: { first: 'Alice' } } };
    setNestedValue(obj, 'info.name.first', 'Bob');
    expect(getNestedValue(obj, 'info.name.first')).toBe('Bob');
  });
});

// ─── transformValue ───

describe('transformValue', () => {
  it('returns null for null/undefined/empty values', () => {
    expect(transformValue(null, 'identity')).toBeNull();
    expect(transformValue(undefined, 'identity')).toBeNull();
    expect(transformValue('', 'identity')).toBeNull();
  });

  it('identity: passes value through', () => {
    expect(transformValue('Hello', 'identity')).toBe('Hello');
  });

  it('lowercase: converts to lowercase', () => {
    expect(transformValue('John@EMAIL.COM', 'lowercase')).toBe('john@email.com');
  });

  it('uppercase: converts to uppercase', () => {
    expect(transformValue('hello', 'uppercase')).toBe('HELLO');
  });

  it('date_format: converts to timestamp', () => {
    const result = transformValue('2024-01-15', 'date_format');
    expect(result).toBe(new Date('2024-01-15').getTime().toString());
  });

  it('enum_map: maps values using config', () => {
    const config = { mr: 'Mr.', ms: 'Ms.' };
    expect(transformValue('mr', 'enum_map', config)).toBe('Mr.');
  });

  it('enum_map: returns original if no mapping found', () => {
    const config = { mr: 'Mr.' };
    expect(transformValue('dr', 'enum_map', config)).toBe('dr');
  });

  it('converts non-string values to strings', () => {
    expect(transformValue(42, 'identity')).toBe('42');
    expect(transformValue(true, 'identity')).toBe('true');
  });
});

// ─── reverseTransformValue ───

describe('reverseTransformValue', () => {
  it('returns null for null/undefined/empty', () => {
    expect(reverseTransformValue(null, 'identity')).toBeNull();
    expect(reverseTransformValue('', 'identity')).toBeNull();
  });

  it('identity: passes value through', () => {
    expect(reverseTransformValue('Hello', 'identity')).toBe('Hello');
  });

  it('lowercase/uppercase: passes through (non-reversible)', () => {
    expect(reverseTransformValue('hello', 'lowercase')).toBe('hello');
    expect(reverseTransformValue('HELLO', 'uppercase')).toBe('HELLO');
  });

  it('date_format: converts timestamp back to ISO string', () => {
    const ts = new Date('2024-01-15').getTime().toString();
    const result = reverseTransformValue(ts, 'date_format');
    expect(result).toContain('2024-01-15');
  });

  it('enum_map: reverses the mapping', () => {
    const config = { mr: 'Mr.', ms: 'Ms.' };
    expect(reverseTransformValue('Mr.', 'enum_map', config)).toBe('mr');
  });
});

// ─── mapWixToHubSpot ───

describe('mapWixToHubSpot', () => {
  const makeMappings = (overrides: Partial<FieldMappingRecord>[] = []): FieldMappingRecord[] => {
    const defaults: FieldMappingRecord[] = [
      {
        wixField: 'info.name.first',
        wixFieldLabel: 'First Name',
        hubspotProperty: 'firstname',
        hubspotPropertyLabel: 'First Name',
        transformType: 'identity',
        transformConfig: null,
        direction: 'both',
        isActive: true,
        isDefault: true,
      },
      {
        wixField: 'primaryInfo.email',
        wixFieldLabel: 'Email',
        hubspotProperty: 'email',
        hubspotPropertyLabel: 'Email',
        transformType: 'lowercase',
        transformConfig: null,
        direction: 'both',
        isActive: true,
        isDefault: true,
      },
    ];
    return defaults.map((d, i) => ({ ...d, ...overrides[i] }));
  };

  it('maps Wix contact fields to HubSpot properties', () => {
    const wixContact = {
      id: '123',
      revision: 1,
      info: { name: { first: 'Alice', last: 'Smith' } },
      primaryInfo: { email: 'ALICE@TEST.COM', phone: '' },
      createdDate: '2024-01-01',
      updatedDate: '2024-01-02',
    };

    const result = mapWixToHubSpot(wixContact as never, makeMappings());
    expect(result.firstname).toBe('Alice');
    expect(result.email).toBe('alice@test.com');
  });

  it('skips inactive mappings', () => {
    const wixContact = {
      id: '123',
      revision: 1,
      info: { name: { first: 'Alice' } },
      primaryInfo: { email: 'alice@test.com' },
      createdDate: '2024-01-01',
      updatedDate: '2024-01-02',
    };

    const mappings = makeMappings([{ isActive: false }, {}]);
    const result = mapWixToHubSpot(wixContact as never, mappings);
    expect(result.firstname).toBeUndefined();
    expect(result.email).toBe('alice@test.com');
  });

  it('skips hubspot_to_wix direction mappings', () => {
    const wixContact = {
      id: '123',
      revision: 1,
      info: { name: { first: 'Alice' } },
      primaryInfo: { email: 'alice@test.com' },
      createdDate: '2024-01-01',
      updatedDate: '2024-01-02',
    };

    const mappings = makeMappings([{ direction: 'hubspot_to_wix' }, {}]);
    const result = mapWixToHubSpot(wixContact as never, mappings);
    expect(result.firstname).toBeUndefined();
    expect(result.email).toBe('alice@test.com');
  });

  it('handles missing nested values gracefully', () => {
    const wixContact = {
      id: '123',
      revision: 1,
      info: {},
      primaryInfo: {},
      createdDate: '2024-01-01',
      updatedDate: '2024-01-02',
    };

    const result = mapWixToHubSpot(wixContact as never, makeMappings());
    expect(Object.keys(result)).toHaveLength(0);
  });
});

// ─── mapHubSpotToWix ───

describe('mapHubSpotToWix', () => {
  it('maps HubSpot properties to Wix nested structure', () => {
    const hsContact = {
      id: '456',
      properties: { firstname: 'Bob', email: 'bob@test.com' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
      archived: false,
    };

    const mappings: FieldMappingRecord[] = [
      {
        wixField: 'info.name.first',
        wixFieldLabel: 'First Name',
        hubspotProperty: 'firstname',
        hubspotPropertyLabel: 'First Name',
        transformType: 'identity',
        transformConfig: null,
        direction: 'both',
        isActive: true,
        isDefault: true,
      },
    ];

    const result = mapHubSpotToWix(hsContact, mappings);
    expect(getNestedValue(result, 'info.name.first')).toBe('Bob');
  });

  it('skips wix_to_hubspot direction mappings', () => {
    const hsContact = {
      id: '456',
      properties: { firstname: 'Bob' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
      archived: false,
    };

    const mappings: FieldMappingRecord[] = [
      {
        wixField: 'info.name.first',
        wixFieldLabel: 'First Name',
        hubspotProperty: 'firstname',
        hubspotPropertyLabel: 'First Name',
        transformType: 'identity',
        transformConfig: null,
        direction: 'wix_to_hubspot',
        isActive: true,
        isDefault: true,
      },
    ];

    const result = mapHubSpotToWix(hsContact, mappings);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

// ─── isDataIdentical ───

describe('isDataIdentical', () => {
  it('returns true when all properties match', () => {
    const newProps = { firstname: 'Alice', email: 'alice@test.com' };
    const currentProps = { firstname: 'Alice', email: 'alice@test.com' };
    expect(isDataIdentical(newProps, currentProps)).toBe(true);
  });

  it('returns false when properties differ', () => {
    const newProps = { firstname: 'Alice', email: 'alice@test.com' };
    const currentProps = { firstname: 'Bob', email: 'alice@test.com' };
    expect(isDataIdentical(newProps, currentProps)).toBe(false);
  });

  it('treats empty string and null as identical', () => {
    const newProps = { firstname: '' };
    const currentProps = { firstname: null };
    expect(isDataIdentical(newProps, currentProps)).toBe(true);
  });

  it('handles properties not present in current data', () => {
    const newProps = { firstname: 'Alice', phone: '123' };
    const currentProps = { firstname: 'Alice' } as Record<string, string | null>;
    expect(isDataIdentical(newProps, currentProps)).toBe(false);
  });
});
