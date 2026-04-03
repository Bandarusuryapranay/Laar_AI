/**
 * activityTracker.js
 * Stores aptitude and coding session completions in localStorage
 * so the Dashboard activity calendar can display them alongside mock interviews.
 */

const STORAGE_KEY = "prepedge_activity_log";

/**
 * Save a completed activity session.
 * @param {"aptitude"|"coding"} type
 * @param {string} label  — e.g. "Quantitative Aptitude" or "Arrays (Medium)"
 * @param {number} score  — percentage score (0-100), or null for coding
 */
export function saveActivity(type, label, score = null) {
  const log = getActivityLog();
  const entry = {
    type,         // "aptitude" | "coding"
    label,
    score,
    createdAt: new Date().toISOString(),
  };
  log.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

/**
 * Return all saved activity entries.
 * @returns {Array}
 */
export function getActivityLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Build a combined activity array shaped like interviews
 * so the ActivityCalendar can consume them uniformly.
 * Each item just needs a `createdAt` field.
 */
export function getAllActivities() {
  return getActivityLog();
}

/**
 * Return counts per type for the Dashboard summary cards.
 * @returns {{ aptitude: number, coding: number }}
 */
export function getActivityCounts() {
  const log = getActivityLog();
  return {
    aptitude: log.filter((e) => e.type === "aptitude").length,
    coding: log.filter((e) => e.type === "coding").length,
  };
}
