export const HouseIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <path d="M2 7L8 2L14 7V14H10V10H6V14H2V7Z" />
    </svg>
  );
};
export const LockIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <rect x="3" y="7" width="10" height="8" />
      <path d="M5 7V5a3 3 0 016 0v2" />
      <circle cx="8" cy="11" r="1" fill={color} stroke="none" />
    </svg>
  );
};
export const DriveIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <ellipse cx="8" cy="12" rx="6" ry="2" />
      <path d="M2 8v4" />
      <path d="M14 8v4" />
      <ellipse cx="8" cy="8" rx="6" ry="2" />
      <path d="M2 4v4" />
      <path d="M14 4v4" />
      <ellipse cx="8" cy="4" rx="6" ry="2" />
    </svg>
  );
};
export const ChatIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <path d="M2 2h12v9H9l-3 3v-3H2V2Z" />
    </svg>
  );
};

export const CompressIcon = ({ size = 16, color = "#6E44FF" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <path d="M8 1v4" />
      <path d="M6 3l2-2 2 2" />

      <path d="M8 11v4" />
      <path d="M6 13l2 2 2-2" />

      <rect x="3" y="6" width="10" height="4" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="5" y1="7" x2="11" y2="7" />
      <line x1="5" y1="9" x2="11" y2="9" />
    </svg>
  );
};
export const ProfileIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" />
    </svg>
  );
};

export const ChevronRightIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3L11 8L6 13" />
    </svg>
  );
};

export const CloseIcon = ({ size = 16, color = "#FF6200" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M3 3L13 13" />
      <path d="M13 3L3 13" />
    </svg>
  );
};
