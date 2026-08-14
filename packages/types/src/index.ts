export type UserRole = "user" | "admin";

export interface ApiError {
  detail: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  recyclable: boolean;
  description?: string;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  requiresReview: boolean;
}
