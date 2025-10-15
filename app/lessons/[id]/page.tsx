"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lesson } from "@/lib/types";
import QuizTemplate from "@/components/QuizTemplate";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchLesson(params.id as string);
    }
  }, [params.id]);

  async function fetchLesson(id: string) {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      setError("Failed to load lesson");
      setLoading(false);
      return;
    }

    setLesson(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-base text-gray-700 font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Quiz Not Found
          </h1>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            {error || "This quiz does not exist."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (lesson.status !== "generated" || !lesson.questions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-5xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Quiz Generating
          </h1>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            This quiz is being generated. Please check back in a moment.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2 mb-4 transition-colors hover:underline"
          >
            ← Back to Quizzes
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {lesson.outline}
          </p>
        </div>

        {/* Quiz Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <QuizTemplate questions={lesson.questions} />
        </div>
      </div>
    </div>
  );
}
