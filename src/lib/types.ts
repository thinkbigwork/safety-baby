/* =============================
   TYPES — Safety Baby
   ============================= */

export type BabyStage = "pregnancy" | "newborn" | "firstSteps";

export type RoomType = "bedroom" | "kitchen" | "bathroom" | "living";

export type Severity = "low" | "medium" | "high" | "critical";

export type RiskLevel = "low" | "medium" | "high";

export type FindingCategory = "accident" | "disease" | "general";

export interface Finding {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  recommendation: string;
  category: FindingCategory;
  room: RoomType;
}

export interface RoomResult {
  name: RoomType;
  score: number; // 1-5
  riskLevel: RiskLevel;
  findings: Finding[];
}

export interface AdditionalPhotoRequest {
  area: string;
  reason: string;
  room: RoomType;
}

export interface AnalysisResult {
  overallScore: number; // 1-5
  rooms: RoomResult[];
  additionalPhotosNeeded: AdditionalPhotoRequest[];
  otherEvaluations: string[];
  totalFindings: number;
}

export interface RoomPhoto {
  room: RoomType;
  file: File | null;
  preview: string | null;
  base64: string | null;
}

export interface EvaluationState {
  stage: BabyStage | null;
  photos: RoomPhoto[];
  result: AnalysisResult | null;
  isUnlocked: boolean;
}
