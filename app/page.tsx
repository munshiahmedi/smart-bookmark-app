import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const code = typeof sp?.code === "string" ? sp.code : null;
  const next = typeof sp?.next === "string" ? sp.next : null;

  if (code) {
    const qs = new URLSearchParams({ code });
    if (next) qs.set("next", next);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  redirect("/login");
}
