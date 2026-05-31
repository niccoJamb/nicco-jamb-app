import React from 'react';
import { Clock, AlertTriangle, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MockExamLauncherProps {
  onStart: () => void;
}

const MockExamLauncher: React.FC<MockExamLauncherProps> = ({ onStart }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-wider opacity-90">Simulated Exam</div>
                <h2 className="text-2xl sm:text-3xl font-bold">JAMB Mock Test</h2>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl">
              Experience the real JAMB exam pressure. 25 mixed questions across all 5 subjects, with a strict timer.
            </p>
          </div>

          <div className="p-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <Clock className="h-5 w-5 text-blue-600 mb-2" />
                <div className="font-bold text-gray-900">25 minutes</div>
                <div className="text-sm text-gray-600">Total time</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <BookOpen className="h-5 w-5 text-green-600 mb-2" />
                <div className="font-bold text-gray-900">25 questions</div>
                <div className="text-sm text-gray-600">Mixed subjects</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <Target className="h-5 w-5 text-orange-600 mb-2" />
                <div className="font-bold text-gray-900">Pass: 60%</div>
                <div className="text-sm text-gray-600">Target score</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <strong>Rules:</strong> No pause once started. Timer keeps running. You cannot view explanations until you finish.
                Find a quiet place, grab a pen and paper, and start when you are ready.

              </div>
            </div>

            <Button onClick={onStart} size="lg" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-base">
              <Clock className="h-5 w-5 mr-2" /> Start Mock Exam Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MockExamLauncher;
