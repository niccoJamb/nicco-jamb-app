import React, { useEffect, useState } from 'react';
import { Flame, Trophy, Loader2, Medal, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LeaderEntry {
  rank: number;
  id: string;
  displayName: string;
  current_streak: number;
  longest_streak: number;
  isMe: boolean;
}

const rankBadge = (rank: number) => {
  if (rank === 1) return 'bg-yellow-400 text-yellow-900';
  if (rank === 2) return 'bg-gray-300 text-gray-700';
  if (rank === 3) return 'bg-amber-600 text-white';
  return 'bg-gray-100 text-gray-600';
};

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [me, setMe] = useState<LeaderEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('leaderboard');
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEntries(data.leaderboard || []);
      setMe(data.me || null);
    } catch (e: any) {
      setError(e.message || 'Could not load the leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const myInTop = me && entries.some((e) => e.id === me.id);

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-3">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Streak Leaderboard</h1>
          <p className="text-gray-600 mt-1">The most consistent JAMB students. Keep your daily streak alive to climb!</p>
        </div>

        {/* My position highlight */}
        {me && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">
                #{me.rank}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-white/80">My Position</div>
                <div className="font-bold">{me.displayName} (You)</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-lg font-extrabold">
              <Flame className="h-5 w-5 text-yellow-300" /> {me.current_streak}
            </div>
          </div>
        )}
        {user && !me && !loading && !error && (
          <div className="mb-6 rounded-2xl border border-dashed border-orange-300 bg-orange-50 p-4 text-center text-sm text-orange-700">
            You don't have an active streak yet. Complete a quiz today to join the leaderboard!
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Streaks</h2>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 text-sm">{error}</div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No streaks yet. Be the first to start one today!
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 ${
                    e.isMe ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankBadge(e.rank)}`}>
                      {e.rank <= 3 ? <Medal className="h-4 w-4" /> : e.rank}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {e.displayName}{e.isMe && <span className="text-indigo-600"> (You)</span>}
                      </div>
                      <div className="text-xs text-gray-500">Best: {e.longest_streak} days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-extrabold text-orange-600">
                    <Flame className="h-5 w-5" /> {e.current_streak}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {myInTop && (
          <p className="text-xs text-center text-gray-400 mt-3">Your row is highlighted above.</p>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
