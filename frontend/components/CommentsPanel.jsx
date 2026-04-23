"use client";
import { useState, useEffect, useCallback } from "react";
import { X, Send, Trash2, MessageSquare, Pencil, Check, Ban } from "lucide-react";
import { commentApi } from "@/lib/api";

export default function CommentsPanel({ task, onClose }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await commentApi.list(task._id, p, 10);
      setComments(res.data.data.data);
      setTotal(res.data.data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [task._id]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await commentApi.add(task._id, text.trim());
      setText("");
      fetchComments(1);
    } catch {
      setError("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentApi.delete(task._id, commentId);
      fetchComments(page);
    } catch {
      setError("Failed to delete comment.");
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await commentApi.update(task._id, commentId, editText.trim());
      cancelEdit();
      fetchComments(page);
    } catch {
      setError("Failed to update comment.");
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <div>
              <p className="font-semibold text-sm leading-tight">{task.title}</p>
              <p className="text-xs text-gray-400">{total} comment{total !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-400 text-center mt-8">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="group flex gap-3 items-start">
                <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                  {editingId === c._id ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value.slice(0, 1000))}
                        rows={2}
                        className="w-full text-sm border border-indigo-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                        autoFocus
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{editText.length}/1000</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdate(c._id)}
                            disabled={!editText.trim()}
                            className="p-1 rounded hover:bg-indigo-50 text-indigo-500 disabled:opacity-40 transition"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 transition"
                          >
                            <Ban size={14} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800">{c.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {c.updatedAt !== c.createdAt
                          ? <>edited {new Date(c.updatedAt).toLocaleString()}</>
                          : new Date(c.createdAt).toLocaleString()
                        }
                      </p>
                    </>
                  )}
                </div>
                {editingId !== c._id && (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 mt-1 transition">
                    <button
                      onClick={() => startEdit(c)}
                      className="p-1 rounded hover:bg-indigo-50 text-indigo-400 transition"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1 rounded hover:bg-red-50 text-red-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 px-5 py-2 border-t">
            <button
              disabled={page === 1}
              onClick={() => fetchComments(page - 1)}
              className="text-xs px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500 self-center">{page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => fetchComments(page + 1)}
              className="text-xs px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

        {error && (
          <p className="px-5 py-2 text-xs text-red-500 bg-red-50 border-t">{error}</p>
        )}
        <form onSubmit={handleAdd} className="px-5 py-4 border-t">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1000))}
              placeholder="Write a comment…"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send size={16} />
            </button>
          </div>
          {text.length > 0 && (
            <p className={`text-xs mt-1 text-right ${
              text.length >= 1000 ? "text-red-500" : "text-gray-400"
            }`}>
              {text.length}/1000
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
