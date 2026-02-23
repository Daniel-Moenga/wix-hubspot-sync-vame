import { FieldMappingRecord } from '@/types/mappings';

export const WIX_OAUTH_BASE = 'https://www.wixapis.com/oauth2';
export const WIX_INSTALLER_URL = 'https://www.wix.com/installer/install';
export const WIX_API_BASE = 'https://www.wixapis.com';

export const HUBSPOT_AUTH_URL = 'https://app.hubspot.com/oauth/authorize';
export const HUBSPOT_TOKEN_URL = 'https://api.hubapi.com/oauth/v1/token';
export const HUBSPOT_API_BASE = 'https://api.hubapi.com';

export const HUBSPOT_SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.schemas.contacts.read',
].join(' ');

export const LOOP_PREVENTION_WINDOW_MS = 5000; // 5 seconds
export const EVENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SYNC_ERROR_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const DEFAULT_FIELD_MAPPINGS: Omit<
  FieldMappingRecord,
  '_id' | 'installationId' | 'wixInstanceId' | 'createdAt' | 'updatedAt'
>[] = [
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
    wixField: 'info.name.last',
    wixFieldLabel: 'Last Name',
    hubspotProperty: 'lastname',
    hubspotPropertyLabel: 'Last Name',
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
  {
    wixField: 'primaryInfo.phone',
    wixFieldLabel: 'Phone',
    hubspotProperty: 'phone',
    hubspotPropertyLabel: 'Phone',
    transformType: 'identity',
    transformConfig: null,
    direction: 'both',
    isActive: true,
    isDefault: true,
  },
  {
    wixField: 'info.company',
    wixFieldLabel: 'Company',
    hubspotProperty: 'company',
    hubspotPropertyLabel: 'Company Name',
    transformType: 'identity',
    transformConfig: null,
    direction: 'both',
    isActive: true,
    isDefault: true,
  },
  {
    wixField: 'info.jobTitle',
    wixFieldLabel: 'Job Title',
    hubspotProperty: 'jobtitle',
    hubspotPropertyLabel: 'Job Title',
    transformType: 'identity',
    transformConfig: null,
    direction: 'both',
    isActive: true,
    isDefault: true,
  },
];

export const UTM_PROPERTIES = [
  { name: 'utm_source', label: 'UTM Source' },
  { name: 'utm_medium', label: 'UTM Medium' },
  { name: 'utm_campaign', label: 'UTM Campaign' },
  { name: 'utm_content', label: 'UTM Content' },
  { name: 'utm_term', label: 'UTM Term' },
];

export const FORM_FIELD_HEURISTICS: Record<string, string> = {
  'first name': 'firstname',
  'first_name': 'firstname',
  'firstname': 'firstname',
  'last name': 'lastname',
  'last_name': 'lastname',
  'lastname': 'lastname',
  'email': 'email',
  'email address': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'telephone': 'phone',
  'company': 'company',
  'company name': 'company',
  'organization': 'company',
  'job title': 'jobtitle',
  'jobtitle': 'jobtitle',
  'position': 'jobtitle',
  'address': 'address',
  'street': 'address',
  'city': 'city',
  'state': 'state',
  'zip': 'zip',
  'zip code': 'zip',
  'postal code': 'zip',
  'country': 'country',
  'website': 'website',
  'url': 'website',
  'message': 'message',
};
