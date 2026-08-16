export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  zone: string;
  ecoPoints: number;
}

const TOKEN_KEY = "envirescue_access_token";
const USER_KEY = "envirescue_user_session";

export const DEMO_USERS: Record<string, CurrentUser> = {
  citizen: {
    id: "usr-demo-01",
    email: "shalom@campus.edu",
    fullName: "Shalom EcoChampion",
    role: "user",
    zone: "Zone A - North Campus & Dorms",
    ecoPoints: 480,
  },
  admin: {
    id: "usr-admin-01",
    email: "admin@envirescue.org",
    fullName: "Eco Supervisor",
    role: "admin",
    zone: "All Campus Zones",
    ecoPoints: 1250,
  },
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY) ?? "demo-token";
}

export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getCurrentUser(): CurrentUser {
  if (typeof window === "undefined") return DEMO_USERS.citizen;
  const stored = window.localStorage.getItem(USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as CurrentUser;
    } catch {
      // fallback
    }
  }
  return DEMO_USERS.citizen;
}

export function setCurrentUser(user: CurrentUser): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}

