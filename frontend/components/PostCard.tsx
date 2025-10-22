"use client";
import Link from "next/link";

export default function PostCard({ post, onDelete }: any) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow hover:shadow-md transition border border-gray-200 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{post.title}</h2>
      <p className="text-gray-700 dark:text-gray-300 mt-2">{post.content}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        By <strong>{post.author}</strong> on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="flex gap-2 mt-2">
        <Link href={`/edit/${post._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
          Edit
        </Link>
        <button
          onClick={() => onDelete(post._id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
