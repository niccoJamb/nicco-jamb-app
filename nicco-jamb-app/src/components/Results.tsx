import React, { useState } from 'react';
import { QuizResult } from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, CheckCircle2, XCircle, RotateCcw, Home, Share2 } from 'lucide-react';

interface ResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRetry, onHome }) => {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;

  const grade = percentage >= 80 ? { label: 'Excellent!', color: 'text-green-600', bg: 'from-green-500 to-green-600', message: 'Outstanding work! You are JAMB ready.' } :
    percentage >= 60 ? { label: 'Good Job!', color: 'text-blue-600', bg: 'from-blue-500 to-blue-600', message: 'Solid performance. Keep practicing to push higher.' } :
    percentage >= 40 ? { label: 'Keep Going!', color: 'text-yellow-600', bg: 'from-yellow-500 to-orange-500', message: 'You\'re getting there. Review and try again.' } :
    { label: 'Don\'t Give Up!', color: 'text-red-600', bg: 'from-red-500 to-red-600', message: 'Practice makes perfect. Review the explanations.' };

  const handleShare = async () => {
    const text = `I just scored ${result.score}/${result.total} (${percentage}%) on ${result.title} in Nicco JAMB Practice App! 🎓`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My JAMB Score', text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Result copied to clipboard!');
      }
    } catch (e) { /* user cancelled */ }
  };

  if (showReview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Answers</h2>
            <Button variant="outline" onClick={() => setShowReview(false)}>Back to Results</Button>
          </div>
          <div className="space-y-4">
            {result.questions.map((q, i) => {
              const userAnswer = result.answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`bg-white rounded-2xl border-2 p-6 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{q.topic}</span>
                        {isCorrect ? (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Correct</span>
                        ) : (
                          <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle className="h-3 w-3" /> Incorrect</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-3">{q.question}</h3>
                      <div className="space-y-1.5 text-sm">
                        {(['A', 'B', 'C', 'D'] as const).map(letter => {
                          const isUser = userAnswer === letter;
                          const isAns = q.correctAnswer === letter;
                          return (
                            <div key={letter} className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                              isAns ? 'bg-green-50 text-green-900 font-medium' :
                              isUser ? 'bg-red-50 text-red-900' : 'text-gray-600'
                            }`}>
                              <span className="font-bold">{letter}.</span> {q.options[letter]}
                              {isAns && <CheckCircle2 className="h-4 w-4 ml-auto text-green-600" />}
                              {isUser && !isAns && <XCircle className="h-4 w-4 ml-auto text-red-600" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 flex items-center">
      <div className="max-w-3xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className={`bg-gradient-to-r ${grade.bg} p-8 text-white text-center`}>
            <Trophy className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{grade.label}</h1>
            <p className="text-white/90">{grade.message}</p>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl sm:text-7xl font-bold text-gray-900 mb-1">{percentage}%</div>
              <div className="text-gray-600">{result.score} out of {result.total} correct</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-700">{result.score}</div>
                <div className="text-xs text-green-700">Correct</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-red-700">{result.total - result.score}</div>
                <div className="text-xs text-red-700">Wrong</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-blue-700">{minutes}:{seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-blue-700">Time</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setShowReview(true)} variant="outline" className="flex-1">
                <Target className="h-4 w-4 mr-2" /> Review Answers
              </Button>
              <Button onClick={onRetry} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" /> Try Again
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
            <Button onClick={onHome} className="w-full mt-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Home className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
