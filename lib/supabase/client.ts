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
        if (typeof document === "undefined") return undefined;
        const match = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
        if (!match) return undefined;
        return decodeURIComponent(match.split("=").slice(1).join("="));
      },
      set(name: string, value: string, options: any) {
        if (typeof document === "undefined") return;

        const opts = options ?? {};
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        cookie += `; Path=${opts.path ?? "/"}`;

        if (opts.maxAge != null) cookie += `; Max-Age=${opts.maxAge}`;
        if (opts.expires) cookie += `; Expires=${new Date(opts.expires).toUTCString()}`;
        if (opts.domain) cookie += `; Domain=${opts.domain}`;
        if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
        if (opts.secure) cookie += `; Secure`;

        document.cookie = cookie;
      },
      remove(name: string, options: any) {
        this.set(name, "", { ...(options ?? {}), maxAge: 0 });
      },
    },
  });
}