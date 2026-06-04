const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toDateTimeInputValue(date: Date) {
  return `${toDateInputValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function addDays(dateValue: string, days: number) {
  const date = parseLocalDate(dateValue);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function isoFromDateTimeInput(value: string) {
  return new Date(value).toISOString();
}

export function localDateFromIso(iso: string) {
  return toDateInputValue(new Date(iso));
}

export function isSameLocalDate(iso: string, dateValue: string) {
  return localDateFromIso(iso) === dateValue;
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parseLocalDate(value));
}

export function minutesBetween(startIso?: string, endIso?: string) {
  if (!startIso || !endIso) return 0;
  return Math.max(0, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000));
}

export function formatDuration(minutes: number) {
  if (minutes <= 0) return "0분";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

export function getBabyAge(birthDate: string, now = new Date()) {
  const birth = parseLocalDate(birthDate);
  const today = parseLocalDate(toDateInputValue(now));
  const days = Math.max(0, Math.floor((today.getTime() - birth.getTime()) / MS_PER_DAY));
  const completedMonths = Math.floor(days / 30.4375);

  return {
    days,
    completedMonths,
    monthStage: completedMonths + 1,
    label: `${days}일 · ${completedMonths}개월`,
  };
}

export function elapsedLabel(iso?: string) {
  if (!iso) return "기록 없음";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) return rest ? `${hours}시간 ${rest}분 전` : `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function currency(value?: number) {
  if (!value) return "";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}
