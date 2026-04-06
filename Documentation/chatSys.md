# End-to-End Encrypted (E2EE) Chat System : Frontend chat sys Documentation

## 1. Crypto Archi (`utils/cryptoUtils.js`)

i used native **Web Crypto API** 

### Key Generation during Registration
1. **RSA Pair:** RSA key pair is generated locally.
2. **Master Key:** A "Master Key" (AES) is derived from the user's password using **PBKDF2** with a random salt value and 100,000 iter.
3. **Vaulting:** The **RSA Private Key** is encrypted with the Master Key.
4. **Export:** The Public Key and the Encrypted Private Key (Vault) are sent to the server.
(bakend store keys in mongodb, more explained in backend chatSys md)

### Unlocking the Vault
During Login or after a page refresh on the Chat page:
- The user provide the password.
- The Master Key is re-derived using user's passsword.
- The Encrypted Private Key is decrypted and imported into the browser's memory.
- The private key is stored in `window.my_secure_chat_key`, i will think better way later.

---

## 2. Real-time Communication Archi (`hooks/useSocket.jsx`)

The `useSocket` hook is the `BRAIN` of chat system.

### FLOW:
- **Connection:** Initializes a `socket.io` connection with `withCredentials: true`.
- **History Loading (`loadHistory`):** 
  - Fetches encrypted messages from Backend.
  - Iterates through each message and decrypt it locally.
  - Updates the `messagesByUserId` state.
- **Incoming Messages (`receiveMessage`):**
  - Listens for new messages.
  - Decrypts them on the fly.
  - Handles multi-tab syncing (detects if the message was sent from another tab).
- **Message Sending (`sendMessage`):**
  - Encrypts the content using a random AES Session Key.
  - Encrypts the AES Key for both the sender and receiver.
  - Emits the payload and updates the UI instantly upon server acknowledgment.

---

## 3. UI Components (`components/chat/`)

### ChatSidebar
- Lists all users fetched from the Backend.
- Shows **online status** indicator based on the `onlineUsers` state from the socket.
- Handles user selection, triggering `loadHistory`.

### ChatWindow
- Displays the messages for the active user.
- Distinguish between `isMe` (sent) and incoming messages.
- Displays decrypted plain text.

### Vault Unlock Modal/Overlay (`pages/ChatPage.jsx`)
Because the private key exists only in the browser's RAM, refreshing the page "relocks" the chat. The `ChatPage` detects this and displays a "Vault Unlock" prompt, ensuring the system remains "Zero-Knowledge" ( server never know your password).

---

## 4. Message Decryption Logic

When a message arrives or loaded from history:
1. Determine if we are the sender or receiver.
2. Pick the corresponding encrypted AES Session Key:
   - If **Receiver**: Use `receiverEncryptedKey`.
   - If **Sender**: Use `senderEncryptedKey`.
3. Decrypt the AES Session Key using our **RSA Private Key**.
4. Use the decrypted AES Session Key + IV to decrypt the `encryptedContent`.

---
