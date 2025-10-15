// Updated types for new question-only storage architecture
export type LessonStatus = 'generating' | 'generated' | 'failed';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string; // Optional explanation for the answer
}

export interface Lesson {
  id: string;
  title: string;
  outline: string;
  status: LessonStatus;
  // New: Store structured question data instead of TypeScript code
  questions: QuizQuestion[] | null;
  // Old: Keep for backward compatibility during transition
  content?: {
    typescript: string;
    componentName: string;
  } | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedLesson {
  questions: QuizQuestion[];
}
