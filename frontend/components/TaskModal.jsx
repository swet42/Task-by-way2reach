"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const TITLE_MAX = 100;
  const DESC_MAX = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title cannot be empty or whitespace only.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (title.trim().length > TITLE_MAX) {
      setError(`Title cannot exceed ${TITLE_MAX} characters.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSave({ title: title.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <span className={`text-xs ${title.length > TITLE_MAX ? "text-red-500" : "text-gray-400"}`}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="Enter task title"
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${
                title.length > 0 && title.trim().length < 3 ? "border-red-300" : "border-gray-200"
              }`}
              required
            />
            {title.length > 0 && title.trim().length < 3 && (
              <p className="text-xs text-red-400 mt-1">Minimum 3 characters required.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <span className={`text-xs ${description.length > DESC_MAX ? "text-red-500" : "text-gray-400"}`}>
                {description.length}/{DESC_MAX}
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              placeholder="Optional description"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {loading ? "Saving…" : task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
