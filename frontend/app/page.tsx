"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpCircle,
  Plus,
  Search,
  Sun,
  Moon,
  Filter,
  PenSquare,
  User,
  Calendar,
  Loader2,
  Twitter,
  Github,
  Instagram,
} from "lucide-react";
import PostCard from "../components/PostCard";

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
  category?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/posts";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

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
    const handleScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts]);

  const categories = ["All", "Tech", "Design", "Business", "Lifestyle"];
  const filteredPosts = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // 🎞️ Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          Loading your universe of ideas ✨
        </motion.p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-gray-100"
          : "bg-gradient-to-b from-indigo-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {/* 🧭 Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm rounded-b-xl"
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          Minimal Blog
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition"
          >
            <Plus size={18} /> Create
          </Link>
        </div>
      </motion.nav>

      {/* 🪩 Hero Section */}
      <section className="text-center py-16 px-6">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Explore Stories, Ideas & Insights
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Read from creators, entrepreneurs & dreamers across the world.
        </p>
      </section>

      {/* 📊 Stats Section */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-10">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/60 shadow-md hover:scale-105 transition">
          <PenSquare className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold">{posts.length}</h3>
          <p className="text-sm text-gray-500">Total Posts</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/60 shadow-md hover:scale-105 transition">
          <Filter className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold">{categories.length}</h3>
          <p className="text-sm text-gray-500">Categories</p>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-red-400 transition"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📰 Posts Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="max-w-6xl mx-auto px-6 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {error ? (
          <p className="text-center text-red-500 col-span-full">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No posts found. Try another keyword or category.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <PostCard
                post={post}
                onDelete={() => handleDelete(post._id)}
                deleting={deleting === post._id}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 🌈 Floating Buttons */}
      <Link
        href="/create"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all"
      >
        <Plus size={26} />
      </Link>

      {showTop && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 bg-gray-200 dark:bg-gray-800 p-3 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowUpCircle size={26} className="text-indigo-600 dark:text-indigo-400" />
        </motion.button>
      )}

      {/* 🧿 Footer */}
      <footer className="mt-20 py-8 text-center border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
        <div className="flex justify-center gap-6 mb-3">
          <a href="#" className="hover:text-indigo-500"><Twitter /></a>
          <a href="#" className="hover:text-indigo-500"><Github /></a>
          <a href="#" className="hover:text-indigo-500"><Instagram /></a>
        </div>
        © {new Date().getFullYear()} <strong>Minimal Blog</strong> · Designed by{" "}
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Abdullah Siddiqui
        </span>
      </footer>
    </div>
  );
}
