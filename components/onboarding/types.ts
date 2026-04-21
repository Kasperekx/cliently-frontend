export type IndustryValue =
  | "saas"
  | "marketing"
  | "finance-legal"
  | "consulting"
  | "ecommerce"
  | "creative"
  | "other";

export type TeamSizeValue = "solo" | "2-5" | "6-20" | "21-50" | "50+";

export type OrganizationData = {
  name: string;
  industry: IndustryValue | null;
  teamSize: TeamSizeValue | null;
};

export type BrandingData = {
  logoDataUrl: string | null;
  logoName: string | null;
  accentColor: string;
};

export type TeamRole = "admin" | "manager" | "member";

export type TeamInvite = {
  id: string;
  email: string;
  role: TeamRole;
};

export type TeamData = {
  invites: TeamInvite[];
};

export type OnboardingData = {
  organization: OrganizationData;
  branding: BrandingData;
  team: TeamData;
};

export const INDUSTRY_OPTIONS: { value: IndustryValue; label: string }[] = [
  { value: "saas", label: "SaaS" },
  { value: "marketing", label: "Marketing" },
  { value: "finance-legal", label: "Finanse i prawo" },
  { value: "consulting", label: "Konsulting" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "creative", label: "Kreatywne" },
  { value: "other", label: "Inne" },
];

export const TEAM_SIZE_OPTIONS: { value: TeamSizeValue; label: string }[] = [
  { value: "solo", label: "Tylko ja" },
  { value: "2-5", label: "2–5 osób" },
  { value: "6-20", label: "6–20 osób" },
  { value: "21-50", label: "21–50 osób" },
  { value: "50+", label: "50+ osób" },
];

export const ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Członek" },
];

export const ROLE_LABEL: Record<TeamRole, string> = {
  admin: "Admin",
  manager: "Manager",
  member: "Członek",
};

export const DEFAULT_ACCENT = "#7BA088";

export const ACCENT_PRESETS: { value: string; label: string }[] = [
  { value: "#7BA088", label: "Sage" },
  { value: "#2F4858", label: "Navy" },
  { value: "#7C5C7B", label: "Plum" },
  { value: "#C8A35C", label: "Ochre" },
  { value: "#C26F55", label: "Terracotta" },
  { value: "#5C6470", label: "Slate" },
];

export const MAX_INVITES = 5;
export const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
