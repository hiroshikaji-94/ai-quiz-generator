'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Key, Save, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on mount
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } else {
      localStorage.removeItem('openai_api_key');
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-500">Configure your quiz generator</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {apiKey.trim() ? (
                <span className="text-green-600 font-medium">✓ API key configured - will use OpenAI</span>
              ) : (
                <span>No API key - will generate mock quizzes from database</span>
              )}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>With API key:</strong> Generates custom quizzes using OpenAI GPT-3.5</li>
              <li>• <strong>Without API key:</strong> Creates quizzes from existing questions in database</li>
              <li>• Your API key is stored locally and never sent to our servers</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClear}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              {saved ? (
                <>✓ Saved!</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
