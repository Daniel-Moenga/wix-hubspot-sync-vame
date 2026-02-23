export type TransformType = 'identity' | 'lowercase' | 'uppercase' | 'date_format' | 'enum_map';

export type MappingDirection = 'both' | 'wix_to_hubspot' | 'hubspot_to_wix';

export interface FieldMappingRecord {
  _id?: string;
  installationId: string;
  wixInstanceId: string;
  wixField: string;
  wixFieldLabel: string;
  hubspotProperty: string;
  hubspotPropertyLabel: string;
  transformType: TransformType;
  transformConfig?: Record<string, string> | null;
  direction: MappingDirection;
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstallationRecord {
  wixInstanceId: string;
  wixAccessToken: string;
  wixRefreshToken: string;
  wixTokenExpiresAt: Date;
  hubspotAccessToken?: string | null;
  hubspotRefreshToken?: string | null;
  hubspotTokenExpiresAt?: Date | null;
  hubspotPortalId?: string | null;
  installedAt: Date;
  hubspotConnectedAt?: Date | null;
  updatedAt: Date;
  isActive: boolean;
  syncEnabled: boolean;
  lastSyncAt?: Date | null;
}

export interface FieldOption {
  key: string;
  label: string;
  type: string;
}
