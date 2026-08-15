/**
 * Web Crypto API implementation for VAULT_OS
 * Implements AES-256-GCM authenticated encryption and PBKDF2 key derivation.
 */

// Generate random IV for AES-GCM (12 bytes recommended for GCM)
export function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(12));
}

// Generate cryptographic salt (16 bytes)
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

// Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Derive AES-256 key from Master Password using PBKDF2 (100,000 iterations)
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt payload with AES-256-GCM
export async function encryptPayload(data: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = generateIV();
  const enc = new TextEncoder();
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    enc.encode(data)
  );

  return {
    ciphertext: bufferToHex(encrypted),
    iv: bufferToHex(iv),
  };
}

// Decrypt payload with AES-256-GCM
export async function decryptPayload(ciphertextHex: string, ivHex: string, key: CryptoKey): Promise<string> {
  const iv = hexToBuffer(ivHex);
  const ciphertext = hexToBuffer(ciphertextHex);
  const dec = new TextDecoder();

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    ciphertext
  );

  return dec.decode(decrypted);
}

// Calculate SHA-256 hash
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  return bufferToHex(hashBuffer);
}

// Password Strength & Entropy Analysis
export interface PasswordAnalysis {
  score: number; // 0 - 100
  entropyBits: number;
  strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
  crackTimeEstimate: string;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isLengthSufficient: boolean;
  isCommon: boolean;
  issues: string[];
  suggestions: string[];
}

const COMMON_PATTERNS = [
  'password', '123456', '12345678', 'qwerty', 'admin', 'welcome', 'letmein',
  'iloveyou', 'techcorp', 'adobe123', 'google123', 'monkey', 'dragon'
];

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      entropyBits: 0,
      strength: 'very_weak',
      crackTimeEstimate: 'Instant',
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
      isLengthSufficient: false,
      isCommon: false,
      issues: ['Password cannot be empty'],
      suggestions: ['Generate a high-entropy 16+ character password']
    };
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isCommon = COMMON_PATTERNS.some(p => password.toLowerCase().includes(p));

  // Pool size calculation for Shannon Entropy
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33;

  const entropyBits = Math.round(length * (poolSize > 0 ? Math.log2(poolSize) : 1));

  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (length < 8) {
    issues.push('Critically short (< 8 characters)');
    suggestions.push('Increase length to at least 14+ characters');
  } else if (length < 12) {
    issues.push('Short length (< 12 characters)');
    suggestions.push('Consider 16 characters for critical accounts');
  } else if (length >= 16) {
    score += 40;
  } else {
    score += 25;
  }

  if (hasLower && hasUpper) score += 20;
  else {
    issues.push('Missing mix of uppercase & lowercase');
    suggestions.push('Include both UPPER and lower case characters');
  }

  if (hasNumber) score += 20;
  else {
    issues.push('Missing numbers');
    suggestions.push('Add numeric digits (0-9)');
  }

  if (hasSpecial) score += 20;
  else {
    issues.push('Missing special symbols');
    suggestions.push('Add special characters (!@#$%^&*)');
  }

  if (isCommon) {
    score = Math.max(5, score - 50);
    issues.push('Contains easily guessable dictionary words/patterns');
    suggestions.push('Avoid common words or names');
  }

  // Cap score
  score = Math.min(100, Math.max(0, score));

  let strength: PasswordAnalysis['strength'] = 'very_weak';
  let crackTimeEstimate = 'Instant';

  if (score >= 85 && entropyBits >= 75) {
    strength = 'very_strong';
    crackTimeEstimate = 'Centuries (10^12+ years)';
  } else if (score >= 70 && entropyBits >= 55) {
    strength = 'strong';
    crackTimeEstimate = 'Decades (300+ years)';
  } else if (score >= 45 && entropyBits >= 35) {
    strength = 'moderate';
    crackTimeEstimate = '3 to 6 months';
  } else if (score >= 25) {
    strength = 'weak';
    crackTimeEstimate = 'Few hours to days';
  } else {
    strength = 'very_weak';
    crackTimeEstimate = 'Instant / Seconds';
  }

  return {
    score,
    entropyBits,
    strength,
    crackTimeEstimate,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    isLengthSufficient: length >= 12,
    isCommon,
    issues,
    suggestions
  };
}

// Password Generator Options
export interface GeneratorOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSpecial: boolean;
  avoidAmbiguous: boolean; // avoid 0, O, l, 1, I
  mode: 'random' | 'passphrase' | 'pin';
  wordCount?: number;
}

const DICEWARE_WORDS = [
  'cipher', 'quantum', 'vector', 'matrix', 'orbital', 'nebula', 'protocol',
  'cascade', 'horizon', 'prism', 'sentinel', 'vertex', 'kinetic', 'radiant',
  'starlight', 'glacier', 'beacon', 'aurora', 'obsidian', 'vortex', 'chronos',
  'zenith', 'pulse', 'strata', 'echo', 'flux', 'nexus', 'solaris', 'titan'
];

export function generatePassword(options: GeneratorOptions): string {
  if (options.mode === 'pin') {
    let pin = '';
    const digits = '0123456789';
    for (let i = 0; i < options.length; i++) {
      const idx = window.crypto.getRandomValues(new Uint32Array(1))[0] % digits.length;
      pin += digits[idx];
    }
    return pin;
  }

  if (options.mode === 'passphrase') {
    const count = options.wordCount || 4;
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = window.crypto.getRandomValues(new Uint32Array(1))[0] % DICEWARE_WORDS.length;
      let w = DICEWARE_WORDS[idx];
      if (options.useUpper && i % 2 === 0) {
        w = w.charAt(0).toUpperCase() + w.slice(1);
      }
      words.push(w);
    }
    const separator = options.useSpecial ? '-' : '.';
    let phrase = words.join(separator);
    if (options.useNumbers) {
      const num = window.crypto.getRandomValues(new Uint32Array(1))[0] % 900 + 100;
      phrase += separator + num;
    }
    return phrase;
  }

  let charset = '';
  let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numberChars = '0123456789';
  let specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.avoidAmbiguous) {
    lowerChars = lowerChars.replace(/[l1io]/g, '');
    upperChars = upperChars.replace(/[IO0]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
  }

  if (options.useLower) charset += lowerChars;
  if (options.useUpper) charset += upperChars;
  if (options.useNumbers) charset += numberChars;
  if (options.useSpecial) charset += specialChars;

  if (!charset) charset = lowerChars + upperChars + numberChars;

  let result = '';
  // Ensure at least one character from each selected category
  const guaranteed: string[] = [];
  if (options.useLower) guaranteed.push(lowerChars[window.crypto.getRandomValues(new Uint32Array(1))[0] % lowerChars.length]);
  if (options.useUpper) guaranteed.push(upperChars[window.crypto.getRandomValues(new Uint32Array(1))[0] % upperChars.length]);
  if (options.useNumbers) guaranteed.push(numberChars[window.crypto.getRandomValues(new Uint32Array(1))[0] % numberChars.length]);
  if (options.useSpecial) guaranteed.push(specialChars[window.crypto.getRandomValues(new Uint32Array(1))[0] % specialChars.length]);

  for (let i = 0; i < options.length - guaranteed.length; i++) {
    const randIdx = window.crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
    result += charset[randIdx];
  }

  // Merge and shuffle
  const combined = (result + guaranteed.join('')).split('');
  for (let i = combined.length - 1; i > 0; i--) {
    const j = window.crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}
