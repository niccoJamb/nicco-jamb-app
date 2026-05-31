import React from 'react';
import { Calculator, BookOpen, Atom, FlaskConical, Leaf, Shuffle, ArrowRight, TrendingUp, Landmark, BookMarked } from 'lucide-react';
import { SUBJECTS } from '@/data/questions';

const iconMap: Record<string, any> = { Calculator, BookOpen, Atom, FlaskConical, Leaf, TrendingUp, Landmark, BookMarked };


interface Props {
  onSelectSubject: (id: string) => void;
  title?: string;
  subtitle?: string;
  subjectCounts?: Record<string, number>;
  totalApproved?: number;
}

const SubjectGrid: React.FC<Props> = ({ onSelectSubject, title = 'Choose Your Subject', subtitle = 'Practice JAMB UTME subjects with detailed explanations.', subjectCounts = {}, totalApproved = 0 }) => {

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((s) => {
            const Icon = iconMap[s.icon] || BookOpen;
            const count = subjectCounts[s.id] ?? 0;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSubject(s.id)}
                disabled={count === 0}
                className={`group text-left bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} text-white mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{s.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {count} approved {count === 1 ? 'question' : 'questions'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Practice <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => onSelectSubject('mixed')}
            disabled={totalApproved === 0}
            className="group text-left bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 text-white mb-4">
              <Shuffle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">Mixed Practice</h3>
            <p className="text-sm text-white/90 mb-4">Random questions pulled live across all subjects.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                {totalApproved} total live
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                Start <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid;
