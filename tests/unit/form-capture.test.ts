import { describe, it, expect } from 'vitest';
import { extractUTMParams, heuristicMatchField } from '@/lib/services/form-capture';

// ─── extractUTMParams ───

describe('extractUTMParams', () => {
  it('extracts all UTM parameters from URL', () => {
    const url = 'https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=shoes&utm_content=banner';
    const result = extractUTMParams(url);
    expect(result).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'spring',
      utm_term: 'shoes',
      utm_content: 'banner',
    });
  });

  it('extracts partial UTM parameters', () => {
    const url = 'https://example.com/page?utm_source=google&utm_campaign=test';
    const result = extractUTMParams(url);
    expect(result).toEqual({
      utm_source: 'google',
      utm_campaign: 'test',
    });
  });

  it('returns empty object for URL without UTM params', () => {
    const result = extractUTMParams('https://example.com/page?foo=bar');
    expect(result).toEqual({});
  });

  it('returns empty object for undefined URL', () => {
    expect(extractUTMParams(undefined)).toEqual({});
  });

  it('returns empty object for invalid URL', () => {
    expect(extractUTMParams('not-a-url')).toEqual({});
  });

  it('returns empty object for empty string', () => {
    expect(extractUTMParams('')).toEqual({});
  });

  it('handles encoded UTM values', () => {
    const url = 'https://example.com?utm_source=my%20source&utm_campaign=spring%20sale';
    const result = extractUTMParams(url);
    expect(result.utm_source).toBe('my source');
    expect(result.utm_campaign).toBe('spring sale');
  });
});

// ─── heuristicMatchField ───

describe('heuristicMatchField', () => {
  it('matches standard field names', () => {
    expect(heuristicMatchField('email')).toBe('email');
    expect(heuristicMatchField('phone')).toBe('phone');
    expect(heuristicMatchField('company')).toBe('company');
  });

  it('matches variations of first name', () => {
    expect(heuristicMatchField('first name')).toBe('firstname');
    expect(heuristicMatchField('first_name')).toBe('firstname');
    expect(heuristicMatchField('firstname')).toBe('firstname');
  });

  it('matches variations of last name', () => {
    expect(heuristicMatchField('last name')).toBe('lastname');
    expect(heuristicMatchField('last_name')).toBe('lastname');
    expect(heuristicMatchField('lastname')).toBe('lastname');
  });

  it('matches email variations', () => {
    expect(heuristicMatchField('email')).toBe('email');
    expect(heuristicMatchField('email address')).toBe('email');
  });

  it('matches phone variations', () => {
    expect(heuristicMatchField('phone')).toBe('phone');
    expect(heuristicMatchField('phone number')).toBe('phone');
    expect(heuristicMatchField('telephone')).toBe('phone');
  });

  it('matches company variations', () => {
    expect(heuristicMatchField('company')).toBe('company');
    expect(heuristicMatchField('company name')).toBe('company');
    expect(heuristicMatchField('organization')).toBe('company');
  });

  it('matches job title variations', () => {
    expect(heuristicMatchField('job title')).toBe('jobtitle');
    expect(heuristicMatchField('jobtitle')).toBe('jobtitle');
    expect(heuristicMatchField('position')).toBe('jobtitle');
  });

  it('matches address fields', () => {
    expect(heuristicMatchField('city')).toBe('city');
    expect(heuristicMatchField('state')).toBe('state');
    expect(heuristicMatchField('zip')).toBe('zip');
    expect(heuristicMatchField('zip code')).toBe('zip');
    expect(heuristicMatchField('postal code')).toBe('zip');
    expect(heuristicMatchField('country')).toBe('country');
  });

  it('is case-insensitive', () => {
    expect(heuristicMatchField('Email')).toBe('email');
    expect(heuristicMatchField('PHONE')).toBe('phone');
    expect(heuristicMatchField('First Name')).toBe('firstname');
  });

  it('trims whitespace', () => {
    expect(heuristicMatchField('  email  ')).toBe('email');
    expect(heuristicMatchField(' phone ')).toBe('phone');
  });

  it('returns null for unrecognized fields', () => {
    expect(heuristicMatchField('favorite_color')).toBeNull();
    expect(heuristicMatchField('random_field')).toBeNull();
    expect(heuristicMatchField('')).toBeNull();
  });
});
