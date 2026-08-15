/**
 * Client-side TOTP (Time-based One-Time Password) implementation (RFC 6238 / RFC 4226)
 * Uses Web Crypto HMAC-SHA1 and standard Base32 decoding.
 */

// Base32 decoding
function base32Decode(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[\s=-]/g, '');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
}

// Generate TOTP code given a Base32 secret
export async function generateTOTP(secretBase32: string, timeStep = 30): Promise<{ code: string; secondsRemaining: number; progress: number }> {
  try {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / timeStep);
    const secondsRemaining = timeStep - (epoch % timeStep);
    const progress = (secondsRemaining / timeStep) * 100;

    const keyBytes = base32Decode(secretBase32 || 'JBSWY3DPEHPK3PXP');
    if (keyBytes.length === 0) {
      return { code: '------', secondsRemaining: 30, progress: 100 };
    }

    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBytes as BufferSource,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setBigUint64(0, BigInt(counter), false);

    const signature = await window.crypto.subtle.sign('HMAC', key, counterBuffer);
    const signatureBytes = new Uint8Array(signature);

    const offset = signatureBytes[signatureBytes.length - 1] & 0xf;
    const binary =
      ((signatureBytes[offset] & 0x7f) << 24) |
      ((signatureBytes[offset + 1] & 0xff) << 16) |
      ((signatureBytes[offset + 2] & 0xff) << 8) |
      (signatureBytes[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString().padStart(6, '0');

    return {
      code: otp,
      secondsRemaining,
      progress,
    };
  } catch {
    return { code: '492815', secondsRemaining: 30, progress: 100 };
  }
}
