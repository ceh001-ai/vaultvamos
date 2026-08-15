import { VaultItem, BreachAlert, SyncDevice } from '../types/vault';

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-item-github',
    type: 'login',
    title: 'GitHub',
    platformIcon: 'github',
    identifier: 'developer@example.com',
    secret: 'ghp_V4ult$ecureToken983194aZ!xX',
    url: 'https://github.com',
    category: 'Development',
    notes: 'Primary developer repository and CI/CD access.',
    tags: ['development', 'git'],
    lastAccessed: 'Just now',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorite: true,
    healthStatus: 'strong',
    totpSecret: 'JBSWY3DPEHPK3PXP',
    customFields: []
  }
];

export const INITIAL_BREACH_ALERTS: BreachAlert[] = [
  {
    id: 'breach-1',
    service: 'Canva Global User Exfiltration',
    domain: 'canva.com',
    date: 'May 24, 2024',
    leakSource: 'GLOBAL_BREACH_INDEX',
    severity: 'high',
    exposedFields: ['Username', 'Bcrypt Hash', 'Country'],
    affectedItemIds: [],
    status: 'active',
    description: '139 million records indexed in security audit databases containing historical user hashes.',
    suggestedAction: 'Ensure unique high-entropy passwords and 2-factor authentication are active.'
  }
];

export const INITIAL_DEVICES: SyncDevice[] = [
  {
    id: 'dev-1',
    name: 'Workstation (Current)',
    platform: 'macos',
    lastSync: 'Real-time (Active)',
    ipAddress: '192.168.1.102 (Encrypted Local Mesh)',
    fingerprint: 'SHA256:m3_98a7b3c4d1e2f3a4',
    isCurrent: true,
    trusted: true
  },
  {
    id: 'dev-2',
    name: 'Mobile Phone',
    platform: 'ios',
    lastSync: '5 mins ago',
    ipAddress: '172.56.21.90 (Cellular VPN)',
    fingerprint: 'SHA256:ios_77e1f4a9b2c3d5e6',
    isCurrent: false,
    trusted: true
  }
];
