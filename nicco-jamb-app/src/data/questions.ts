// Question types & subject metadata.
// IMPORTANT: Questions themselves are NOT hardcoded here. They are fetched
// live from the Google Sheet via the `fetch-questions` edge function.
// See: src/hooks/useQuestions.ts

export interface Question {
  id: string;
  subject: string;
  subjectLabel?: string;
  topic: string;
  subtopic?: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year?: string;
  source?: string;
  imageUrl?: string;
  tags?: string;
  createdBy?: string;
  createdDate?: string;
  status?: string;
  notes?: string;
}

export const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', color: 'from-blue-500 to-blue-700', icon: 'Calculator', description: 'Algebra, Geometry, Calculus & more' },
  { id: 'english', name: 'English Language', color: 'from-purple-500 to-purple-700', icon: 'BookOpen', description: 'Comprehension, Grammar & Lexis' },
  { id: 'physics', name: 'Physics', color: 'from-orange-500 to-orange-700', icon: 'Atom', description: 'Mechanics, Waves & Electricity' },
  { id: 'chemistry', name: 'Chemistry', color: 'from-green-500 to-green-700', icon: 'FlaskConical', description: 'Organic, Inorganic & Physical' },
  { id: 'biology', name: 'Biology', color: 'from-pink-500 to-pink-700', icon: 'Leaf', description: 'Cells, Genetics & Ecology' },
  { id: 'economics', name: 'Economics', color: 'from-amber-500 to-amber-700', icon: 'TrendingUp', description: 'Demand, Supply, Markets & Money' },
  { id: 'government', name: 'Government', color: 'from-red-500 to-red-700', icon: 'Landmark', description: 'Constitution, Politics & Governance' },
  { id: 'crs', name: 'Christian Religious Studies', color: 'from-teal-500 to-teal-700', icon: 'BookMarked', description: 'Old & New Testament, Themes & Doctrine' },
];

// Accepted aliases for the Subject column coming from the Google Sheet.
// Helps us bucket questions correctly regardless of casing or wording.
const SUBJECT_ALIASES: Record<string, string> = {
  'mathematics': 'mathematics',
  'math': 'mathematics',
  'maths': 'mathematics',
  'english': 'english',
  'english language': 'english',
  'use of english': 'english',
  'physics': 'physics',
  'chemistry': 'chemistry',
  'biology': 'biology',
  'economics': 'economics',
  'economy': 'economics',
  'government': 'government',
  'govt': 'government',
  'civic education': 'government',
  'crs': 'crs',
  'christian religious studies': 'crs',
  'christian religious knowledge': 'crs',
  'crk': 'crs',
  'religious studies': 'crs',
};

export const normalizeSubject = (raw?: string): string => {
  if (!raw) return '';
  const key = raw.toString().trim().toLowerCase();
  return SUBJECT_ALIASES[key] || key;
};

// Helpers that operate over a runtime-loaded question list.
export const getQuestionsBySubject = (all: Question[], subjectId: string) =>
  all.filter((q) => normalizeSubject(q.subject) === subjectId);

export const getMixedQuestions = (all: Question[], count: number = 20) => {
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
