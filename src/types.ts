export type ActivityType =
  | "milk"
  | "sleep"
  | "diaper"
  | "solid"
  | "medicine"
  | "play"
  | "note";

export type DiaperType = "wet" | "dirty" | "mixed" | "dry";
export type SleepQuality = "good" | "normal" | "hard";
export type ReactionLevel = "none" | "watch" | "mild";
export type SupplyStatus = "needed" | "ordered" | "stocked" | "low" | "bought";
export type ResearchStatus = "to-search" | "saved" | "done";
export type ResearchCategory = "개월수" | "여행" | "놀이" | "건강" | "쇼핑" | "기타";

export interface BabyProfile {
  name: string;
  birthDate: string;
  memo: string;
}

export interface ScheduleEntry {
  id: string;
  type: ActivityType;
  startedAt: string;
  endedAt?: string;
  title: string;
  amount?: number;
  unit?: string;
  diaper?: DiaperType;
  sleepQuality?: SleepQuality;
  note?: string;
}

export interface FoodTrial {
  id: string;
  food: string;
  date: string;
  meal: string;
  amount: string;
  texture: string;
  isAllergen: boolean;
  reaction: ReactionLevel;
  note: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  status: SupplyStatus;
  quantity: string;
  targetDate?: string;
  price?: number;
  shop?: string;
  note?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  category: ResearchCategory;
  status: ResearchStatus;
  url?: string;
  note?: string;
  createdAt: string;
}

export interface CuratedCard {
  id: string;
  label: string;
  title: string;
  summary: string;
  sourceLabel: string;
  url: string;
}

export interface FoodCandidate {
  id: string;
  name: string;
  timing: string;
  reason: string;
  caution: string;
}

export interface BrandCandidate {
  id: string;
  name: string;
  fit: string;
  why: string;
  check: string;
  sourceLabel: string;
  url: string;
}

export interface BabyState {
  profile: BabyProfile;
  schedule: ScheduleEntry[];
  foods: FoodTrial[];
  supplies: SupplyItem[];
  research: ResearchItem[];
  readiness: Record<string, boolean>;
}
