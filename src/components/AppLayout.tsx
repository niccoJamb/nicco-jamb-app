import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import SubjectGrid from './SubjectGrid';
import Features from './Features';
import MockExamLauncher from './MockExamLauncher';
import WhatsAppBanner from './WhatsAppBanner';
import Footer from './Footer';
import Quiz, { QuizResult } from './Quiz';
import Results from './Results';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';
import MilestonePopup from './MilestonePopup';
import SignInModal from './SignInModal';
import { SUBJECTS, getQuestionsBySubject, getMixedQuestions, Question } from '@/data/questions';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestions } from '@/hooks/useQuestions';
import { Loader2, AlertCircle, RefreshCw, ShieldX } from 'lucide-react';

type View = 'home' | 'subjects' | 'mock' | 'dashboard' | 'leaderboard' | 'quiz' | 'results';

const AppLayout: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [signInOpen, setSignInOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{ title: string; subjectId: string; timed: boolean } | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [milestoneBadges, setMilestoneBadges] = useState<string[]>([]);
  const { user, isBanned, history, saveQuizResult, signOut } = useAuth();
  const { questions, loading, error, approved, fetchedAt, refresh } = useQuestions();

  // After the /verified page confirms an email it redirects here and sets this
  // flag so the user lands straight in their dashboard (never the locked state).
  useEffect(() => {
    let initial: string | null = null;
    try { initial = sessionStorage.getItem('nicco_initial_view'); } catch {}
    if (initial === 'dashboard') {
      try { sessionStorage.removeItem('nicco_initial_view'); } catch {}
      setView('dashboard');
    }
  }, []);

  const handleNavigate = (target: string) => {
    if (target === 'signin') { setSignInOpen(true); return; }
    if (target === 'dashboard' && !user) { setSignInOpen(true); return; }
    setView(target as View);
    setCurrentQuiz(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSubjectQuiz = (subjectId: string) => {
    const subj = SUBJECTS.find(s => s.id === subjectId);
    const title = subjectId === 'mixed' ? 'Mixed Practice Quiz' : `${subj?.name} Practice`;
    setCurrentQuiz({ title, subjectId, timed: false });
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startMockExam = () => {
    setCurrentQuiz({ title: 'JAMB Mock Exam', subjectId: 'mock', timed: true });
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const quizQuestions = useMemo<Question[]>(() => {
    if (!currentQuiz || questions.length === 0) return [];
    if (currentQuiz.subjectId === 'mixed') return getMixedQuestions(questions, 20);
    if (currentQuiz.subjectId === 'mock') {
      const mocked: Question[] = [];
      SUBJECTS.forEach(s => {
        const subjQs = getQuestionsBySubject(questions, s.id).sort(() => Math.random() - 0.5).slice(0, 5);
        mocked.push(...subjQs);
      });
      return mocked.sort(() => Math.random() - 0.5);
    }
    return getQuestionsBySubject(questions, currentQuiz.subjectId);
  }, [currentQuiz, questions]);

  const handleQuizComplete = async (result: QuizResult) => {
    setLastResult(result);
    if (user && currentQuiz) {
      const earned = await saveQuizResult({
        title: result.title,
        subject_id: currentQuiz.subjectId,
        score: result.score,
        total: result.total,
        time_spent: result.timeSpent,
      });
      if (earned && earned.length) setMilestoneBadges(earned);
    }
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retryQuiz = () => {
    if (currentQuiz) {
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // A banned/blocked user must not access any quiz or content.
  if (user && isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your account has been restricted</h1>
          <p className="text-gray-600 mb-6">
            Access to quizzes and your dashboard has been disabled by an administrator.
            If you believe this is a mistake, please contact support.
          </p>
          <button
            onClick={() => signOut()}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Loading state for quiz when questions still streaming in
  if (view === 'quiz' && currentQuiz && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-800">Loading live questions from Google Sheet…</p>
          <p className="text-sm text-gray-500 mt-2">Fetching the latest approved questions</p>
        </div>
      </div>
    );
  }

  if (view === 'quiz' && currentQuiz && quizQuestions.length > 0) {
    return (
      <Quiz
        questions={quizQuestions}
        title={currentQuiz.title}
        timeLimit={currentQuiz.timed ? 25 * 60 : undefined}
        onComplete={handleQuizComplete}
        onExit={() => setView('home')}
      />
    );
  }

  if (view === 'quiz' && currentQuiz && quizQuestions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No approved questions found</h2>
          <p className="text-gray-600 mb-6">
            There are no approved questions for this selection in the Google Sheet yet.
            Add rows with Status = "Approved" and refresh.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={() => setView('home')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'results' && lastResult) {
    return (
      <Results
        result={lastResult}
        onRetry={retryQuiz}
        onHome={() => setView('home')}
      />
    );
  }

  const dashboardHistory = history.map(h => ({
    title: h.title,
    score: h.score,
    total: h.total,
    date: new Date(h.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  }));

  // Per-subject approved counts for display
  const subjectCounts: Record<string, number> = {};
  SUBJECTS.forEach(s => { subjectCounts[s.id] = getQuestionsBySubject(questions, s.id).length; });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNavigate={handleNavigate} currentView={view} />

      {/* Live status bar */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                <span>Loading questions from live Google Sheet…</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-red-600">Couldn't load questions: {error}</span>
              </>
            ) : (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span><strong>{approved}</strong> approved questions loaded live from Google Sheet</span>
                {fetchedAt && (
                  <span className="hidden sm:inline text-gray-400">
                    · updated {new Date(fetchedAt).toLocaleTimeString()}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 disabled:opacity-50"
            title="Re-fetch questions from the sheet"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <main className="flex-1">
        {view === 'home' && (
          <>
            <Hero onStart={() => handleNavigate('subjects')} onMock={() => handleNavigate('mock')} />
            <SubjectGrid onSelectSubject={startSubjectQuiz} subjectCounts={subjectCounts} totalApproved={approved} />
            <Features />
            <MockExamLauncher onStart={startMockExam} />
            <WhatsAppBanner />
          </>
        )}

        {view === 'subjects' && (
          <div className="py-8">
            <SubjectGrid
              onSelectSubject={startSubjectQuiz}
              title="All JAMB Subjects"
              subtitle={`Pick a subject to practice. ${approved} approved questions live from your Google Sheet.`}
              subjectCounts={subjectCounts}
              totalApproved={approved}
            />
          </div>
        )}

        {view === 'mock' && (
          <div className="min-h-[80vh] flex items-center">
            <div className="w-full">
              <MockExamLauncher onStart={startMockExam} />
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard history={dashboardHistory} onPractice={() => handleNavigate('subjects')} />
        )}

        {view === 'leaderboard' && <Leaderboard />}


      </main>

      <Footer />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      <MilestonePopup badgeKeys={milestoneBadges} onClose={() => setMilestoneBadges([])} />
    </div>
  );
};

export default AppLayout;
