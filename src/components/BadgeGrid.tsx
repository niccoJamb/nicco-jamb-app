import React from 'react';
import { Flame, Lock } from 'lucide-react';
import { BADGES } from '@/data/badges';

interface BadgeGridProps {
  earned: string[];
  compact?: boolean;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ earned, compact }) => {
  const earnedSet = new Set(earned);
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3'}`}>
      {BADGES.map((b) => {
        const has = earnedSet.has(b.key);
        return (
          <div
            key={b.key}
            className={`relative rounded-2xl border p-3 text-center transition-all ${
              has
                ? `border-transparent bg-gradient-to-br ${b.color} text-white shadow-md ring-2 ${b.ring}`
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
            title={`${b.title} — ${b.description}`}
          >
            <div className="flex justify-center mb-1">
              {has ? (
                <Flame className="h-7 w-7 text-yellow-100" />
              ) : (
                <Lock className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <div className={`text-lg font-extrabold leading-none ${has ? '' : 'text-gray-400'}`}>{b.days}</div>
            <div className={`text-[10px] uppercase tracking-wide mt-0.5 ${has ? 'text-white/90' : 'text-gray-400'}`}>days</div>
            {!compact && (
              <div className={`text-xs font-semibold mt-1 ${has ? 'text-white' : 'text-gray-500'}`}>{b.title}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
