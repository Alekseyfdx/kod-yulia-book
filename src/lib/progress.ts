import { STORAGE_KEYS, chapters } from "@/data/chapters";

export function getReadIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.read);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === "number");
  } catch {
    return [];
  }
}

export function markRead(id: number) {
  if (typeof window === "undefined") return;
  const set = new Set(getReadIds());
  set.add(id);
  localStorage.setItem(STORAGE_KEYS.read, JSON.stringify([...set]));
  localStorage.setItem(STORAGE_KEYS.last, String(id));
}

export function getProgressPercent(): number {
  const n = getReadIds().length;
  return Math.round((n / chapters.length) * 100);
}

export function getLastChapter(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEYS.last);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
