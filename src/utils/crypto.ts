export const IV_LENGTH = 12; // bytes
export const SALT_LENGTH = 16; // bytes
export const DATA_START_INDEX = SALT_LENGTH + IV_LENGTH; // bytes

// utils/crypto.ts
export async function getKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(
  plaintext: string,
  password: string
): Promise<string> {
  const enc = new TextEncoder();
  const iv = generateRandomBytes(IV_LENGTH);
  const salt = generateRandomBytes(SALT_LENGTH);
  const key = await getKeyFromPassword(password, salt);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );

  const buffer = new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...buffer)); // base64 encode for storage
}

export async function decryptData(
  ciphertext: string,
  password: string
): Promise<string> {
  const buffer = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, DATA_START_INDEX);
  const data = buffer.slice(DATA_START_INDEX);
  const key = await getKeyFromPassword(password, salt);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return new TextDecoder().decode(decrypted);
}

export async function encryptDataWithKey(
  plaintext: string,
  sessionKey: CryptoKey,
  salt: Uint8Array<ArrayBufferLike>
): Promise<string> {
  const enc = new TextEncoder();
  const iv = generateRandomBytes(IV_LENGTH);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sessionKey,
    enc.encode(plaintext)
  );

  const buffer = new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...buffer)); // base64 encode for storage
}

export async function decryptDataWithKey(
  cipherText: string,
  sessionKey: CryptoKey
): Promise<string> {
  const buffer = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
  const iv = buffer.slice(SALT_LENGTH, DATA_START_INDEX);
  const data = buffer.slice(DATA_START_INDEX);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    sessionKey,
    data
  );
  return new TextDecoder().decode(decrypted);
}

export function generateRandomBytes(length: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export async function sha256Hash(data: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await window.crypto.subtle.digest("SHA-256", enc.encode(data));
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
