import React from 'react';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppBanner: React.FC = () => {
  const features = [
    'Daily JAMB practice questions',
    'Study reminders & streaks',
    'Quick subject-by-subject quizzes',
    'Tips, motivation & exam updates',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-4">
                <MessageCircle className="h-4 w-4" /> WhatsApp Bot
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Practice on WhatsApp, Anywhere</h2>
              <p className="text-white/90 mb-6">
                No app to download, no data wasted. Get daily JAMB practice questions delivered straight to your WhatsApp — perfect for between classes, on transport, or during break.
              </p>
              <ul className="space-y-2 mb-6">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/95">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/13468729266?text=Hi%20Nicco!%20I%20want%20to%20start%20JAMB%20practice" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                  <MessageCircle className="h-5 w-5 mr-2" /> Chat on WhatsApp
                </Button>
              </a>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-sm mx-auto">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">N</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Nicco JAMB Bot</div>
                    <div className="text-xs text-green-600">● Online</div>
                  </div>
                </div>
                <div className="space-y-2 py-3 text-sm">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-gray-800">
                    Good morning! Ready for today's JAMB question?

                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[90%] text-gray-800">
                    <strong>Mathematics:</strong> If 2x + 3 = 11, find x.<br /><br />
                    A) 3  B) 4  C) 5  D) 6
                  </div>
                  <div className="bg-green-500 text-white rounded-2xl rounded-tr-sm p-3 max-w-[60%] ml-auto">
                    B
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-[90%] text-gray-800">
                    ✅ Correct! Great job. Streak: 5 days 🔥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppBanner;
