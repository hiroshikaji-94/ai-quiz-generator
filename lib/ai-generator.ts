import OpenAI from "openai";
import { Client } from "langsmith";
import { z } from "zod";

const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
});

// New schema: Generate only questions data, not code
const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

const GeneratedQuestionsSchema = z.object({
  questions: z.array(QuizQuestionSchema).min(3).max(10),
});

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface GenerateLessonResult {
  questions: QuizQuestion[];
  trace_url?: string;
}

export async function generateLesson(
  outline: string,
  apiKey?: string
): Promise<GenerateLessonResult> {
  // Create OpenAI client with provided key or environment key
  const openai = new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });

  const runId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  try {
    const traceName = `generate-lesson-${runId}`;

    console.log("Starting lesson generation with outline:", outline);

    // NEW: Simplified prompt that generates only questions data
    const systemPrompt = `You are an expert educational content creator. 
Your task is to generate quiz questions for kids based on a topic outline.

CRITICAL REQUIREMENTS:
1. Generate ONLY quiz questions data (JSON format)
2. Each question must have exactly 4 options
3. One option must be correct (indicated by index 0-3)
4. Questions should be clear, educational, and appropriate for children
5. Include optional explanations to help kids learn
6. Generate between 3-10 questions based on the topic complexity

RESPONSE FORMAT:
Return a JSON object with:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2,
      "explanation": "Optional explanation of why this is correct"
    }
  ]
}

QUALITY GUIDELINES:
- Make questions engaging and fun for kids
- Ensure options are plausible but clearly distinguishable
- Use age-appropriate language
- Cover different aspects of the topic
- Include interesting facts in explanations`;

    const userPrompt = `Generate quiz questions based on this outline:

"${outline}"

Create engaging, educational questions for kids.

IMPORTANT: Return ONLY a JSON object with a "questions" array.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(responseContent);
    const validated = GeneratedQuestionsSchema.parse(parsed);

    // Log to LangSmith (only if enabled)
    if (process.env.LANGCHAIN_TRACING_V2 === 'true') {
      try {
        await langsmithClient.createRun({
          name: traceName,
          run_type: 'chain',
          inputs: { outline },
          outputs: validated,
          start_time: startTime,
          end_time: Date.now(),
          extra: {
            model: 'gpt-3.5-turbo',
            tokens: completion.usage,
            metadata: {
              questionCount: validated.questions.length,
            },
          },
        });
      } catch (traceError) {
        console.warn('Failed to log to LangSmith:', traceError);
      }
    }

    return {
      questions: validated.questions,
      trace_url: `https://smith.langchain.com/o/${process.env.LANGCHAIN_PROJECT}/traces/${traceName}`,
    };
  } catch (error) {
    console.error("Error generating lesson:", error);

    // Log error to LangSmith (only if enabled)
    if (process.env.LANGCHAIN_TRACING_V2 === 'true') {
      try {
        await langsmithClient.createRun({
          name: `generate-lesson-${runId}`,
          run_type: 'chain',
          inputs: { outline },
          outputs: {},
          start_time: startTime,
          end_time: Date.now(),
          error: error instanceof Error ? error.message : String(error),
        });
      } catch (traceError) {
        console.warn('Failed to log error to LangSmith:', traceError);
      }
    }

    throw error;
  }
}
