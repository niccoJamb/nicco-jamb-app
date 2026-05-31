import React from 'react';
import { TrendingUp, Award, Target, Clock, BookOpen, Flame } from 'lucide-react';
import { SUBJECTS } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardProps {
  history: Array<{ title: string; score: number; total: number; date: string }>;
  onPractice: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onPractice }) => {
  const { profile } = useAuth();
  const totalAttempts = history.length;
  const totalQuestions = history.reduce((a, h) => a + h.total, 0);
  const totalCorrect = history.reduce((a, h) => a + h.score, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestScore = history.length ? Math.max(...history.map(h => Math.round((h.score / h.total) * 100))) : 0;

  // --- Daily practice streak ---
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  // Determine whether today's practice is already done (keeps the streak "live").
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  const practicedToday = profile?.last_practice_date === todayStr;
  const streakActive = currentStreak > 0;

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Dashboard</h1>
            <p className="text-gray-600">Track your JAMB preparation progress</p>
          </div>
          {/* Flame streak badge */}
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-3 shadow-sm border ${
              streakActive
                ? 'bg-gradient-to-r from-orange-500 to-red-500 border-transparent text-white'
                : 'bg-white border-gray-200 text-gray-500'
            }`}
            title={
              streakActive
                ? practicedToday
                  ? 'You practiced today — keep it going tomorrow!'
                  : 'Practice today to keep your streak alive!'
                : 'Complete a quiz today to start a streak!'
            }
          >
            <div className={`relative ${streakActive ? '' : 'opacity-60'}`}>
              <Flame className={`h-9 w-9 ${streakActive ? 'text-yellow-200' : 'text-gray-400'}`} />
            </div>
            <div className="leading-tight">
              <div className="text-2xl font-extrabold">
                {currentStreak} <span className="text-sm font-semibold">day{currentStreak === 1 ? '' : 's'}</span>
              </div>
              <div className={`text-xs font-medium ${streakActive ? 'text-white/90' : 'text-gray-400'}`}>
                {streakActive ? (practicedToday ? 'Streak active today' : 'Practice today to keep it!') : 'No streak yet'}
              </div>
            </div>
            {longestStreak > 0 && (
              <div className={`ml-2 pl-3 border-l ${streakActive ? 'border-white/30' : 'border-gray-200'} text-center`}>
                <div className="text-lg font-bold">{longestStreak}</div>
                <div className={`text-[10px] uppercase tracking-wide ${streakActive ? 'text-white/80' : 'text-gray-400'}`}>Best</div>
              </div>
            )}
          </div>
        </div>




        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="h-5 w-5 text-blue-600" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
            <div className="text-sm text-gray-500">Practice Sessions</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg"><Target className="h-5 w-5 text-green-600" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
            <div className="text-sm text-gray-500">Overall Accuracy</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg"><Award className="h-5 w-5 text-yellow-600" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{bestScore}%</div>
            <div className="text-sm text-gray-500">Best Score</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg"><Flame className="h-5 w-5 text-orange-600" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{currentStreak} day{currentStreak === 1 ? '' : 's'}</div>
            <div className="text-sm text-gray-500">Current Streak</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">Recent Practice</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No practice sessions yet. Start your first one!</p>
                <Button onClick={onPractice} className="bg-gradient-to-r from-green-500 to-blue-500">Start Practicing</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 6).map((h, i) => {
                  const pct = Math.round((h.score / h.total) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                        pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{h.title}</div>
                        <div className="text-xs text-gray-500">{h.score}/{h.total} correct • {h.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Subject Coverage</h2>
            <div className="space-y-3">
              {SUBJECTS.map(s => {
                const subjectHistory = history.filter(h => h.title.toLowerCase().includes(s.name.toLowerCase()));
                const attempts = subjectHistory.length;
                const pct = Math.min(attempts * 20, 100);
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-medium text-gray-700">{s.name}</span>
                      <span className="text-gray-500">{attempts} sessions</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button onClick={onPractice} variant="outline" className="w-full mt-5">
              <Clock className="h-4 w-4 mr-2" /> Practice More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
