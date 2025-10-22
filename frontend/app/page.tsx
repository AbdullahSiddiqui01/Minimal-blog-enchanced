"use client";
import { useEffect, useState, useCallback } from "react";
import PostCard from "../components/PostCard";
import Link from "next/link";

// TypeScript interface for a Post
interface Post {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/posts";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: Post[] = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 sm:gap-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Minimal Blog</h1>
          <Link
            href="/create"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 transition transform hover:scale-[1.02]"
          >
            + Create Post
          </Link>
        </header>

        {/* Error state */}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mb-6 font-medium">
            {error}
          </p>
        )}

        {/* Empty state */}
        {posts.length === 0 && !error ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-20 text-lg">
            No posts found. Be the first to create one!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={() => handleDelete(post._id)}
                deleting={deleting === post._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
