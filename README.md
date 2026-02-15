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

- **Frontend**: Next.js 16 (App Router)
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

## 🐛 Problems Faced & Solutions

### PKCE Code Verifier Error
**Problem**: During authentication, users encountered `AuthPKCECodeVerifierMissingError: PKCE code verifier not found in storage` when trying to log in, especially after multiple login attempts or when redirected back to the dashboard.

**Root Cause**: 
- Mixing old `@supabase/auth-helpers-nextjs` library with new `@supabase/ssr` library
- Improper cookie synchronization between client and server components
- PKCE flow not properly handled between browser and server

**Solution**:
1. **Removed conflicting library**: Removed `@supabase/auth-helpers-nextjs` from dependencies to avoid conflicts with `@supabase/ssr`
2. **Simplified client-side cookie handling**: Streamlined the cookie methods in `lib/supabase/client.ts` to match server expectations
3. **Fixed server-side configuration**: Updated `lib/supabase/server.ts` to use the latest `@supabase/ssr` API
4. **Cleaned up auth callback**: Simplified the auth callback route to handle errors properly and ensure proper redirects

### SSR Build Error
**Problem**: Production build failed with `ReferenceError: document is not defined` errors during server-side rendering.

**Root Cause**: Client-side Supabase code was executing during SSR where `document` and `window` objects are not available.

**Solution**: Added proper SSR guards in the client-side Supabase configuration:
```typescript
// Added these checks in cookie methods
if (typeof window === "undefined") return undefined;
if (typeof window === "undefined") return;
```

### Double Login Redirect Issue
**Problem**: Users had to log in twice - first authentication would fail, then a second login attempt would succeed and redirect to dashboard.

**Root Cause**: The PKCE code verifier wasn't being properly stored and retrieved between the auth initiation and callback phases.

**Solution**: The complete authentication flow overhaul above ensured proper PKCE handling, eliminating the need for double login attempts.


