/**
 * Encryption utilities for AI App Builder.
 * Uses Web Crypto API for AES-GCM encryption with PBKDF2 key derivation.
 */

export const CryptoService = {
  /**
   * Number of PBKDF2 iterations for key derivation.
   * @type {number}
   */
  PBKDF2_ITERATIONS: 100_000,

  /**
   * Derive an AES-GCM CryptoKey from a password and salt using PBKDF2.
   * @param {string} password - The user's password.
   * @param {Uint8Array} salt - 16-byte salt. If not provided, a random one is generated.
   * @returns {Promise<{key: CryptoKey, salt: Uint8Array}>}
   */
  async generateKey(password, salt) {
    if (!salt) {
      salt = crypto.getRandomValues(new Uint8Array(16));
    }

    // Import the password as raw key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive an AES-GCM key
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: CryptoService.PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return { key, salt };
  },

  /**
   * Encrypt a string using AES-GCM with a password.
   * Returns an object with base64-encoded iv, salt, and ciphertext.
   * @param {string} data - The plaintext string to encrypt.
   * @param {string} password - The password used to derive the encryption key.
   * @returns {Promise<{iv: string, salt: string, ciphertext: string}>}
   */
  async encrypt(data, password) {
    // Generate a random 12-byte IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key with a fresh random salt
    const { key, salt } = await CryptoService.generateKey(password);

    // Encrypt
    const encoded = new TextEncoder().encode(data);
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Convert to base64 for storage
    return {
      iv: CryptoService._arrayBufferToBase64(iv),
      salt: CryptoService._arrayBufferToBase64(salt),
      ciphertext: CryptoService._arrayBufferToBase64(new Uint8Array(cipherBuffer)),
    };
  },

  /**
   * Decrypt an AES-GCM encrypted payload with a password.
   * @param {{iv: string, salt: string, ciphertext: string}} encryptedData - The encrypted payload.
   * @param {string} password - The password used during encryption.
   * @returns {Promise<string>} The decrypted plaintext string.
   */
  async decrypt(encryptedData, password) {
    const iv = CryptoService._base64ToUint8Array(encryptedData.iv);
    const salt = CryptoService._base64ToUint8Array(encryptedData.salt);
    const ciphertext = CryptoService._base64ToUint8Array(encryptedData.ciphertext);

    // Derive the same key using the stored salt
    const { key } = await CryptoService.generateKey(password, salt);

    // Decrypt
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  },

  /**
   * Generate a UUID v4 identifier.
   * Uses crypto.getRandomValues for cryptographic randomness.
   * @returns {string} A UUID v4 string, e.g. "550e8400-e29b-41d4-a716-446655440000"
   */
  generateId() {
    // RFC 4122 version 4 UUID
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    // Set version (4) in byte 6: 0100xxxx
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant (10) in byte 8: 10xxxxxx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  },

  /**
   * Compute a SHA-256 hash of a string.
   * Returns a hex-encoded hash string.
   * @param {string} str - The input string.
   * @returns {Promise<string>} Hex-encoded SHA-256 hash.
   */
  async hashString(str) {
    const encoded = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  },

  // ── Internal helpers ──────────────────────────────────────────

  /**
   * Convert a Uint8Array or ArrayBuffer to a base64 string.
   * @param {Uint8Array|ArrayBuffer} buffer
   * @returns {string}
   */
  _arrayBufferToBase64(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  /**
   * Convert a base64 string to a Uint8Array.
   * @param {string} base64
   * @returns {Uint8Array}
   */
  _base64ToUint8Array(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  },
};
