import { defaultState } from "./data";
import type { BabyState } from "./types";

const STORAGE_KEY = "baby-schedule-state-v1";

export function normalizeState(value: Partial<BabyState> | null | undefined): BabyState {
  return {
    ...defaultState,
    ...value,
    profile: {
      ...defaultState.profile,
      ...value?.profile,
    },
    schedule: Array.isArray(value?.schedule) ? value.schedule : defaultState.schedule,
    foods: Array.isArray(value?.foods) ? value.foods : defaultState.foods,
    supplies: Array.isArray(value?.supplies) ? value.supplies : defaultState.supplies,
    research: Array.isArray(value?.research) ? value.research : defaultState.research,
    readiness: {
      ...defaultState.readiness,
      ...value?.readiness,
    },
  };
}

export function loadState(): BabyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return normalizeState(JSON.parse(raw) as Partial<BabyState>);
  } catch {
    return defaultState;
  }
}

export function saveState(state: BabyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
