-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    outline TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('generating', 'generated', 'failed')),
    content JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since no auth)
CREATE POLICY "Allow all operations on lessons" ON public.lessons
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS lessons_created_at_idx ON public.lessons(created_at DESC);
CREATE INDEX IF NOT EXISTS lessons_status_idx ON public.lessons(status);

-- Enable realtime for the lessons table
ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
