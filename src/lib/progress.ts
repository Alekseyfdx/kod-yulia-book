import { STORAGE_KEYS, chapters, getChapter } from "@/data/chapters";

function sanitizeIds(ids: number[]): number[] {
  const valid = new Set(chapters.map((c) => c.id));
  return [...new Set(ids.filter((n) => valid.has(n)))];
}

export function getReadIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.read);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return sanitizeIds(
      parsed.filter((n): n is number => typeof n === "number" && Number.isFinite(n)),
    );
  } catch {
    return [];
  }
}

export function markRead(id: number) {
  if (typeof window === "undefined") return;
  if (!getChapter(id)) return;
  const set = new Set(getReadIds());
  set.add(id);
  localStorage.setItem(STORAGE_KEYS.read, JSON.stringify([...set]));
  localStorage.setItem(STORAGE_KEYS.last, String(id));
}

export function getProgressPercent(): number {
  if (chapters.length === 0) return 0;
  const n = getReadIds().length;
  return Math.min(100, Math.round((n / chapters.length) * 100));
}

export function getLastChapter(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEYS.last);
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || !getChapter(n)) return null;
  return n;
}
