"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/posts";

// 🔹 Reusable Input Component
interface InputProps {
  id: string;
  label: string;
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
      className="text-gray-700 dark:text-gray-300 font-semibold tracking-wide"
    >
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

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author }),
      });

      if (!res.ok) throw new Error("Failed to create post");
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 px-6 py-12">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl flex items-center mb-8"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </motion.div>

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-4xl font-extrabold text-center text-yellow-600 dark:text-yellow-400 mb-8 tracking-tight">
          📝 Create a New Post
        </h1>

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
            <CheckCircle2 className="mr-2" /> Post created successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="title"
            label="Title"
            value={title}
            placeholder="Enter post title..."
            required
            onChange={setTitle}
          />

          <InputField
            id="content"
            label="Content"
            value={content}
            placeholder="Write your post content..."
            type="textarea"
            rows={6}
            required
            onChange={setContent}
          />

          <InputField
            id="author"
            label="Author"
            value={author}
            placeholder="Your name (optional)"
            onChange={setAuthor}
          />

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={creating}
            className={`w-full flex justify-center items-center gap-3 py-4 text-lg font-semibold rounded-xl 
              bg-yellow-600 text-white shadow-lg shadow-yellow-500/30 
              hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 
              dark:focus:ring-yellow-500 transition-all ${
                creating ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {creating ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Create Post
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
