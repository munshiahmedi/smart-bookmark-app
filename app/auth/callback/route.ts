import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ 
                name, 
                value, 
                ...options,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
              });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ 
                name, 
                value: '', 
                ...options, 
                maxAge: 0,
                path: '/'
              });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );

    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL("/login?error=auth_error", request.url));
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}