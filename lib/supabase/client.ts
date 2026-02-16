import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
    );
  }

  return createBrowserClient(url, anonKey, {
    cookies: {
      get(name: string) {
        if (typeof window === "undefined") return undefined;
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: any) {
        if (typeof window === "undefined") return;
        const cookieOptions = [
          `${name}=${value}`,
          'path=/',
          `max-age=${options?.maxAge ?? 3600}`,
        ];
        
        if (options?.domain) cookieOptions.push(`domain=${options.domain}`);
        if (process.env.NODE_ENV === 'production') cookieOptions.push('secure');
        cookieOptions.push(`samesite=lax`);
        
        document.cookie = cookieOptions.join('; ');
      },
      remove(name: string) {
        if (typeof window === "undefined") return;
        document.cookie = `${name}=; path=/; max-age=0`;
      },
    },
  });
}