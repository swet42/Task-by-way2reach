"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Download, X } from "lucide-react";
import * as XLSX from "xlsx";
import { taskApi, commentApi } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import CommentsPanel from "@/components/CommentsPanel";
import Pagination from "@/components/Pagination";

const LIMIT = 6;

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modalTask, setModalTask] = useState(undefined);
  const [commentTask, setCommentTask] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchTasks = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await taskApi.list(p, LIMIT);
      setTasks(res.data.data.data);
      setTotal(res.data.data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handleSave = async (data) => {
    if (modalTask) {
      await taskApi.update(modalTask._id, data);
    } else {
      await taskApi.create(data);
    }
    fetchTasks(1);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    await taskApi.delete(id);
    fetchTasks(page);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase());

    const created = new Date(t.createdAt);
    const matchFrom = !dateFrom || created >= new Date(dateFrom);
    const matchTo = !dateTo || created <= new Date(dateTo + "T23:59:59");

    return matchSearch && matchFrom && matchTo;
  });

  const allSelected =
    filteredTasks.length > 0 && filteredTasks.every((t) => selectedIds.has(t._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t._id)));
    }
  };

  const handleExport = async () => {
    const exportTasks =
      selectedIds.size > 0
        ? filteredTasks.filter((t) => selectedIds.has(t._id))
        : filteredTasks;

    setExporting(true);
    try {
      const commentResults = await Promise.all(
        exportTasks.map((t) =>
          commentApi.list(t._id, 1, 500).then((r) => r.data.data.data).catch(() => [])
        )
      );

      const taskRows = exportTasks.map((t, i) => ({
        Title: t.title,
        Description: t.description || "",
        "Comments Count": commentResults[i].length,
        "Created At": new Date(t.createdAt).toLocaleString(),
        "Updated At": new Date(t.updatedAt).toLocaleString(),
      }));

      const commentRows = exportTasks.flatMap((t, i) =>
        commentResults[i].map((c) => ({
          "Task Title": t.title,
          Comment: c.text,
          "Commented At": new Date(c.createdAt).toLocaleString(),
        }))
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taskRows), "Tasks");
      if (commentRows.length > 0) {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(commentRows), "Comments");
      }
      XLSX.writeFile(wb, "tasks.xlsx");
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleDateFromChange = (val) => {
    if (dateTo && val > dateTo) return;
    setDateFrom(val);
  };

  const handleDateToChange = (val) => {
    if (val > today) return;
    if (dateFrom && val < dateFrom) return;
    setDateTo(val);
  };

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  const hasFilters = !!(search || dateFrom || dateTo);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-indigo-600 shrink-0">Task Manager</h1>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 disabled:opacity-60"
            >
              <Download size={14} />
              {exporting ? "Exporting…" : selectedIds.size > 0 ? `Export (${selectedIds.size})` : "Export All"}
            </button>
            <button
              onClick={() => setModalTask(null)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={15} /> New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={dateFrom}
              max={dateTo || today}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              title="From date"
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={today}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              title="To date"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-36 animate-pulse" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-1">
              {hasFilters ? "Try clearing your filters." : "Create your first task!"}
            </p>
          </div>
        ) : (
          <>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 accent-indigo-600 cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
            </span>
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setModalTask}
                onDelete={handleDelete}
                onComments={setCommentTask}
                selected={selectedIds.has(task._id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
          </>
        )}

        {!hasFilters && (
          <Pagination page={page} total={total} limit={LIMIT} onChange={fetchTasks} />
        )}
      </main>

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSave={handleSave}
        />
      )}

      {commentTask && (
        <CommentsPanel task={commentTask} onClose={() => setCommentTask(null)} />
      )}
    </div>
  );
}
