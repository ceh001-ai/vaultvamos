export type ItemType = 'login' | 'identity' | 'note' | 'card' | 'key' | 'passkey';

export type HealthStatus = 'strong' | 'weak' | 'reused' | 'breached' | 'stale' | 'missing_2fa';

export interface CustomField {
  id: string;
  label: string;
  value: string;
  isMasked?: boolean;
}

export interface IdentityDetails {
  fullName: string;
  passportNumber?: string;
  issuingCountry?: string;
  expiryDate?: string;
  ssn?: string;
  driverLicenseNumber?: string;
  stateOrRegion?: string;
  birthDate?: string;
  taxId?: string;
  nationalId?: string;
  emergencyContact?: string;
}

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  pin?: string;
}

export interface KeyDetails {
  keyType: 'ssh' | 'pgp' | 'api' | 'crypto_seed';
  publicKey?: string;
  privateKeyOrSecret: string;
  fingerprint?: string;
  algorithm?: string;
}

export interface VaultItem {
  id: string;
  type: ItemType;
  title: string;
  platformIcon?: string;
  identifier: string; // e.g. email / username / key name
  secret?: string; // encrypted or decrypted password
  url?: string;
  category: string;
  notes?: string;
  tags: string[];
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
  favorite?: boolean;
  healthStatus: HealthStatus;
  healthIssues?: string[];
  totpSecret?: string;
  identityDetails?: IdentityDetails;
  cardDetails?: CardDetails;
  keyDetails?: KeyDetails;
  customFields?: CustomField[];
  isBreached?: boolean;
  breachInfo?: {
    breachDate: string;
    source: string;
    leakAttributes: string[];
    riskScore: number;
  };
}

export interface BreachAlert {
  id: string;
  service: string;
  domain: string;
  date: string;
  leakSource: string;
  severity: 'critical' | 'high' | 'medium';
  exposedFields: string[];
  affectedItemIds: string[];
  status: 'active' | 'resolved';
  description: string;
  suggestedAction: string;
}

export interface SyncDevice {
  id: string;
  name: string;
  platform: 'macos' | 'ios' | 'linux' | 'windows' | 'android';
  lastSync: string;
  ipAddress: string;
  fingerprint: string;
  isCurrent: boolean;
  trusted: boolean;
}

export interface SecurityAuditReport {
  overallScore: number; // 0 - 100
  totalItems: number;
  strongCount: number;
  weakCount: number;
  reusedCount: number;
  breachedCount: number;
  staleCount: number;
  missing2faCount: number;
  lastAnalyzed: string;
  criticalRecommendations: {
    id: string;
    itemId?: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium';
    actionType: 'rotate_password' | 'enable_2fa' | 'generate_passkey' | 'update_identity';
  }[];
}
