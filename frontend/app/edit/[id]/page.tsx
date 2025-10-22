"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Edit3,
  User,
  FileText,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/posts";

// Reusable InputField
interface InputProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  rows?: number;
  onChange: (val: string) => void;
}

const InputField: React.FC<InputProps> = ({
  id,
  label,
  icon,
  value,
  placeholder,
  required = false,
  type = "text",
  rows,
  onChange,
}) => (
  <div className="flex flex-col space-y-2">
    <label
      htmlFor={id}
      className="text-gray-700 dark:text-gray-300 font-semibold tracking-wide flex items-center gap-2"
    >
      {icon}
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        rows={rows || 4}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm 
          bg-white/80 dark:bg-gray-800/60 backdrop-blur-md 
          focus:outline-none focus:ring-2 focus:ring-yellow-500 
          focus:border-yellow-500 transition resize-none"
      />
    ) : (
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm 
          bg-white/80 dark:bg-gray-800/60 backdrop-blur-md 
          focus:outline-none focus:ring-2 focus:ring-yellow-500 
          focus:border-yellow-500 transition"
      />
    )}
  </div>
);

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post data");
        const data = await res.json();
        setPost({
          title: data.title,
          content: data.content,
          author: data.author || "",
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to update post");
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-yellow-500 w-8 h-8 mb-3" />
        <p className="text-gray-500 dark:text-gray-300">Loading post...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 flex flex-col items-center justify-center px-6 py-12">
      {/* Header / Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex items-center justify-between mb-8"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 bg-yellow-100 dark:bg-gray-800 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition"
        >
          {preview ? (
            <>
              <EyeOff className="w-4 h-4" /> Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Preview
            </>
          )}
        </button>
      </motion.div>

      {/* Main Editor Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-4xl font-extrabold text-center text-yellow-600 dark:text-yellow-400 mb-8 tracking-tight flex items-center justify-center gap-3">
          <Edit3 className="w-7 h-7" /> Edit Your Post
        </h1>

        {/* Error / Success Messages */}
        {error && (
          <p className="mb-4 text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/30 py-2 rounded-lg">
            {error}
          </p>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mb-4 text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 py-2 rounded-lg"
          >
            <CheckCircle2 className="mr-2" /> Post updated successfully!
          </motion.div>
        )}

        {/* Form / Preview Mode */}
        {preview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose dark:prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold mb-4 text-yellow-700 dark:text-yellow-400">
              {post.title || "Untitled Post"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content || "Start writing something amazing..."}
            </p>
            <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-500" />
              {post.author || "Anonymous"}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="title"
              label="Title"
              icon={<FileText className="text-yellow-500 w-4 h-4" />}
              value={post.title}
              placeholder="Enter post title..."
              required
              onChange={(val) => setPost({ ...post, title: val })}
            />

            <InputField
              id="content"
              label="Content"
              icon={<Edit3 className="text-yellow-500 w-4 h-4" />}
              value={post.content}
              placeholder="Write your post content..."
              type="textarea"
              rows={6}
              required
              onChange={(val) => setPost({ ...post, content: val })}
            />

            <InputField
              id="author"
              label="Author"
              icon={<User className="text-yellow-500 w-4 h-4" />}
              value={post.author}
              placeholder="Your name (optional)"
              onChange={(val) => setPost({ ...post, author: val })}
            />

            {/* Save Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={updating}
              className={`w-full flex justify-center items-center gap-3 py-4 text-lg font-semibold rounded-xl 
                bg-yellow-600 text-white shadow-lg shadow-yellow-500/30 
                hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 
                dark:focus:ring-yellow-500 transition-all ${
                  updating ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Update Post
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
