import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("Auth callback:", { code: code?.substring(0, 10) + "...", next, origin });

  if (code) {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("Exchange result:", { error: error?.message, data: data ? "success" : "no data" });
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Auth error:", error);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}