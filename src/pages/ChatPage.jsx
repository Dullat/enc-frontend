import { useState } from "react";
import { useSelector } from "react-redux";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import { useSocket } from "../hooks/useSocket.jsx";
import useIsMobile from "../hooks/useIsMobile.jsx";
import {
  useGetAllUsersQuery,
  useGetMeQuery,
} from "../features/user/userApi.js";
import { unlockPrivateKey } from "../utils/cryptoUtils.js";

const ChatPage = () => {
  const { sendMessage, messagesByUserId, onlineUsers, loadHistory } =
    useSocket();
  const isMobile = useIsMobile();
  const ACCENT = useSelector((state) => state.theme.accent);

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.user;

  const [activeUser, setActiveUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(!!window.my_secure_chat_key);
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!currentUser || !password) return;

    setUnlocking(true);
    try {
      const privateKey = await unlockPrivateKey(password, {
        encryptedPrivateKey: currentUser.encryptedPrivateKey,
        keyIv: currentUser.keyIv,
        keySalt: currentUser.keySalt,
      });
      window.my_secure_chat_key = privateKey;
      setIsUnlocked(true);
    } catch (err) {
      console.error("Unlock failed", err);
      alert("Invalid passphrase or failed to unlock.");
    } finally {
      setUnlocking(false);
    }
  };

  // users for sidebar
  const chatUsers = (usersData?.users || [])
    .filter((user) => user._id !== currentUser?._id)
    .map((user) => ({
      id: user._id,
      username: user.username,
      publicKey: user.publicKey,
      isOnline: onlineUsers.includes(user._id),
      lastMessage: "Encrypted link available.",
      lastMessageTime: "",
    }));

  const handleSelectUser = (user) => {
    setActiveUser(user);
    loadHistory(user.id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setActiveUser(null);
  };

  const handleSendMessage = (text) => {
    if (!activeUser) return;
    sendMessage(activeUser.id, text, activeUser.publicKey);
  };

  if (usersLoading) {
    return (
      <div className="flex w-full h-dvh items-center justify-center bg-background">
        <div
          className="font-family-display text-xl animate-pulse"
          style={{ color: ACCENT }}
        >
          INITIALIZING_SECURE_CHANNELS...
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex w-full h-dvh  items-center justify-center bg-background p-4">
        <form
          onSubmit={handleUnlock}
          className="ds-card p-8 w-full max-w-md flex flex-col gap-6 relative"
        >
          <div className="hud-tl" />
          <div className="hud-tr" />
          <div className="hud-bl" />
          <div className="hud-br" />
          <h2
            className="font-family-display text-xl text-center"
            style={{ color: ACCENT }}
          >
            UNLOCK_SECURE_CHAT
          </h2>
          <p className="text-muted text-sm font-family-mono text-center">
            Enter your passphrase to decrypt your private key.
          </p>
          <div className="ds-field">
            <label className="ds-field-label">PASSPHRASE</label>
            <input
              type="password"
              className="ds-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="ds-btn ds-btn-outline-o"
            disabled={unlocking}
          >
            <span>{unlocking ? "UNLOCKING..." : "UNLOCK_VAULT"}</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex w-full h-dvh pb-20 overflow-hidden bg-background relative">
      {/* Mobile Back Button */}
      {!showSidebar && isMobile && (
        <button
          onClick={handleBackToSidebar}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-surface border border-line"
          style={{ color: ACCENT }}
        >
          ←
        </button>
      )}

      {/* Sidebar */}
      {(showSidebar || !isMobile) && (
        <ChatSidebar
          users={chatUsers}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
        />
      )}

      {/* Chat Window */}
      {(!showSidebar || !isMobile) && (
        <ChatWindow
          activeUser={activeUser}
          messages={messagesByUserId[activeUser?.id] || []}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default ChatPage;
