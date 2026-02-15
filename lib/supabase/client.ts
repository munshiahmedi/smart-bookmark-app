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
        return document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge ?? 3600}; ${options?.domain ? `domain=${options.domain};` : ''} ${options?.secure ? 'secure;' : ''} ${options?.sameSite ? `samesite=${options.sameSite};` : ''}`;
      },
      remove(name: string) {
        document.cookie = `${name}=; path=/; max-age=0`;
      },
    },
  });
}