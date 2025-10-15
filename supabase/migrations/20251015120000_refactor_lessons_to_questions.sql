-- Migration: Refactor lessons table to store only question data, not design/code
-- Design/CSS will be in codebase as reusable templates

-- Step 1: Create new questions_data structure
-- This will replace the content.typescript field with structured question data

-- First, let's backup and then modify the lessons table
-- Add new columns for structured question data
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS questions JSONB;

-- Remove the old content column (after data migration if needed)
-- For now, we'll keep both during transition
-- ALTER TABLE public.lessons DROP COLUMN IF EXISTS content;

-- Update the comment
COMMENT ON TABLE public.lessons IS 'Stores quiz lessons with questions data only. Design templates are in codebase.';
COMMENT ON COLUMN public.lessons.questions IS 'Array of question objects with: question, options[], correct index';

-- Example questions structure:
-- {
--   "questions": [
--     {
--       "question": "What is the capital of France?",
--       "options": ["London", "Berlin", "Paris", "Madrid"],
--       "correct": 2,
--       "explanation": "Paris is the capital and largest city of France." (optional)
--     }
--   ]
-- }

-- Create index for questions data
CREATE INDEX IF NOT EXISTS lessons_questions_idx ON public.lessons USING gin(questions);
