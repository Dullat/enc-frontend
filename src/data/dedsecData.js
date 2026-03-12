import {
  HouseIcon,
  LockIcon,
  DriveIcon,
  ProfileIcon,
  ChatIcon,
} from "../svgs/PrimaryIcons.jsx";
export const TICKER_ITEMS = [
  { label: "SYS.AUTH", value: "CREDENTIAL MODULE ACTIVE", highlight: true },
  { label: "ENCRYPTION", value: "AES-256-GCM ENGAGED", highlight: false },
  { label: "NETWORK", value: "ALL PACKETS SECURED", highlight: false },
  { label: "DEDSEC", value: "WATCHING THE WATCHERS", highlight: true },
  { label: "UPLINK", value: "STABLE 0.3ms LATENCY", highlight: false },
  { label: "TOKEN", value: "EXPIRES IN 14:58", highlight: true },
];

export const MODULE_ACCENT = {
  home: { color: "#FF6200", label: "ORANGE" },
  encrypt: { color: "#FF6200", label: "ORANGE" },
  drive: { color: "#00C8FF", label: "CYAN" },
  chat: { color: "#FF0066", label: "MAGENTA" },
  profile: { color: "#C9A84C", label: "GOLD" },
};

export const NAV_ITEMS = [
  { id: "home", label: "HOME", seq: "01", icon: HouseIcon, to: "/" },
  {
    id: "encrypt",
    label: "ENCRYPTION",
    seq: "02",
    icon: LockIcon,
    to: "encrypt",
  },
  {
    id: "drive",
    label: "CLOUD DRIVE",
    seq: "03",
    icon: DriveIcon,
    to: "drive",
  },
  { id: "chat", label: "LIVE CHAT", seq: "04", icon: ChatIcon, to: "chat" },
  {
    id: "profile",
    label: "PROFILE",
    seq: "05",
    icon: ProfileIcon,
    to: "profile",
  },
];

export const FEATURES = [
  {
    seq: "F-01",
    title: "ENCRYPTION",
    desc: "Upload any file. Set parameters. Generate SHA-256 hash and AES-256-GCM encrypted output in seconds.",
    accent: "#FF6200",
    tag: "ENCRYPT_DATA",
    class: "ds-badge-o",
  },
  {
    seq: "F-02",
    title: "CLOUD DRIVE",
    desc: "Encrypted cloud storage. Every file hashed, signed, and stored with full audit trail.",
    accent: "#00C8FF",
    tag: "UPLOAD_DATA",
    class: "ds-badge-c",
  },
  {
    seq: "F-03",
    title: "LIVE CHAT",
    desc: "End-to-end encrypted channels. No logs. No metadata. Real-time secure communication.",
    accent: "#FF0066",
    tag: "CHAT_LIVE",
    class: "ds-badge-m",
  },
  {
    seq: "F-04",
    title: "PROFILE",
    desc: "Manage identity, clearance level, and access keys. Your operator dossier.",
    accent: "#C9A84C",
    tag: "SECURE_PROFILE",
    class: "ds-badge-g",
  },
];
