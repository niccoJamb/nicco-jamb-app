import React from 'react';
import { BookOpenCheck, Clock, BarChart3, MessageCircle, Brain, Award } from 'lucide-react';

const features = [
  { icon: BookOpenCheck, title: 'Real JAMB Questions', desc: 'Practice with carefully curated questions modeled on past JAMB UTME papers across all 5 core subjects.' },
  { icon: Clock, title: 'Timed Mock Exams', desc: 'Simulate the real exam pressure with our timer-based mock tests. Build speed and confidence.' },
  { icon: Brain, title: 'Instant Explanations', desc: 'Every question comes with a clear, step-by-step explanation so you actually learn — not just memorize.' },
  { icon: BarChart3, title: 'Track Your Progress', desc: 'See your accuracy, time-per-question, weak topics, and growth across each subject in real time.' },
  { icon: MessageCircle, title: 'WhatsApp Bot Support', desc: 'Get daily questions and reminders straight on WhatsApp — practice even when you\'re offline-ish.' },
  { icon: Award, title: 'Built for Nigerians', desc: 'Designed specifically for Nigerian students preparing for the JAMB UTME, by people who understand the journey.' },
];

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-3">
            Why Nicco JAMB?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Everything you need to ace JAMB</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A complete prep platform that works on web, mobile, and even WhatsApp — built around how Nigerian students actually study.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 mb-4">
                <f.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
