// In app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id?: string;
  created_at?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    if (!title || !url) return alert("Please fill in both title and URL");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }]);

    if (!error) {
      setTitle("");
      setUrl("");
    } else {
      console.error("Error adding bookmark:", error);
    }
  };

  // ❌ Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  // 🔐 Check auth + fetch bookmarks
  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    let bookmarkSubscription: any = null;

    const loadData = async () => {
      try {
        // First check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, set up auth state change listener
          const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (session) {
                // If we get a session from auth state change
                if (isMounted) {
                  setIsAuthenticated(true);
                  await fetchBookmarks();
                  setLoading(false);
                }
              } else if (isMounted) {
                // If still no session after state change, redirect to login
                router.push('/login');
              }
            }
          );
          subscription = authSubscription;

          // If no session and no immediate auth state change, redirect after a short delay
          const timer = setTimeout(() => {
            if (isMounted && !isAuthenticated) {
              router.push('/login');
            }
          }, 1000);

          return () => {
            clearTimeout(timer);
            subscription?.unsubscribe();
            if (bookmarkSubscription) {
              supabase.removeChannel(bookmarkSubscription);
            }
          };
        }

        // If we have a session, proceed with loading data
        if (isMounted) {
          setIsAuthenticated(true);
          await fetchBookmarks();
          setLoading(false);
        }

        // Setup realtime subscription
        bookmarkSubscription = setupRealtimeSubscription();

      } catch (error) {
        console.error('Error in loadData:', error);
        if (isMounted) {
          setLoading(false);
          router.push('/login');
        }
      }
    };

    const setupRealtimeSubscription = () => {
      return supabase
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
      isMounted = false;
      subscription?.unsubscribe();
      if (bookmarkSubscription) {
        supabase.removeChannel(bookmarkSubscription);
      }
    };
  }, [router, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Bookmarks</h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>

          {/* Add Bookmark Form */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addBookmark}
                disabled={!title.trim() || !url.trim()}
                className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:shadow-none"
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
                {bookmarks.map((bookmark) => (
                  <li
                    key={bookmark.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0"
                      >
                        <p className="text-gray-900 font-medium truncate">
                          {bookmark.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {new URL(bookmark.url).hostname.replace('www.', '')}
                        </p>
                      </a>
                      <button
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete bookmark"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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