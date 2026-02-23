export interface WixContact {
  id: string;
  revision: number;
  source: {
    sourceType: string;
    appId?: string;
  };
  createdDate: string;
  updatedDate: string;
  lastActivity: {
    activityDate: string;
    activityType: string;
  };
  primaryInfo: {
    email?: string;
    phone?: string;
  };
  info: {
    name?: {
      first?: string;
      last?: string;
    };
    emails?: { tag: string; email: string }[];
    phones?: { tag: string; phone: string }[];
    addresses?: {
      tag: string;
      street?: string;
      city?: string;
      subdivision?: string;
      country?: string;
      postalCode?: string;
    }[];
    company?: string;
    jobTitle?: string;
    birthdate?: string;
    locale?: string;
    labelKeys?: string[];
    extendedFields?: Record<string, any>;
  };
}

export interface WixWebhookPayload {
  data: string; // JWT-encoded
  instanceId: string;
  eventType: string;
}

export interface WixContactWebhookData {
  entityId: string;
  actionEvent?: {
    bodyAsJson: string;
  };
  currentEntityAsJson?: string;
  slug?: string;
}

export interface WixFormSubmission {
  formId: string;
  submissionId: string;
  submissions: Record<string, string>;
  pageUrl?: string;
  createdDate: string;
  updatedDate?: string;
  submitter?: {
    memberId?: string;
    contactId?: string;
  };
}

export interface WixTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface WixContactField {
  key: string;
  label: string;
  type: string;
}
