import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { X, Loader2, BookOpen, Clock, Calendar, Trophy, Mail, Phone, Target } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  name: string | null;
  phone: string | null;
  target_score: number | null;
  quiz_count: number;
}

interface QuizRecord {
  id: string;
  title: string;
  subject_id: string;
  score: number;
  total: number;
  time_spent: number;
  created_at: string;
}

interface Props {
  user: AdminUser | null;
  onClose: () => void;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatTime = (seconds: number) => {
  if (!seconds) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

const pct = (score: number, total: number) => {
  if (!total) return 0;
  return Math.round((score / total) * 100);
};

const scoreColor = (p: number) => {
  if (p >= 80) return 'text-emerald-700 bg-emerald-50';
  if (p >= 60) return 'text-indigo-700 bg-indigo-50';
  if (p >= 40) return 'text-amber-700 bg-amber-50';
  return 'text-rose-700 bg-rose-50';
};

const UserDetailDrawer: React.FC<Props> = ({ user, onClose }) => {
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke('user-quiz-history', {
          body: { user_id: user.id }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        if (!cancelled) setHistory(data.history || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) return null;

  const totalQuestions = history.reduce((a, h) => a + h.total, 0);
  const totalCorrect = history.reduce((a, h) => a + h.score, 0);
  const overallPct = pct(totalCorrect, totalQuestions);
  const totalTime = history.reduce((a, h) => a + h.time_spent, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-3xl bg-white shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate">
                {user.name || 'Unnamed Student'}
              </h2>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact / meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm">
              <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="truncate text-slate-700">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm">
              <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="truncate text-slate-700">{user.phone || '—'}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm">
              <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="text-slate-700">Joined {formatDate(user.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm">
              <Target className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="text-slate-700">
                Target score: {user.target_score ? user.target_score : '—'}
              </span>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Quizzes</div>
              <div className="text-2xl font-bold text-indigo-900 mt-1">{history.length}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Avg Score</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{overallPct}%</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Questions</div>
              <div className="text-2xl font-bold text-amber-900 mt-1">{totalQuestions}</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <div className="text-xs text-purple-600 font-medium uppercase tracking-wide">Time Spent</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{formatTime(totalTime)}</div>
            </div>
          </div>

          {/* History Table */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              Quiz History
            </h3>

            {loading ? (
              <div className="p-12 text-center bg-slate-50 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                <p className="text-slate-500 mt-3 text-sm">Loading quiz history...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-lg text-slate-500 text-sm">
                This user hasn't taken any quizzes yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Quiz</th>
                      <th className="text-left px-4 py-3 font-medium">Subject</th>
                      <th className="text-left px-4 py-3 font-medium">Score</th>
                      <th className="text-left px-4 py-3 font-medium">Time</th>
                      <th className="text-left px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map(h => {
                      const p = pct(h.score, h.total);
                      return (
                        <tr key={h.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{h.title || 'Untitled Quiz'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium uppercase">
                              {h.subject_id || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${scoreColor(p)}`}>
                              {h.score}/{h.total} · {p}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {formatTime(h.time_spent)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            {formatDate(h.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailDrawer;
