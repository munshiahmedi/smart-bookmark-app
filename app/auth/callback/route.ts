import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("Auth callback - Code received:", !!code);

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("Auth callback - Exchange result:", { error: error?.message });
    
    if (!error) {
      console.log("Auth callback - Redirecting to:", `${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.log("Auth callback - Redirecting to login with error");
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}