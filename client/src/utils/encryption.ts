import bs58 from 'bs58';

// Constants for key derivation
export const PBKDF2_ITERATIONS = 310000;
export const PBKDF2_HASH = 'SHA-256';
export const KDF_VERSION = 1; // Version for parameter validation
const PBKDF2_ITERATIONS_V2 = 600000;

function getKdfDefaults(version?: number) {
  if (version !== undefined && version >= 2) {
    return { iterations: PBKDF2_ITERATIONS_V2, hash: PBKDF2_HASH };
  }
  return { iterations: PBKDF2_ITERATIONS, hash: PBKDF2_HASH };
}

// Generate a random 256-bit encryption key
export async function generateKey() {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  // Export the key as raw bytes
  const exportedKeyBuffer = await window.crypto.subtle.exportKey('raw', key);
  
  // Convert to Base58 for URL-friendly representation
  const keyBytes = new Uint8Array(exportedKeyBuffer);
  const exportedKey = bs58.encode(keyBytes);
  
  return { key, exportedKey };
}

// Import a key from Base58 string
// Fixed: Now allows both encrypt and decrypt operations for consistency
export async function importKey(keyString: string, usage: KeyUsage[] = ['encrypt', 'decrypt']) {
  try {
    const keyBytes = bs58.decode(keyString);
    
    return await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      usage
    );
  } catch (error) {
    console.error('Error importing key:', error);
    throw new Error('Invalid decryption key');
  }
}

// Constant-time comparison helper to prevent timing attacks
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

// Encrypt data with AES-GCM
// Fixed: Added AAD (Additional Authenticated Data) and explicit 128-bit tag length
export async function encryptNote(
  content: string, 
  key: CryptoKey,
  additionalData?: { expirySeconds?: number; maxReads?: number; noteId?: string }
) {
  // Create an initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert the content to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  // Generate AAD to bind context to ciphertext
  // This prevents context confusion attacks (swapping ciphertexts between notes)
  let aad: Uint8Array | undefined;
  if (additionalData) {
    const aadParts: string[] = [];
    if (additionalData.noteId) aadParts.push(`id:${additionalData.noteId}`);
    if (additionalData.expirySeconds !== undefined) aadParts.push(`exp:${additionalData.expirySeconds}`);
    if (additionalData.maxReads !== undefined) aadParts.push(`reads:${additionalData.maxReads}`);
    if (aadParts.length > 0) {
      aad = encoder.encode(aadParts.join('|'));
    }
  }
  
  // Encrypt the data with explicit 128-bit authentication tag
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      additionalData: aad,
      tagLength: 128, // Explicit 128-bit authentication tag for maximum security
    },
    key,
    data
  );
  
  // Convert AAD to base64 for storage (slice buffer to ensure correct length)
  const aadBase64 = aad ? arrayBufferToBase64(aad.buffer.slice(aad.byteOffset, aad.byteOffset + aad.byteLength)) : undefined;
  
  return { encryptedData, iv, aad: aadBase64 };
}

// Decrypt data with AES-GCM
// Fixed: Added AAD support and explicit 128-bit tag length
export async function decryptNote(
  encryptedData: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array,
  additionalData?: Uint8Array
) {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        additionalData: additionalData,
        tagLength: 128, // Explicit 128-bit authentication tag
      },
      key,
      encryptedData
    );
    
    // Convert the ArrayBuffer back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting note:', error);
    // Fixed: Use consistent error message to prevent timing leaks
    throw new Error('Failed to decrypt note. The key may be incorrect or the data may have been tampered with.');
  }
}

// Helper function to convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert Base64 to ArrayBuffer
function normalizeBase64(input: string) {
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }
  return normalized;
}

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(normalizeBase64(base64));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive a key from a password using PBKDF2
// Fixed: Removed dead Argon2 code that never executed in browser environment
// PBKDF2 is the standard for browser-based key derivation and provides adequate security
export async function deriveKeyFromPassword(
  password: string, 
  salt: Uint8Array,
  iterations: number = PBKDF2_ITERATIONS,
  hash: string = PBKDF2_HASH
) {
  // Fixed: Validate KDF parameters to prevent downgrade attacks
  if (iterations < 100000) {
    throw new Error('Invalid KDF parameters: iteration count too low');
  }
  if (hash !== 'SHA-256' && hash !== 'SHA-384' && hash !== 'SHA-512') {
    throw new Error('Invalid KDF parameters: unsupported hash algorithm');
  }
  
  // Convert password to buffer
  const passwordBuffer = new TextEncoder().encode(password);
  
  // Import the password as a key
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive key using PBKDF2 with validated parameters
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: hash as AlgorithmIdentifier
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Generate a random salt for password derivation
export function generateSalt() {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

// Password-protected encryption function
// Fixed: Added AAD and explicit tag length to key encryption
export async function encryptWithPassword(
  content: string, 
  password: string,
  additionalData?: { expirySeconds?: number; maxReads?: number; noteId?: string }
) {
  // Generate a salt for the password
  const salt = generateSalt();
  
  // Derive a key from the password with validated parameters
  const passwordKey = await deriveKeyFromPassword(password, salt);
  
  // First, generate a regular encryption key
  const { key, exportedKey } = await generateKey();
  
  // Encrypt the note content with the regular key (includes AAD)
  const { encryptedData, iv, aad } = await encryptNote(content, key, additionalData);
  
  // Encrypt the regular key with the password-derived key
  // Fixed: Added AAD and explicit tag length for key encryption
  const keyBuffer = bs58.decode(exportedKey);
  const encryptedKeyIv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Use AAD for key encryption to bind it to the note context
  // Convert base64 AAD back to Uint8Array for key encryption
  let keyAad: Uint8Array | undefined;
  if (aad) {
    const aadBuffer = base64ToArrayBuffer(aad);
    keyAad = new Uint8Array(aadBuffer);
  }
  
  const encryptedKeyData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: encryptedKeyIv,
      additionalData: keyAad,
      tagLength: 128, // Explicit 128-bit authentication tag
    },
    passwordKey,
    keyBuffer
  );

  return {
    encryptedData,
    iv,
    salt,
    encryptedKey: encryptedKeyData,
    encryptedKeyIv,
    aad, // Return AAD for storage (base64 string)
    kdfVersion: KDF_VERSION, // Include KDF version for parameter validation
    kdfIterations: PBKDF2_ITERATIONS,
    kdfHash: PBKDF2_HASH
  };
}

// Password-protected decryption function
// Fixed: Added AAD support, parameter validation, and explicit tag length
export async function decryptWithPassword(
  encryptedData: Uint8Array,
  iv: Uint8Array,
  encryptedKey: ArrayBuffer,
  encryptedKeyIv: Uint8Array,
  salt: Uint8Array,
  password: string,
  aad?: Uint8Array,
  kdfVersion?: number,
  kdfIterations?: number,
  kdfHash?: string
) {
  try {
    // Fixed: Validate KDF parameters to prevent downgrade attacks
    const defaults = getKdfDefaults(kdfVersion);
    const iterations = kdfIterations ?? defaults.iterations;
    const hash = kdfHash ?? defaults.hash;
    
    if (kdfVersion !== undefined && kdfVersion !== KDF_VERSION) {
      throw new Error('Invalid KDF version. The note may have been encrypted with a different version.');
    }
    
    // Derive the key from the password with validated parameters
    const passwordKey = await deriveKeyFromPassword(password, salt, iterations, hash);
    
    // Decrypt the regular encryption key with AAD
    const keyAad = aad ? new Uint8Array(aad) : undefined;
    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encryptedKeyIv,
        additionalData: keyAad,
        tagLength: 128, // Explicit 128-bit authentication tag
      },
      passwordKey,
      encryptedKey
    );
    
    // Convert the decrypted key buffer to a Base58 string
    const decryptedKeyBytes = new Uint8Array(decryptedKeyBuffer);
    const decryptedKeyString = bs58.encode(decryptedKeyBytes);
    
    // Import the decrypted key (now supports both encrypt and decrypt)
    const key = await importKey(decryptedKeyString);
    
    // Decrypt the note with the regular key and AAD
    return await decryptNote(encryptedData, key, iv, aad);
  } catch (error) {
    console.error('Error decrypting with password:', error);
    // Fixed: Use consistent error message to prevent timing leaks
    throw new Error('Failed to decrypt note. The password may be incorrect or the data may have been tampered with.');
  }
}
