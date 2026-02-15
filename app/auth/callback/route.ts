import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=No authentication code provided`
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) throw error;
    
    return NextResponse.redirect(new URL(next, origin));
  } catch (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(
      `${origin}/login?error=Could not authenticate user`
    );
  }
}