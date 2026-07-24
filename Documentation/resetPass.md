# Technical Documentation: E2EE Destructive Password Reset Strategy

This document outlines the architectural and implementation strategy for handling password resets in an end-to-end encrypted (E2EE) environment where the user's private key is "vaulted" (encrypted) using a key derived from their plaintext password.

---

## 1. The E2EE Challenge

In a standard (non-E2EE) application, the server holds the plaintext or weakly hashed data and can simply change the user's password in the database. 

In **our system**:
1.  **Messages** are encrypted using a random **AES Session Key**.
2.  The **AES Session Key** is encrypted using the recipient's **RSA Public Key**.
3.  The **RSA Private Key** is stored on the server, but it is **encrypted (AES-GCM)** using a key derived from the user's **Plaintext Password** (via PBKDF2).

**The Problem:** When a user forgets their password and requests a reset, the server **cannot** decrypt their old private key. Without that private key, any messages previously encrypted for that user become mathematically unreadable (garbage data).

---

## 2. Our Chosen Strategy: Destructive Key Rotation

To maintain the integrity of the E2EE promise while allowing users to regain access to their accounts, we implement a **Destructive Key Rotation**.

### **Core Principles:**
*   **Zero Trust:** The server never learns the new password or the new private key.
*   **Security over Persistence:** It is better to lose data than to compromise the encryption model.
*   **User Transparency:** The user must be explicitly warned that resetting their password wipes their history.

---

## 3. The End-to-End Workflow

### **Phase 1: Frontend - Key Generation on Reset**
When the user clicks the reset link and arrives at the `reset-password` page (EJS/HTML), the browser must perform the heavy lifting **before** the form is submitted.

1.  **Intercept** the form's `submit` event.
2.  **Generate** a fresh RSA-OAEP 2048-bit key pair using `window.crypto.subtle`.
3.  **Derive** an AES-256 key from the **New Password** using PBKDF2 + Salt.
4.  **Encrypt** the new **Private Key** with this AES key.
5.  **Inject** the new `publicKey`, `encryptedPrivateKey`, `keySalt`, and `keyIv` into hidden fields.
6.  **Submit** the form to the backend.

#### **Frontend Logic Snippet (Conceptual):**
```javascript
form.onsubmit = async (e) => {
    e.preventDefault();
    const newPass = document.getElementById('password').value;
    
    // 1. Generate new keys locally
    const keys = await generateAndVaultKeys(newPass); 
    
    // 2. Add to form data
    const hiddenFields = `
        <input type="hidden" name="publicKey" value="${keys.publicKey}">
        <input type="hidden" name="encryptedPrivateKey" value="${keys.encryptedPrivateKey}">
        <input type="hidden" name="keySalt" value="${keys.keySalt}">
        <input type="hidden" name="keyIv" value="${keys.keyIv}">
    `;
    form.insertAdjacentHTML('beforeend', hiddenFields);
    
    // 3. Submit
    form.submit();
};
```

### **Phase 2: Backend - The "Wipe and Update" Controller**
The backend receives the new password (to update the standard login hash) and the new E2EE key bundle.

1.  **Update User Record:** Save the new `password` (hashed with bcrypt), and overwrite the old `publicKey`, `encryptedPrivateKey`, `keySalt`, and `keyIv`.
2.  **Purge Messages:** Delete all messages where this user was a participant. 
    *   *Rationale:* Since the user can no longer decrypt old messages, keeping them in the DB consumes storage without providing value.
3.  **Invalidate Sessions:** Delete all refresh tokens to force re-login across all devices.

#### **Backend Logic Snippet (`user.controller.js`):**
```javascript
const resetPassword = async (req, res) => {
    const { password, publicKey, encryptedPrivateKey, keySalt, keyIv } = req.body;
    const userId = user._id;

    // 1. Update E2EE Keys and Password
    user.password = password;
    user.publicKey = publicKey;
    user.encryptedPrivateKey = encryptedPrivateKey;
    user.keySalt = keySalt;
    user.keyIv = keyIv;
    await user.save();

    // 2. Delete All Chats/Messages for this user
    await Message.deleteMany({
        $or: [{ sender: userId }, { recipient: userId }]
    });

    // 3. Cleanup Sessions
    await RefreshToken.deleteMany({ userId });

    res.render("reset-success");
};
```

---

## 4. Why Real-World Apps Do This

### **Signal / WhatsApp**
When you switch phones without a backup, your "Security Code" changes. This is essentially a key rotation. If you don't have your old key, Signal cannot restore your messages from their servers because they **never had your key**.

### **ProtonMail**
If you reset your ProtonMail password, your old emails remain in your inbox but appear as encrypted blocks of text. You can only read them if you later remember your **old** password (to "reactivate" the old key).

---

## 5. Security Recommendations

1.  **High Iterations:** Ensure PBKDF2 on the `reset-password` page uses at least 100,000 iterations of SHA-256 to prevent brute-forcing the vault key.
2.  **Unique Salt:** Always generate a new `keySalt` for the new password. Never reuse the salt from the previous (lost) password.
3.  **Visual Warning:** Use high-contrast UI (red/orange colors) on the reset page to ensure the user knows data loss is imminent.

-To resume this session: gemini --resume a1df89cf-e84a-4c6e-92e1-607c84fb4eec   --
