"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/posts";

// Reusable Input Component
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
  id, label, value, placeholder, required = false, type = "text", rows, onChange,
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="mb-2 text-gray-700 dark:text-gray-300 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows || 4}
        className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-gray-100 transition resize-none"
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-gray-100 transition"
      />
    )}
  </div>
);

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams();

  // States
  const [post, setPost] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post data");
        const data = await res.json();
        setPost({ title: data.title, content: data.content, author: data.author || "" });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Update post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to update post");
      setSuccess("Post updated successfully!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading post...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-yellow-600 dark:text-yellow-400 mb-6 sm:mb-8">
          Edit Post
        </h1>

        {error && <p className="mb-4 text-red-500 font-medium text-center">{error}</p>}
        {success && <p className="mb-4 text-green-500 font-medium text-center">{success}</p>}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <InputField
            id="title"
            label="Title"
            placeholder="Enter post title"
            value={post.title}
            required
            onChange={(val) => setPost({ ...post, title: val })}
          />

          <InputField
            id="content"
            label="Content"
            placeholder="Write your post content..."
            type="textarea"
            rows={6}
            value={post.content}
            required
            onChange={(val) => setPost({ ...post, content: val })}
          />

          <InputField
            id="author"
            label="Author"
            placeholder="Optional"
            value={post.author}
            onChange={(val) => setPost({ ...post, author: val })}
          />

          <button
            type="submit"
            disabled={updating}
            className={`w-full py-4 bg-yellow-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-500 transition transform hover:scale-[1.02] ${
              updating ? "opacity-60 cursor-not-allowed" : "hover:bg-yellow-700"
            }`}
          >
            {updating ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
