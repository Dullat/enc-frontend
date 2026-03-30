const bufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
};

const base64ToBuffer = (base64) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const generateAndVaultKeys = async (password) => {
  const encoder = new TextEncoder();
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const pubKeyBuffer = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey,
  );
  const privKeyBuffer = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );

  const passwordKeyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKeyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedPrivKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    aesKey,
    privKeyBuffer,
  );

  return {
    publicKey: bufferToBase64(pubKeyBuffer),
    encryptedPrivateKey: bufferToBase64(encryptedPrivKeyBuffer),
    keySalt: bufferToBase64(salt),
    keyIv: bufferToBase64(iv),
  };
};

export const unlockPrivateKey = async (password, vault) => {
  const { encryptedPrivateKey, keyIv, keySalt } = vault;
  const encoder = new TextEncoder();

  const passwordKeyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToBuffer(keySalt),
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKeyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const decryptedPrivKeyBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuffer(keyIv) },
    aesKey,
    base64ToBuffer(encryptedPrivateKey),
  );

  return await window.crypto.subtle.importKey(
    "pkcs8",
    decryptedPrivKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"],
  );
};

export const encryptMessage = async (
  content,
  receiverPubKeyB64,
  senderPubKeyB64,
) => {
  const encoder = new TextEncoder();

  // 1. Generate random AES Session Key
  const aesSessionKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // 2. Encrypt content with AES
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedContentBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    aesSessionKey,
    encoder.encode(content),
  );

  // 3. Export AES key to wrap it
  const exportedAesKey = await window.crypto.subtle.exportKey(
    "raw",
    aesSessionKey,
  );

  // 4. Import Public Keys
  const receiverPubKey = await window.crypto.subtle.importKey(
    "spki",
    base64ToBuffer(receiverPubKeyB64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  const senderPubKey = await window.crypto.subtle.importKey(
    "spki",
    base64ToBuffer(senderPubKeyB64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  // 5. Encrypt AES key for both chatters
  const receiverEncryptedKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    receiverPubKey,
    exportedAesKey,
  );

  const senderEncryptedKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    senderPubKey,
    exportedAesKey,
  );

  return {
    encryptedContent: bufferToBase64(encryptedContentBuffer),
    iv: bufferToBase64(iv),
    receiverEncryptedKey: bufferToBase64(receiverEncryptedKey),
    senderEncryptedKey: bufferToBase64(senderEncryptedKey),
  };
};

export const decryptMessage = async (
  encryptedContentB64,
  ivB64,
  encryptedAesKeyB64,
  myUnlockedPrivateKey,
) => {
  try {
    const rawAesKeyBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      myUnlockedPrivateKey,
      base64ToBuffer(encryptedAesKeyB64),
    );

    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      rawAesKeyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );

    const decryptedContentBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBuffer(ivB64) },
      aesKey,
      base64ToBuffer(encryptedContentB64),
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedContentBuffer);
  } catch (error) {
    console.error("Decryption failed.", error);
    return "[ ENCRYPTED MESSAGE UNREADABLE ]";
  }
};
