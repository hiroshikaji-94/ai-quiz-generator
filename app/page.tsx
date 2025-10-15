'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Lesson } from '@/lib/types';
import Link from 'next/link';
import SettingsModal from '@/components/SettingsModal';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const [outline, setOutline] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLessons();
    subscribeToLessons();
  }, []);

  async function fetchLessons() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lessons:', error);
      return;
    }

    setLessons(data || []);
  }

  function subscribeToLessons() {
    const supabase = createClient();
    
    const channel = supabase
      .channel('lessons-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lessons',
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setLessons((prev) => {
              // Check if lesson already exists to prevent duplicates
              const exists = prev.some((lesson) => lesson.id === (payload.new as Lesson).id);
              if (exists) {
                return prev;
              }
              return [payload.new as Lesson, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setLessons((prev) =>
              prev.map((lesson) =>
                lesson.id === payload.new.id ? (payload.new as Lesson) : lesson
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLessons((prev) =>
              prev.filter((lesson) => lesson.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    
    if (!outline.trim()) {
      setError('Please enter a quiz description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get API key from localStorage
      const apiKey = typeof window !== 'undefined' 
        ? localStorage.getItem('openai_api_key') 
        : null;

      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          outline,
          apiKey: apiKey || undefined 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      // Clear the form
      setOutline('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'generating':
        return 'text-yellow-600 bg-yellow-50';
      case 'generated':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  // Pagination calculations
  // Deduplicate lessons by ID to prevent duplicate keys
  const uniqueLessons = lessons.reduce((acc, lesson) => {
    if (!acc.some(l => l.id === lesson.id)) {
      acc.push(lesson);
    }
    return acc;
  }, [] as Lesson[]);
  
  const totalPages = Math.ceil(uniqueLessons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLessons = uniqueLessons.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            AI Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by artificial intelligence · Create interactive educational quizzes instantly
          </p>
        </header>

        {/* Generation Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative">
          {/* Settings Icon */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Generate New Quiz
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label
                htmlFor="outline"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quiz Description
              </label>
              <textarea
                id="outline"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder='e.g., "A 10 question pop quiz on Florida" or "A 5 question quiz on the solar system"'
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 text-sm">
                <p className="text-blue-900">
                  <strong>💡 Tip:</strong> Add your OpenAI API key in{' '}
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="underline hover:text-blue-700 font-semibold"
                  >
                    Settings ⚙️
                  </button>
                  {' '}to generate real custom quizzes with AI. Without an API key, quizzes will be created using random questions from the database.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
          </form>
        </div>

        {/* Lessons Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Generated Quizzes
          </h2>
          {uniqueLessons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No quizzes yet. Create your first quiz above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Quiz Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLessons.map((lesson) => (
                    <tr
                      key={lesson.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {lesson.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {lesson.outline.substring(0, 60)}
                          {lesson.outline.length > 60 ? '...' : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            lesson.status
                          )}`}
                        >
                          {lesson.status === 'generating' && (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          )}
                          {lesson.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(lesson.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        {lesson.status === 'generated' ? (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                          >
                            View Quiz →
                          </Link>
                        ) : lesson.status === 'failed' ? (
                          <span className="text-red-600 text-sm">
                            Failed
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Generating...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {uniqueLessons.length > ITEMS_PER_PAGE && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, uniqueLessons.length)} of {uniqueLessons.length} quizzes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </main>
  );
}
