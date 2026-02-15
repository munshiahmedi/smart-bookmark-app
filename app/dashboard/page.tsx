"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // 🔐 Check auth + fetch bookmarks
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let bookmarkSubscription: any = null;
    
    const loadData = async () => {
      // First check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, set up auth state change listener
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              // If we get a session from auth state change, proceed with loading data
              await fetchBookmarks();
              setLoading(false);
              setAuthChecked(true);
            } else {
              // If still no session after state change, redirect to login
              router.push('/login');
            }
          }
        );
        subscription = authSubscription;

        // If no session and no immediate auth state change, redirect after a short delay
        const timer = setTimeout(() => {
          if (!authChecked) {
            router.push('/login');
          }
        }, 500);

        return () => {
          clearTimeout(timer);
          subscription?.unsubscribe();
          if (bookmarkSubscription) {
            supabase.removeChannel(bookmarkSubscription);
          }
        };
      }

      // If we have a session, proceed with loading data
      setAuthChecked(true);
      await fetchBookmarks();
      setLoading(false);

      // --- Setup realtime subscription ---
      bookmarkSubscription = supabase
        .channel("public:bookmarks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookmarks" },
          (payload) => {
            switch (payload.eventType) {
              case "INSERT":
                setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                break;
              case "UPDATE":
                setBookmarks((prev) =>
                  prev.map((b) =>
                    b.id === (payload.new as Bookmark).id
                      ? (payload.new as Bookmark)
                      : b
                  )
                );
                break;
              case "DELETE":
                setBookmarks((prev) =>
                  prev.filter((b) => b.id !== (payload.old as Bookmark).id)
                );
                break;
            }
          }
        )
        .subscribe();
    };

    loadData();

    // Clean up on unmount
    return () => {
      subscription?.unsubscribe();
      if (bookmarkSubscription) {
        supabase.removeChannel(bookmarkSubscription);
      }
    };
  }, [router, authChecked]);

  // 📥 Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };

  // ➕ Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return alert("Fill all fields");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user?.id,
    });

    setTitle("");
    setUrl("");
    // No need to fetchBookmarks() anymore; realtime handles it
  };

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    // No need to fetchBookmarks() anymore; realtime handles it
  };

  if (loading) return <p className="p-6 text-center">Loading bookmarks...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Bookmarks</h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Add Bookmark Form */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-3">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addBookmark}
                className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
              >
                Add Bookmark
              </button>
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="divide-y divide-gray-100">
            {bookmarks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No bookmarks yet. Add your first one above!
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {bookmarks.map((b) => (
                  <li
                    key={b.id}
                    className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <div className="px-6 py-5 flex items-center justify-between">
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium text-base flex-1 truncate mr-4"
                        title={`${b.title} - ${b.url}`}
                      >
                        <span className="text-gray-900 font-semibold text-lg">{b.title}</span>
                        <span className="text-gray-500 text-sm block mt-1 truncate">{new URL(b.url).hostname.replace('www.', '')}</span>
                      </a>
                      <button
                        onClick={() => deleteBookmark(b.id)}
                        className="text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-gray-200"
                        title="Delete bookmark"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
