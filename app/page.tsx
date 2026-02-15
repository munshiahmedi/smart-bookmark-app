import { redirect } from "next/navigation";

export default function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const code = typeof searchParams?.code === "string" ? searchParams.code : null;
  const next = typeof searchParams?.next === "string" ? searchParams.next : null;

  if (code) {
    const qs = new URLSearchParams({ code });
    if (next) qs.set("next", next);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  redirect("/login");
}
