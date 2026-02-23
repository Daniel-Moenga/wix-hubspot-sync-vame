export type SyncDirection = 'wix_to_hubspot' | 'hubspot_to_wix' | 'both';
export type SyncSource = 'webhook' | 'manual' | 'form';

export interface SyncResult {
  status: 'success' | 'skipped' | 'error';
  reason?: string;
  sourceContactId?: string;
  targetContactId?: string;
  error?: string;
}

export interface ContactMappingRecord {
  wixInstanceId: string;
  wixContactId: string;
  hubspotContactId: string;
  email?: string | null;
  lastSyncedAt: Date;
  lastSyncDirection: 'wix_to_hubspot' | 'hubspot_to_wix';
  lastSyncSource: SyncSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessedEventRecord {
  eventId: string;
  source: 'wix' | 'hubspot';
  eventType?: string;
  processedAt: Date;
  expiresAt: Date;
}

export interface SyncErrorRecord {
  wixInstanceId: string;
  direction: 'wix_to_hubspot' | 'hubspot_to_wix';
  errorType: 'retryable' | 'non_retryable';
  errorMessage: string;
  errorStack?: string | null;
  sourceData: Record<string, any>;
  retryCount: number;
  maxRetries: number;
  resolvedAt?: Date | null;
  createdAt: Date;
  expiresAt: Date;
}
