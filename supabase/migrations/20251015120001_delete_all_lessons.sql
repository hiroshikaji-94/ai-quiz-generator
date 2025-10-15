-- Delete all existing lessons to start fresh with new question-based architecture
DELETE FROM public.lessons;

-- Reset the created_at index
REINDEX INDEX lessons_created_at_idx;

-- Vacuum the table to reclaim space
VACUUM ANALYZE public.lessons;

-- Confirm deletion
SELECT COUNT(*) as remaining_lessons FROM public.lessons;
