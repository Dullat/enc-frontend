# ENC - Frontend (The Dedsec Project)

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**ENC** is a high-security, hacker-themed web interface and communication suite. This project is a secure hub for encrypted real-time communication, zero-knowledge data protection, local file encryption, and high-performance in-browser compression.

---

## 🔒 Security & E2EE Cryptography Model

ENC follows a **Zero-Knowledge Architecture**. Plaintext messages, files, and encryption keys are never sent to or stored on the server. All cryptographic processing occurs entirely inside the client’s browser using the **Web Crypto API**.

### 1. Hybrid Encryption Sequence (The "WhatsApp" Protocol)
*   **Key Generation:** Upon registration, the client generates a 2048-bit **RSA-OAEP** key pair.
*   **Key Derivation:** The Private Key is encrypted client-side using a key derived from the user's password using **PBKDF2** (100,000 iterations and SHA-256 hashing) combined with a random 16-byte salt. The encrypted private key, key salt, key IV, and the plaintext public key are sent to the backend.
*   **Message Transmission:**
    1.  Alice generates a cryptographically random, single-use **AES-GCM (256-bit)** session key.
    2.  Alice encrypts the message content using the AES session key and a random 12-byte IV.
    3.  The AES session key is encrypted twice:
        *   Once with **Alice's Public Key** (so Alice can read her message history).
        *   Once with **Bob's Public Key** (so Bob can decrypt the message).
    4.  Alice transmits the encrypted payload, IV, and both RSA-encrypted versions of the AES key to the server.
*   **Message Decryption:** Bob fetches the payload, decrypts the AES key using his local private key, and then decrypts the ciphertext.

### 2. File Encryption & Decryption
*   Files are processed locally via browser memory using AES-256-GCM.
*   The salt, IV, and encrypted stream are concatenated client-side, allowing secure local decryption of files.

---

## 🛠️ Tech Stack & Architecture Approach

### Core UI & Frameworks
*   **React 19 & Vite:** Leverages React 19's fast rendering and Vite 7's instant HMR development server.
*   **Tailwind CSS v4:** Cyberpunk/Dedsec styling implementation featuring custom configurations, responsive grids, and real-time accent color synchronization.
*   **React Router v7:** Client-side routing with route guards (`useRequireAuth`) to protect authenticated pages.

### State & Data Management
*   **Redux Toolkit:** Manages global state including active user sessions, socket status, and UI theme profiles.
*   **RTK Query:** Handles data fetching, caching, and polling. Includes a custom base query interceptor to catch HTTP 401 errors and automatically issue token refresh requests (`POST /auth/refresh`) using HTTP-Only cookies.

### Real-Time & Utilities
*   **Socket.io Client:** Maintains a persistent WebSocket channel for typing indicators, online statuses, and real-time E2EE messaging.
*   **fflate:** Provides high-speed, memory-efficient in-browser ZIP compression and decompression.
*   **ua-parser-js:** Evaluates device and browser user-agent fingerprints for session activity monitoring.

---

## 📁 Project Structure

```text
.
├── src/
│   ├── app/                      # Redux store configuration
│   │   └── store.js
│   ├── assets/                   # Static assets & graphics
│   ├── components/               # UI components
│   │   ├── chat/
│   │   │   ├── ChatSidebar.jsx   # List of active conversations
│   │   │   └── ChatWindow.jsx    # E2EE chat messages & input
│   │   ├── BottomNav.jsx         # Mobile Navigation
│   │   ├── DropZone.jsx          # Drag-and-drop file interface
│   │   ├── FeaturesSection.jsx   # Landing page features
│   │   ├── ForgetPassword.jsx    # Reset password modal trigger
│   │   ├── Hero.jsx              # Cyberpunk landing hero
│   │   ├── KeyInput.jsx          # Local passphrase inputs
│   │   ├── LogLine.jsx           # Cyberpunk-style CLI simulation logs
│   │   ├── Sidebar.jsx           # Sidebar Navigation
│   │   ├── TeaserSection.jsx     # Cyberpunk UI aesthetics
│   │   ├── UpdateUsernameForm.jsx# Username modification component
│   │   └── UserSessions.jsx      # Active user sessions & tracking
│   ├── data/                     # Cyberpunk data config mapping
│   │   └── dedsecData.js
│   ├── features/                 # Redux state & API slices
│   │   ├── theme/
│   │   │   └── themeSlice.js     # Accent color & design control
│   │   └── user/
│   │       └── userApi.js        # RTK Query authentication & users endpoints
│   ├── hooks/                    # Custom React hooks
│   │   ├── useInView.jsx         # Scroll observer
│   │   ├── useIsMobile.jsx       # Breakpoint detection
│   │   ├── useRequireAuth.jsx    # Authentication route guard
│   │   └── useSocket.jsx         # Socket connection singleton hook
│   ├── layouts/                  # App layouts
│   │   └── RootLayout.jsx
│   ├── pages/                    # Route Pages
│   │   ├── ChatPage.jsx          # End-to-End Encrypted Chat
│   │   ├── CompressionPage.jsx   # ZIP Compression landing
│   │   ├── CustomMessagePage.jsx # General notice pages
│   │   ├── DecryptDataPage.jsx   # Client-side File Decryptor
│   │   ├── DrivePage.jsx         # Cloud Storage Module (Under Construction)
│   │   ├── EncryptDataPage.jsx   # Client-side File Encryptor
│   │   ├── EncryptionPage.jsx    # File Encryption landing
│   │   ├── HomePage.jsx          # Base Home Dashboard
│   │   ├── LoginPage.jsx         # Authentication Forms
│   │   ├── NotFound.jsx          # Error 404
│   │   ├── NotLoggedIn.jsx       # Redirect notice
│   │   ├── ProfilePage.jsx       # Profile, sessions, and accent control
│   │   ├── RegisterPage.jsx      # Registration Form (vault key generation)
│   │   ├── RequestEmailVerificationPage.jsx
│   │   ├── UnZipPage.jsx         # Local Decompression (unZIP)
│   │   └── ZipPage.jsx           # Local Compression (ZIP)
│   ├── services/                 # RTK Query base configuration
│   │   └── api.js
│   ├── svgs/                     # SVG resources & Dedsec branding
│   ├── theme/                    # Dynamic backgrounds, tickers, and dots
│   ├── utils/                    # Helper functions (E2EE wrappers, color helpers)
│   │   ├── cryptoUtils.js        # Web Crypto API wrapper (RSA + AES + PBKDF2)
│   │   └── hexToRgb.js
│   ├── App.jsx
│   ├── index.css                 # Custom TailwindCSS v4 configurations
│   └── main.jsx
├── public/                       # Cyberpunk backdrop videos & assets
├── Documentation/                # Architectural & design references
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## 🚦 Current Status

*   **Authentication:** Fully functional with HTTP-Only cookie-based session persistence and automated JWT refresh-token triggers.
*   **End-to-End Chat:** Operational E2EE real-time communication via Socket.io, supporting online tracking and message synchronicity across multi-tab sessions.
*   **Local File Tools:** Fully operational client-side ZIP/unZIP browser execution (via `fflate`) and local AES-256-GCM file encryption/decryption.
*   **Accent Color Management:** Active global color control synced via Redux, allowing users to customize their visual interface accent dynamically.
*   **Drive Storage:** Drive page mock structure is completed; backend cloud storage architecture and security logic are under consideration.

---

## ⚠️ Security Notice

Because the ENC system operates under a **Zero-Knowledge Architecture**, all key materials are derived locally using your master password.
*   **No Password Recovery:** If you forget or reset your password, the server cannot recover your old private key. Consequently, your historical encrypted chat logs and files cannot be decrypted.
