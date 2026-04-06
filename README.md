# ENC - Frontend (The Dedsec Project)

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

high-security, hacker-themed web interface. This project is a secure hub/platform for encrypted communication, data protection, and high-performance file compression and file encryption.

---

##  Tech Stack & Architecture Approach

### Core Frameworks
*   **React 19 (Vite):** React for a high-performance, reactive UI.
*   **Tailwind CSS v4:** Modern utility-first CSS approach with custom theme extensions for the Dedsec aesthetic, (all the utilies and classes were prepared in advance)
*   **React Router v7:** Routing with dynamic layouts and authentication guard

### State & Data Management
*   **Redux Toolkit:** State management for global themes, user sessions, and application logic.
*   **RTK Query:** Advanced data fetching and caching layer with automatic re-authentication logic (auto auth on refresh).
*   **JWT Auth:** Secure cookie-based authentication with automatic token refresh on 401 intercepts.

### Cryptography & Security
*   **Web Crypto API:** Native browser encryption for maximum security
*   **E2EE Chat:** End-to-end encrypted messaging using RSA-OAEP for key exchange and AES-256-GCM for content encryption
*   **Client-Side Vault:** Private keys are stored in memory and protected by a PBKDF2-derived master passphrase (password is used as master-phrase, to unlock chat)
*   **Zero-Knowledge Architecture:** Encryption/Decryption and Compression/Decompression are performed entirely on the client. Keys and raw data is never sent to the server

### Real-Time & Utilities
*   **Socket.io-client:** Bi-directional, real-time communication for the E2EE chat system.
*   **fflate:** High-speed, memory-efficient ZIP compression and decompression in the browser
*   **ua-parser-js:** Device and browser fingerprinting for session monitoring

---

##  Project Structure

```text
.
├── src/
│   ├── app/                      # Redux store
│   │   └── store.js
│   ├── assets/                   # You know what it is
│   │   └── react.svg
│   ├── components/               # UI components
│   │   ├── chat/
│   │   │   ├── ChatSidebar.jsx
│   │   │   └── ChatWindow.jsx
│   │   ├── BottomNav.jsx
│   │   ├── DropZone.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── ForgetPassword.jsx
│   │   ├── Hero.jsx
│   │   ├── KeyInput.jsx
│   │   ├── LogLine.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TeaserSection.jsx
│   │   ├── UpdateUsernameForm.jsx
│   │   └── UserSessions.jsx
│   ├── data/                     # Static data for theme and config
│   │   └── dedsecData.js
│   ├── features/                 # Redux slices and API
│   │   ├── theme/
│   │   │   └── themeSlice.js
│   │   └── user/
│   │       └── userApi.js        # This is the main thing
│   ├── hooks/                    # Custom React hooks
│   │   ├── useInView.jsx
│   │   ├── useIsMobile.jsx
│   │   ├── useRequireAuth.jsx
│   │   └── useSocket.jsx
│   ├── layouts/                  # Main layout
│   │   └── RootLayout.jsx
│   ├── pages/                    # Main route Pages
│   │   ├── ChatPage.jsx          # E2EE Chat Page
│   │   ├── CompressionPage.jsx   # ZIP Tool LandingPage
│   │   ├── CustomMessagePage.jsx # (go back, not logged in, etc)
│   │   ├── DecryptDataPage.jsx   # Client-side Decryption
│   │   ├── DrivePage.jsx         # Cloud Storage (not started yet)
│   │   ├── EncryptDataPage.jsx   # Client-side Encryption
│   │   ├── EncryptionPage.jsx    # Encryption Tool LandingPage
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFound.jsx
│   │   ├── NotLoggedIn.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RequestEmailVerificationPage.jsx
│   │   ├── UnZipPage.jsx         # Client-side Decompression
│   │   └── ZipPage.jsx           # Client-side Compression
│   ├── services/                 # API base, its extended in features
│   │   └── api.js
│   ├── svgs/                     # Special SVG components, Dedsec theme
│   │   ├── DedsecLogo.jsx
│   │   ├── HeroBgSvg.jsx
│   │   ├── HeroBgSvgMobile.jsx
│   │   └── PrimaryIcons.jsx
│   ├── theme/                    # UI (Ticker, Dots, Backgrounds)
│   │   ├── DedsecBackgroundMobile.jsx
│   │   ├── DedsecBackgroundPc.jsx
│   │   ├── DedsecBg.jsx
│   │   ├── Dot.jsx
│   │   ├── InfoRow.jsx
│   │   └── Ticker.jsx
│   ├── utils/                    # Helpers and Crypto utils
│   │   ├── cryptoUtils.js
│   │   └── hexToRgb.js
│   ├── App.jsx
│   ├── index.css                 # Custom Dedsec Global styles
│   └── main.jsx
├── public/
│   ├── videos/
│   │   ├── bigBrother-poster.png
│   │   └── bigBrother.mp4
│   ├── logo.svg
│   └── vite.svg
├── Documentation/                # Archi and Sys-Design docs
│   └── chatSys.md
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

##  Current Status

*   **Authentication:** Fully functional with secure session persistence and JWT cookies
*   **Theme System:** Real-time global accent color management by using Redux
*   **Secure Chat:** E2EE with Web Crypto and Socket.io 
*   **Data Tools:** Client-side AES-256-GCM encryption/decryption and ZIP compression/decompression are operational

---

## Next
*   **Forget-Password** Right now Password forget does not gen new Keys(and this is a problem, on forget old chat will be locked)
*   **Drive:** First handle the password forget, the i will see

## 🔒 Security Notice

All encryption keys are derived on the client from user-password. If you lose your master passphrase(password), your encrypted data and chat history cannot be recovered.
