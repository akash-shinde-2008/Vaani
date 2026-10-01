# Vaani - Voice AI Career Coach

Vaani is a voice-first AI career coach for students in India. Speak your career question, get an answer in seconds.

## Setup Instructions

1. Clone the repository.
2. Go to the `frontend` directory: `cd frontend`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and fill in your keys.

## Supabase Setup

1. Create a new Supabase project.
2. Run the SQL provided in `database/schema.sql` in the SQL Editor.
3. Enable Email/Password auth in Supabase Authentication settings.
4. Get your Project URL and Anon Key and put them in `.env.local`.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `GEMINI_API_KEY`: Your Google Gemini API Key

## Deployment to Vercel

1. Push your code to GitHub.
2. Import the project into Vercel. (Ensure the root directory is set to `frontend` if deploying from a monorepo).
3. Add the three environment variables in the Vercel dashboard.
4. Deploy!

## Screenshots
*(Add screenshots here)*
