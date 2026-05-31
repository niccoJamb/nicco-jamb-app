import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Trophy, Users } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onMock: () => void;
}

const HERO_IMAGE =
  'https://d64gsuwffb70l.cloudfront.net/6a11fddc913b549d58b6970e_1779580592341_cb192360.jpg';

const Hero: React.FC<HeroProps> = ({ onStart, onMock }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Centered hero image */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={HERO_IMAGE}
                alt="Nicco — Your AI Study Buddy helping Nigerian students prepare for JAMB"
                className="w-full h-auto object-cover aspect-square"
                loading="eager"
              />
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-xl shadow-lg p-2 sm:p-3 border border-gray-100 flex items-center gap-2">
              <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500">Avg Score</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base">85%</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-xl shadow-lg p-2 sm:p-3 border border-gray-100 flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500">Studying Now</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base">2,847</div>
              </div>
            </div>
          </div>
        </div>

        {/* Title + tagline */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            JAMB UTME 2026 Ready
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5">
            Pass JAMB with{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto px-2">
            Meet Nicco — your AI study buddy. Nigeria's smartest practice platform for JAMB UTME with real exam questions, instant explanations, mock tests, and a personalized study plan built just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={onStart}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-base"
            >
              Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onMock} className="text-base border-2">
              <Clock className="mr-2 h-4 w-4" /> Take Mock Exam
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-200 max-w-md mx-auto">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">50+</div>
              <div className="text-xs sm:text-sm text-gray-500">Questions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">5</div>
              <div className="text-xs sm:text-sm text-gray-500">Subjects</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs sm:text-sm text-gray-500">Free</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
