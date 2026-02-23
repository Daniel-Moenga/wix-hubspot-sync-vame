export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, false);
    this.name = 'AuthError';
  }
}

export class WebhookVerificationError extends AppError {
  constructor(message: string = 'Webhook verification failed') {
    super(message, 401, false);
    this.name = 'WebhookVerificationError';
  }
}

export class SyncError extends AppError {
  constructor(
    message: string,
    public direction: 'wix_to_hubspot' | 'hubspot_to_wix',
    isRetryable: boolean = true,
  ) {
    super(message, 500, isRetryable);
    this.name = 'SyncError';
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number,
  ) {
    super(message, 429, true);
    this.name = 'RateLimitError';
  }
}
