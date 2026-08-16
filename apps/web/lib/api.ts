import { getAccessToken, setAccessToken, setCurrentUser, type CurrentUser } from "./auth";
import {
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_RECYCLING_TIPS,
  INITIAL_MOCK_REPORTS,
  type CategoryItem,
  type WasteReportItem,
  type CollectionSchedule,
  type RecyclingTip,
} from "./mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  fallbackData?: T,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  if (token && token !== "demo-token") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set JSON content-type if not FormData
  if (!(init?.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
      throw new ApiClientError(
        payload?.detail ?? `Request failed with status ${response.status}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

/* ── Authentication Endpoints ── */
export async function apiLogin(email: string, password: string) {
  const data = await apiRequest<{
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      email: string;
      full_name: string;
      role: "user" | "admin";
    };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAccessToken(data.access_token);
  const user: CurrentUser = {
    id: data.user.id,
    email: data.user.email,
    fullName: data.user.full_name,
    role: data.user.role,
    zone: "Zone A - North Sector & Residential",
    ecoPoints: 480,
  };
  setCurrentUser(user);
  return user;
}

export async function apiRegister(email: string, fullName: string, password: string) {
  return apiRequest<{
    id: string;
    email: string;
    full_name: string;
    role: "user" | "admin";
  }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, full_name: fullName, password }),
  });
}

export async function apiGetMe() {
  return apiRequest<CurrentUser>("/api/v1/auth/me", undefined, undefined);
}

/* ── Dashboard Summary ── */
export interface DashboardSummaryData {
  total_quantity_kg: number;
  report_count: number;
  recyclable_percentage: number;
  categories: Array<{ category: string; quantity_kg: number }>;
}

export async function apiGetDashboardSummary(): Promise<DashboardSummaryData> {
  return apiRequest<DashboardSummaryData>(
    "/api/v1/dashboard/summary",
    undefined,
    {
      total_quantity_kg: 121.6,
      report_count: 28,
      recyclable_percentage: 84.2,
      categories: [
        { category: "Plastic", quantity_kg: 42.5 },
        { category: "Paper & Cardboard", quantity_kg: 34.0 },
        { category: "Organic & Compost", quantity_kg: 24.3 },
        { category: "Glass & Metal", quantity_kg: 14.6 },
        { category: "Electronic Waste", quantity_kg: 6.1 },
      ],
    },
  );
}

/* ── AI Classification ── */
export interface ClassificationResponse {
  waste_report_id?: string | null;
  category?: string;
  detected_type?: string;
  classification_group?: string;
  confidence: number;
  requires_review: boolean;
  model_name?: string | null;
  status?: string;
  source?: string;
  error_message?: string | null;
}

export async function classifyWasteImage(formData: FormData): Promise<ClassificationResponse> {
  return apiRequest<ClassificationResponse>(
    "/api/v1/classifications/image",
    {
      method: "POST",
      body: formData,
    },
  );
}

interface ApiWasteItem {
  id: string;
  category?: string;
  category_id?: string;
  icon_key?: string;
  iconKey?: string;
  quantity_kg?: number | string;
  quantityKg?: number | string;
  location?: string;
  description?: string;
  created_at?: string;
  date?: string;
  recyclable?: boolean;
  status?: "verified" | "pending" | "review_required";
  confidence?: number;
}

interface ApiCategoryItem {
  id?: string;
  name?: string;
  slug?: string;
  is_recyclable?: boolean;
  color?: string;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  icon_key?: string;
  description?: string;
  fun_fact?: string;
}

/* ── Waste Reports ── */
export async function apiGetWasteReports(page = 1, pageSize = 20): Promise<{ items: WasteReportItem[]; total: number }> {
  const res = await apiRequest<{ items: ApiWasteItem[]; total: number }>(
    `/api/v1/waste?page=${page}&page_size=${pageSize}`,
    undefined,
    { items: INITIAL_MOCK_REPORTS, total: INITIAL_MOCK_REPORTS.length },
  );

  return {
    items: res.items.map((r: ApiWasteItem) => ({
      id: r.id,
      category: r.category ?? r.category_id ?? "General Waste",
      iconKey: (r.icon_key ?? r.iconKey ?? "plastic") as WasteReportItem["iconKey"],
      quantityKg: Number(r.quantity_kg ?? r.quantityKg ?? 1),
      location: r.location ?? "Main Collection Point",
      description: r.description ?? "Waste report",
      date: r.created_at ? new Date(r.created_at).toLocaleDateString() : (r.date ?? "Today"),
      recyclable: Boolean(r.recyclable ?? true),
      status: r.status ?? "verified",
      confidence: Number(r.confidence ?? 0.95),
    })),
    total: res.total,
  };
}

export async function apiCreateWasteReport(formData: FormData) {
  return apiRequest<{
    id: string;
    category_id: string;
    quantity_kg: number;
    location: string;
    description?: string;
    image_url?: string;
  }>("/api/v1/waste/with-image", {
    method: "POST",
    body: formData,
  });
}

/* ── Categories ── */
export async function apiGetCategories(): Promise<CategoryItem[]> {
  const list = await apiRequest<ApiCategoryItem[]>("/api/v1/categories", undefined, MOCK_CATEGORIES);
  if (!Array.isArray(list) || list.length === 0) return MOCK_CATEGORIES;
  return list.map((c: ApiCategoryItem, i: number) => ({
    id: c.id ?? `cat-${i}`,
    name: c.name ?? "Waste",
    slug: c.slug ?? c.name?.toLowerCase().replace(/\s+/g, "-") ?? "waste",
    recyclable: c.is_recyclable ?? true,
    color: c.color ?? "#059669",
    bgColor: c.bg_color ?? "bg-pastel-green",
    borderColor: c.border_color ?? "border-emerald-200",
    textColor: c.text_color ?? "text-emerald-900",
    iconKey: (c.icon_key ?? "plastic") as CategoryItem["iconKey"],
    description: c.description ?? "",
    funFact: c.fun_fact ?? "",
  }));
}

/* ── Collections ── */
export async function apiGetUpcomingCollections(): Promise<CollectionSchedule[]> {
  return apiRequest<CollectionSchedule[]>(
    "/api/v1/collections/upcoming",
    undefined,
    MOCK_COLLECTIONS,
  );
}

/* ── Recycling Tips ── */
export async function apiGetRecyclingTips(): Promise<RecyclingTip[]> {
  return apiRequest<RecyclingTip[]>(
    "/api/v1/recycling/tips",
    undefined,
    MOCK_RECYCLING_TIPS,
  );
}
