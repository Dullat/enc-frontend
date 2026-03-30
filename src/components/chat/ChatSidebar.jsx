import { useSelector } from "react-redux";
import { hexToRgb } from "../../utils/hexToRgb.js";

const ChatSidebar = ({ users, activeUser, onSelectUser }) => {
  const ACCENT = useSelector((state) => state.theme.accent);

  return (
    <div className="w-full sm:w-80 h-full border-r border-line flex flex-col bg-surface">
      <div className="p-4 border-b border-line">
        <h2
          className="font-family-display font-family-mono text-lg tracking-wider"
          style={{ color: ACCENT }}
        >
          CHATS
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="p-4 border-b border-line cursor-pointer transition-colors duration-200"
            style={{
              background:
                activeUser?.id === user.id
                  ? `rgba(${hexToRgb(ACCENT)}, 0.1)`
                  : "transparent",
              borderLeft:
                activeUser?.id === user.id
                  ? `4px solid ${ACCENT}`
                  : "4px solid transparent",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black"
                  style={{ background: ACCENT }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                {user.isOnline && (
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface bg-green-500"
                    title="Online"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-family-mono text-sm truncate text-white">
                    {user.username}
                  </h3>
                  <span className="text-[10px] text-muted font-family-mono">
                    {user.lastMessageTime}
                  </span>
                </div>
                <p className="text-xs text-muted truncate font-family-mono">
                  {user.lastMessage || "Encrypted payload..."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
