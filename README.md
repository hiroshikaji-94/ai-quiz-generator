<h1 align="center">🎯 AI Quiz Generator</h1>

<p align="center">
 An intelligent quiz generation platform powered by AI and real-time updates
</p>

Live Demo: https://kosidigital.vercel.app

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#usage"><strong>Usage</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a>
</p>
<br/>

## 📋 Overview

AI Quiz Generator is a modern web application that creates interactive quizzes using OpenAI's GPT technology or generates random quizzes from a curated database. Built with Next.js 15 and Supabase, it offers a seamless experience with real-time updates and a beautiful, futuristic interface.

## ✨ Features

### 🤖 Smart Quiz Generation
- **AI-Powered Creation**: Generate custom quizzes using OpenAI GPT-3.5-turbo with your own API key
- **Random Quiz Fallback**: No API key? No problem! Generate quizzes from a database of 50+ curated questions
- **Flexible Topics**: Create quizzes on any topic with 3-10 questions

### 🎨 Modern UI/UX
- **Animated Gradient Header**: Eye-catching, futuristic design with smooth animations
- **Responsive Design**: Fully responsive interface that works on all devices
- **Real-time Updates**: See new quizzes appear instantly with Supabase real-time subscriptions
- **Pagination**: Clean, paginated quiz list (5 items per page) with intuitive navigation

### ⚙️ Settings & Customization
- **API Key Management**: Secure settings modal to manage your OpenAI API key
- **Local Storage**: Your API key is stored securely in your browser
- **Show/Hide Toggle**: Password-style input with visibility toggle for security

### 📊 Quiz Management
- **Interactive Quiz Interface**: Beautiful quiz template with progress tracking
- **Answer Explanations**: Detailed explanations for each question to enhance learning
- **Question Variety**: Multiple-choice questions with well-crafted options
- **Score Tracking**: Instant feedback on your performance

## 🛠 Tech Stack

- **Frontend**: [Next.js 15.5.5](https://nextjs.org) with React 18 and App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with custom animations
- **Database**: [Supabase](https://supabase.com) PostgreSQL with real-time subscriptions
- **AI**: [OpenAI GPT-3.5-turbo](https://openai.com) for intelligent quiz generation
- **Icons**: [Lucide React](https://lucide.dev) for modern, consistent icons
- **Language**: TypeScript for type-safe development
- **Linting**: ESLint with flat config for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([create one here](https://database.new))
- (Optional) An OpenAI API key for AI-powered quiz generation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/build-with-deepak/ai-quiz-generator.git
   cd ai-quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key (optional - can be set in UI)
   ```

   Find your Supabase credentials in your [project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

4. **Set up the database**
   
   Run the following SQL in your Supabase SQL editor to create the required tables:
   ```sql
   -- Create lessons table
   CREATE TABLE lessons (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     outline TEXT NOT NULL,
     status TEXT DEFAULT 'generating',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create questions table
   CREATE TABLE questions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
     question TEXT NOT NULL,
     options TEXT[] NOT NULL,
     correct_answer INTEGER NOT NULL,
     explanation TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable real-time
   ALTER PUBLICATION supabase_realtime ADD TABLE lessons;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Generating Quizzes

1. **Without OpenAI API Key (Random Mode)**:
   - Enter a topic in the quiz outline field
   - Click "Generate Quiz"
   - The app will select 5 random questions from the database

2. **With OpenAI API Key (AI Mode)**:
   - Click the Settings icon (⚙️) in the top right
   - Enter your OpenAI API key
   - Click "Save API Key"
   - Enter a topic in the quiz outline field
   - Click "Generate Quiz"
   - AI will create a custom quiz based on your topic

### Taking Quizzes

1. Click on any quiz card from the list
2. Read each question carefully
3. Select your answer from the multiple choices
4. Click "Next Question" to proceed
5. View your score and review explanations at the end

### Managing Settings

- Click the Settings icon (⚙️) to open the settings modal
- Add, update, or clear your OpenAI API key
- Use the eye icon to show/hide your API key

## 📁 Project Structure

```
ai-quiz-generator/
├── app/
│   ├── api/
│   │   └── lessons/
│   │       └── generate/
│   │           └── route.ts          # Quiz generation API endpoint
│   ├── lessons/
│   │   └── [id]/
│   │       └── page.tsx              # Quiz display page
│   ├── globals.css                   # Global styles & animations
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main landing page
├── components/
│   ├── QuizTemplate.tsx              # Reusable quiz component
│   └── SettingsModal.tsx             # Settings modal component
├── lib/
│   ├── ai-generator.ts               # OpenAI integration
│   ├── random-quiz-generator.ts      # Random quiz logic
│   ├── types.ts                      # TypeScript interfaces
│   ├── utils.ts                      # Utility functions
│   └── supabase/
│       ├── client.ts                 # Supabase client
│       └── server.ts                 # Server-side Supabase
├── scripts/
│   └── generate-usa-quizzes.js       # Script to seed database
└── eslint.config.mjs                 # ESLint configuration
```

## 🎯 Key Features Explained

### Real-time Updates
The app uses Supabase's real-time subscriptions to instantly display new quizzes as they're created, with automatic deduplication to prevent duplicate entries.

### Smart Generation
The system intelligently routes quiz generation based on API key availability:
- **With API Key**: Uses OpenAI to generate contextually relevant questions
- **Without API Key**: Selects 5 random questions from a curated database

### Pagination
Quiz list displays 5 items per page with Previous/Next buttons and numbered page navigation for easy browsing.

## 🔧 Development

### Running Linter
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

<p align="center">Made with ❤️ using Next.js and Supabase</p>
