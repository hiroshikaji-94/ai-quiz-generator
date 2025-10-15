import { createClient } from '@supabase/supabase-js';
import { QuizQuestion } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Generate a mock quiz by pulling random questions from existing quizzes in the database
 */
export async function generateRandomQuizFromDatabase(): Promise<QuizQuestion[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all lessons that have questions
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('questions')
    .not('questions', 'is', null)
    .limit(50); // Get up to 50 lessons to pull from

  if (error || !lessons || lessons.length === 0) {
    throw new Error('No existing questions found in database to generate mock quiz');
  }

  // Collect all questions from all lessons
  const allQuestions: QuizQuestion[] = [];
  for (const lesson of lessons) {
    if (Array.isArray(lesson.questions)) {
      allQuestions.push(...lesson.questions);
    }
  }

  if (allQuestions.length === 0) {
    throw new Error('No valid questions found in database');
  }

  // Shuffle and pick 5 random questions
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, 5);

  // Ensure we have at least 3 questions
  if (selectedQuestions.length < 3) {
    throw new Error('Not enough questions available in database (need at least 3)');
  }

  return selectedQuestions;
}

/**
 * Check if OpenAI API key is available in localStorage
 */
export function hasOpenAIKey(): boolean {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem('openai_api_key');
  return !!key && key.trim().length > 0;
}

/**
 * Get OpenAI API key from localStorage
 */
export function getOpenAIKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('openai_api_key');
}
