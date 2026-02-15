# Smart Bookmarks App

A simple full-stack web application that allows users to save and manage bookmarks securely using Google Authentication.

## ✨ Features

- 🔐 Google OAuth authentication (no email/password)
- 👤 Each user has private bookmarks
- ➕ Add bookmarks (title + URL)
- 📄 View bookmarks
- ❌ Delete own bookmarks
- 🔄 Real-time updates (changes sync across tabs instantly)
- 🔒 Row Level Security (RLS) enforced at database level

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with RLS
- **Realtime**: Supabase Realtime API

## 📦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.local.example`)
4. Run the development server: `npm run dev`

## 🔒 Security

- All database operations are protected by Row Level Security (RLS)
- Users can only access their own bookmarks
- Google OAuth for secure authentication
