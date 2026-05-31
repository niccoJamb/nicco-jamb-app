import React, { useState, useEffect } from 'react';
import { Question } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Flag } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  title: string;
  timeLimit?: number; // in seconds; if not provided, untimed
  onComplete: (results: QuizResult) => void;
  onExit: () => void;
}

export interface QuizResult {
  title: string;
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  total: number;
  timeSpent: number;
}

const Quiz: React.FC<QuizProps> = ({ questions, title, timeLimit, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [startTime] = useState(Date.now());

  const current = questions[currentIndex];
  const selectedAnswer = answers[current.id];
  const isLast = currentIndex === questions.length - 1;

  useEffect(() => {
    if (!timeLimit) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timeLimit]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (option: string) => {
    if (showExplanation) return;
    setAnswers({ ...answers, [current.id]: option });
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onComplete({ title, questions, answers, score, total: questions.length, timeSpent });
  };

  const goNext = () => {
    setShowExplanation(false);
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    setShowExplanation(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isTimeLow = timeLimit && timeLeft < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500">Practice</div>
              <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
              {timeLimit && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold ${isTimeLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                  <Clock className="h-4 w-4" /> {formatTime(timeLeft)}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-4">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {current.topic}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              current.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
              current.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}>
              {current.difficulty}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {current.question}
          </h3>

          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === current.correctAnswer;
              const showResult = showExplanation;

              let className = 'w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ';
              if (showResult) {
                if (isCorrect) className += 'border-green-500 bg-green-50 text-green-900';
                else if (isSelected) className += 'border-red-500 bg-red-50 text-red-900';
                else className += 'border-gray-200 bg-white text-gray-500';
              } else {
                if (isSelected) className += 'border-blue-500 bg-blue-50 text-blue-900 shadow-md';
                else className += 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-gray-900';
              }

              return (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  className={className}
                  disabled={showResult}
                >
                  <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                    showResult && isCorrect ? 'bg-green-600 text-white' :
                    showResult && isSelected ? 'bg-red-600 text-white' :
                    isSelected ? 'bg-blue-600 text-white' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1 font-medium">{current.options[letter]}</span>
                  {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <Flag className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Explanation</div>
                  <p className="text-sm text-blue-800 leading-relaxed">{current.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={goPrev} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          {!timeLimit && selectedAnswer && !showExplanation && (
            <Button variant="secondary" onClick={() => setShowExplanation(true)}>
              Check Answer
            </Button>
          )}

          <Button
            onClick={goNext}
            disabled={!selectedAnswer && !timeLimit}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {isLast ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Question dots */}
        <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => { setCurrentIndex(i); setShowExplanation(false); }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex ? 'bg-blue-600 text-white scale-110' :
                answers[q.id] ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
