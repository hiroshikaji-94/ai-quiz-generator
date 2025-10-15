import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLesson } from '@/lib/ai-generator';
import { generateRandomQuizFromDatabase } from '@/lib/random-quiz-generator';

export async function POST(request: Request) {
  try {
    const { outline, apiKey } = await request.json();

    if (!outline || typeof outline !== 'string' || outline.trim().length === 0) {
      return NextResponse.json(
        { error: 'Outline is required' },
        { status: 400 }
      );
    }

    // Extract a title from the outline (first 100 chars or first line)
    const title = outline.split('\n')[0].substring(0, 100);

    // Create initial lesson record with 'generating' status
    const supabase = await createClient();
    const { data: lesson, error: insertError } = await supabase
      .from('lessons')
      .insert({
        title,
        outline,
        status: 'generating',
        questions: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lesson:', insertError);
      return NextResponse.json(
        { error: 'Failed to create lesson' },
        { status: 500 }
      );
    }

    // Start generation in background (don't await)
    generateLessonInBackground(lesson.id, outline, apiKey);

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateLessonInBackground(lessonId: string, outline: string, apiKey?: string) {
  const supabase = await createClient();

  try {
    console.log(`Starting generation for lesson ${lessonId}`);
    
    // Determine which generation method to use
    let questions;
    if (apiKey && apiKey.trim().length > 0) {
      // Use OpenAI with provided API key
      console.log(`Using OpenAI generation with provided API key`);
      const result = await generateLesson(outline, apiKey);
      questions = result.questions;
    } else {
      // Use random questions from database
      console.log(`No API key provided - generating from existing questions`);
      questions = await generateRandomQuizFromDatabase();
    }

    // Validate that we have questions
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error('Generated content must include at least one question');
    }

    // Update the lesson with generated questions
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        status: 'generated',
        questions: questions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId);

    if (updateError) {
      throw updateError;
    }

    console.log(`Successfully generated lesson ${lessonId} with ${questions.length} questions`);
  } catch (error) {
    console.error(`Error generating lesson ${lessonId}:`, error);

    // Update lesson with error status
    await supabase
      .from('lessons')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId);
  }
}
