// Streak milestone badge definitions.
export interface BadgeDef {
  key: string;
  days: number;
  title: string;
  description: string;
  color: string; // tailwind gradient classes
  ring: string;  // tailwind ring/border color
}

export const BADGES: BadgeDef[] = [
  { key: 'streak-3', days: 3, title: 'Getting Started', description: '3-day streak', color: 'from-amber-400 to-orange-500', ring: 'ring-orange-200' },
  { key: 'streak-7', days: 7, title: 'One Week Strong', description: '7-day streak', color: 'from-orange-500 to-red-500', ring: 'ring-red-200' },
  { key: 'streak-14', days: 14, title: 'Two Weeks Fire', description: '14-day streak', color: 'from-red-500 to-pink-500', ring: 'ring-pink-200' },
  { key: 'streak-30', days: 30, title: 'Monthly Master', description: '30-day streak', color: 'from-fuchsia-500 to-purple-600', ring: 'ring-purple-200' },
  { key: 'streak-60', days: 60, title: 'Unstoppable', description: '60-day streak', color: 'from-indigo-500 to-blue-600', ring: 'ring-blue-200' },
  { key: 'streak-100', days: 100, title: 'Century Legend', description: '100-day streak', color: 'from-yellow-400 via-amber-500 to-yellow-600', ring: 'ring-yellow-300' },
];

export const BADGE_MAP: Record<string, BadgeDef> = BADGES.reduce((acc, b) => {
  acc[b.key] = b;
  return acc;
}, {} as Record<string, BadgeDef>);

// Given a previous streak and a new streak, return badge keys that are newly earned.
export function newlyEarnedBadges(prevStreak: number, newStreak: number): string[] {
  return BADGES.filter(b => newStreak >= b.days && prevStreak < b.days).map(b => b.key);
}
