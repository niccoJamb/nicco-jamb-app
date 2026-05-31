import React from 'react';
import { Flame, X, PartyPopper } from 'lucide-react';
import { BADGE_MAP, BadgeDef } from '@/data/badges';
import { Button } from '@/components/ui/button';

interface MilestonePopupProps {
  badgeKeys: string[];
  onClose: () => void;
}

const MilestonePopup: React.FC<MilestonePopupProps> = ({ badgeKeys, onClose }) => {
  if (!badgeKeys.length) return null;
  // Show the highest milestone reached.
  const badges: BadgeDef[] = badgeKeys.map((k) => BADGE_MAP[k]).filter(Boolean);
  if (!badges.length) return null;
  const top = badges.reduce((a, b) => (b.days > a.days ? b : a), badges[0]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex justify-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${top.color} shadow-lg ring-4 ${top.ring}`}>
            <Flame className="h-12 w-12 text-yellow-100" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-orange-500">
          <PartyPopper className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Badge Unlocked!</span>
        </div>

        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">{top.title}</h2>
        <p className="mt-1 text-gray-600">
          You've reached a <strong>{top.days}-day</strong> practice streak. Keep the fire burning!
        </p>

        {badges.length > 1 && (
          <p className="mt-2 text-xs text-gray-400">
            +{badges.length - 1} more badge{badges.length - 1 === 1 ? '' : 's'} earned
          </p>
        )}

        <Button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
};

export default MilestonePopup;
