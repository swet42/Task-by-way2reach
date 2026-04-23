"use client";
import { Pencil, Trash2, MessageSquare } from "lucide-react";

export default function TaskCard({ task, onEdit, onDelete, onComments, selected, onSelect }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition ${selected ? "border-indigo-400 ring-2 ring-indigo-100" : "border-gray-100"}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(task._id)}
          className="mt-1 h-4 w-4 accent-indigo-600 cursor-pointer shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 leading-snug">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        {new Date(task.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        })}
      </p>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
        <button
          onClick={() => onComments(task)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
        >
          <MessageSquare size={13} /> Comments
        </button>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
