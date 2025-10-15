'use client';

import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizTemplateProps {
  questions: QuizQuestion[];
}

/**
 * Reusable Quiz Template Component
 * Design is maintained in codebase, questions come from database
 * This is the single source of truth for quiz design/styling
 */
export default function QuizTemplate({ questions }: QuizTemplateProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-center text-white shadow-lg">
          <div className="text-5xl mb-3">
            {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-base text-white/90">
            {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Your Score
            </p>
            <div className="text-5xl font-bold text-gray-900">
              {score}<span className="text-gray-400">/</span>{questions.length}
            </div>
            <p className="text-xl font-bold text-gray-700 mt-2">
              {Math.round(percentage)}%
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200 shadow-sm">
              <p className="text-xs font-semibold text-green-700 mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">{score}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200 shadow-sm">
              <p className="text-xs font-semibold text-red-700 mb-1">Wrong</p>
              <p className="text-2xl font-bold text-red-600">{questions.length - score}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200 shadow-sm">
              <p className="text-xs font-semibold text-blue-700 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
            </div>
          </div>

          <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <button
            onClick={restartQuiz}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Try Again →
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-md">
              {currentQuestion + 1}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Progress</p>
              <p className="text-base font-semibold text-gray-900">
                {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-600">Score</p>
            <p className="text-lg font-bold text-blue-600">
              {score}<span className="text-gray-400">/</span>{questions.length}
            </p>
          </div>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl border border-white/30">
              ❓
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white/80 mb-1">
                Question {currentQuestion + 1}
              </p>
              <h3 className="text-base font-semibold leading-snug">
                {question.question}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm font-medium text-gray-600 mb-3">
            Select your answer:
          </p>
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showFeedback = selectedAnswer !== null;

              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (!showFeedback) {
                buttonClass += "border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50 hover:shadow-md active:scale-[0.99] cursor-pointer";
              } else if (isSelected && isCorrect) {
                buttonClass += "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-md";
              } else if (isCorrect) {
                buttonClass += "border-green-400 bg-green-50 shadow-sm";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 opacity-60";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                        !showFeedback ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300' :
                        isCorrect ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border border-green-600' :
                        isSelected ? 'bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-600' :
                        'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`font-medium text-sm leading-snug ${
                        showFeedback && isCorrect ? 'text-green-700 font-semibold' :
                        showFeedback && isSelected && !isCorrect ? 'text-red-700 font-semibold' :
                        'text-gray-800'
                      }`}>
                        {option}
                      </span>
                    </div>
                    {showFeedback && isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold text-xs">Correct</span>
                        <span className="text-xl text-green-600">✓</span>
                      </div>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-semibold text-xs">Wrong</span>
                        <span className="text-xl text-red-600">✗</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Show explanation after answer if available */}
          {selectedAnswer !== null && question.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                💡 Explanation:
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
