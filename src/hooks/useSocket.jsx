import { useEffect, useState, useCallback, useRef } from "react";
import { useGetMeQuery } from "../features/user/userApi.js";
import { io } from "socket.io-client";
import { decryptMessage, encryptMessage } from "../utils/cryptoUtils.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messagesByUserId, setMessagesByUserId] = useState({});
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.user;

  // ref for messages to avoid closure issues in socket listeners
  const messagesRef = useRef({});

  // Decrypting a single message object from backend
  const decryptIncoming = useCallback(async (msg, myId) => {
    const isMe = String(msg.sender) === String(myId);
    const myPrivateKey = window.my_secure_chat_key;

    if (!myPrivateKey) return { ...msg, text: "[ SECURE_KEY_REQUIRED ]", isMe };

    try {
      const relevantEncryptedKey = isMe
        ? msg.senderEncryptedKey
        : msg.receiverEncryptedKey;

      const decryptedText = await decryptMessage(
        msg.encryptedContent,
        msg.iv,
        relevantEncryptedKey,
        myPrivateKey,
      );
      return {
        text: decryptedText,
        isMe,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        id: msg._id,
      };
    } catch (err) {
      console.error("Decryption failed for message", msg._id, err);
      return {
        text: "[ DECRYPTION_FAILED ]",
        isMe,
        timestamp: "!!",
        id: msg._id,
      };
    }
  }, []);

  // Fetch and decrypt chat history for a single user
  const loadHistory = useCallback(
    async (otherUserId) => {
      if (!currentUser?._id || !window.my_secure_chat_key) return;

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/chat/history/${otherUserId}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          },
        );

        const data = await response.json();

        if (data.success) {
          const rawMessages = data.messages;
          const decryptedMessages = await Promise.all(
            rawMessages.map((msg) => decryptIncoming(msg, currentUser._id)),
          );

          setMessagesByUserId((prev) => ({
            ...prev,
            [otherUserId]: decryptedMessages,
          }));
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    },
    [currentUser?._id, decryptIncoming],
  );

  useEffect(() => {
    if (!currentUser?._id) return;

    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server", newSocket.id);
    });

    newSocket.on("receiveMessage", async (data) => {
      const isMe = String(data.sender) === String(currentUser._id);
      const otherPartyId = isMe ? data.receiver : data.sender;

      const decrypted = await decryptIncoming(data, currentUser._id);

      setMessagesByUserId((prev) => {
        const existing = prev[otherPartyId] || [];
        // Preventing duplicates for multitab or UIahead
        if (existing.find((m) => m.id === decrypted.id)) return prev;

        return {
          ...prev,
          [otherPartyId]: [...existing, decrypted],
        };
      });
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users.map((id) => String(id)));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [currentUser?._id, decryptIncoming]);

  const sendMessage = useCallback(
    async (receiverId, text, receiverPubKey) => {
      if (socket && text.trim() && currentUser) {
        const myPrivateKey = window.my_secure_chat_key;
        const myPubKey = currentUser.publicKey;

        if (!myPrivateKey || !receiverPubKey || !myPubKey) {
          console.error("Missing keys for encryption");
          return;
        }

        try {
          const encryptedData = await encryptMessage(
            text,
            receiverPubKey,
            myPubKey,
          );

          socket.emit(
            "sendMessage",
            {
              receiverId,
              ...encryptedData,
            },
            (response) => {
              if (response.success) {
                const timestamp = new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const newMessage = {
                  text,
                  isMe: true,
                  timestamp,
                  id: response.message._id,
                };

                setMessagesByUserId((prev) => ({
                  ...prev,
                  [receiverId]: [...(prev[receiverId] || []), newMessage],
                }));
              }
            },
          );
        } catch (err) {
          console.error("Encryption or sending failed", err);
        }
      }
    },
    [socket, currentUser],
  );

  return {
    socket,
    onlineUsers,
    messagesByUserId,
    sendMessage,
    loadHistory,
    setMessagesByUserId,
  };
};
