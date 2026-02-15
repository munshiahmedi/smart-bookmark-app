
// app/dashboard/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/login';
          return;
        }

        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq('user_id', user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookmarks(data || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      await fetchBookmarks();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel("bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchBookmarks();
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from("bookmarks")
        .insert([{ title, url, user_id: user.id }]);
      
      if (error) throw error;
      
      setTitle("");
      setUrl("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
      <form onSubmit={handleAddBookmark} className="mb-8">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 p-2 border rounded"
            required
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Bookmark
          </button>
        </div>
      </form>
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {bookmark.title}
              </a>
              <p className="text-sm text-gray-500">{bookmark.url}</p>
            </div>
            <button
              onClick={() => handleDeleteBookmark(bookmark.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}