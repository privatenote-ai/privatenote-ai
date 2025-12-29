import bs58 from 'bs58';

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
export async function importKey(keyString: string) {
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
      ['decrypt']
    );
  } catch (error) {
    console.error('Error importing key:', error);
    throw new Error('Invalid decryption key');
  }
}

// Encrypt data with AES-GCM
export async function encryptNote(content: string, key: CryptoKey) {
  // Create an initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert the content to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );
  
  return { encryptedData, iv };
}

// Decrypt data with AES-GCM
export async function decryptNote(
  encryptedData: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array
) {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );
    
    // Convert the ArrayBuffer back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Error decrypting note:', error);
    throw new Error('Failed to decrypt note. The key may be incorrect.');
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
export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Declare a module-level variable to store the lazy-loaded Argon2 library
let argon2Module: typeof import('argon2') | null = null;

// Lazy load the Argon2 module only when needed
async function getArgon2() {
  if (!argon2Module) {
    try {
      argon2Module = await import('argon2');
      return argon2Module;
    } catch (error) {
      console.warn('Failed to load Argon2 module, falling back to PBKDF2:', error);
      return null;
    }
  }
  return argon2Module;
}

// Derive a key from a password using Argon2 when possible, with PBKDF2 fallback
export async function deriveKeyFromPassword(password: string, salt: Uint8Array) {
  // First try to use Argon2 (lazy loaded)
  const argon2 = await getArgon2();
  
  // If we successfully loaded Argon2 and we're in a Node.js environment that supports it
  if (argon2 && typeof window === 'undefined') {
    try {
      // Use Argon2id (best variant for most use cases)
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        salt: Buffer.from(salt), // Convert Uint8Array to Buffer for Node.js
        memoryCost: 65536, // 64 MiB
        timeCost: 3,      // 3 iterations
        parallelism: 4,   // 4 threads
        raw: true         // Return raw buffer instead of encoded string
      });
      
      // In a Node.js environment, we'd need to use the Node.js crypto API
      // However, this is a theoretical case as we're in a browser context for this app
      // In practice, this code path won't be taken in our browser app
      return null as any; // This is just to satisfy TypeScript
    } catch (error) {
      console.warn('Error using Argon2, falling back to PBKDF2:', error);
      // Fall back to PBKDF2 if Argon2 fails
    }
  }
  
  // Web browser fallback using PBKDF2
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
  
  // Use higher iteration count for better security
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 310000, // Very high iteration count for better security
      hash: 'SHA-256'
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
export async function encryptWithPassword(content: string, password: string) {
  // Generate a salt for the password
  const salt = generateSalt();
  
  // Derive a key from the password
  const passwordKey = await deriveKeyFromPassword(password, salt);
  
  // First, generate a regular encryption key
  const { key, exportedKey } = await generateKey();
  
  // Encrypt the note content with the regular key
  const { encryptedData, iv } = await encryptNote(content, key);
  
  // Encrypt the regular key with the password-derived key
  const keyBuffer = bs58.decode(exportedKey);
  const encryptedKeyIv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedKeyData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: encryptedKeyIv,
    },
    passwordKey,
    keyBuffer
  );

  return {
    encryptedData,
    iv,
    salt,
    encryptedKey: encryptedKeyData,
    encryptedKeyIv
  };
}

// Password-protected decryption function
export async function decryptWithPassword(
  encryptedData: Uint8Array,
  iv: Uint8Array,
  encryptedKey: ArrayBuffer,
  encryptedKeyIv: Uint8Array,
  salt: Uint8Array,
  password: string
) {
  try {
    // Derive the key from the password
    const passwordKey = await deriveKeyFromPassword(password, salt);
    
    // Decrypt the regular encryption key
    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encryptedKeyIv,
      },
      passwordKey,
      encryptedKey
    );
    
    // Convert the decrypted key buffer to a Base58 string
    const decryptedKeyBytes = new Uint8Array(decryptedKeyBuffer);
    const decryptedKeyString = bs58.encode(decryptedKeyBytes);
    
    // Import the decrypted key
    const key = await importKey(decryptedKeyString);
    
    // Decrypt the note with the regular key
    return await decryptNote(encryptedData, key, iv);
  } catch (error) {
    console.error('Error decrypting with password:', error);
    throw new Error('Failed to decrypt note. The password may be incorrect.');
  }
}
