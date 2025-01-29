"use client";
import { useState } from "react";
import { handleApiRequest } from "../lib/api";

export default function AddTaskModal({ onClose, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    handleApiRequest(
      () =>
        fetch("https://dummydata-9wt5.onrender.com/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status }),
        }),
      () => {
        onTaskAdded();
        onClose();
      },
      (error) => toast("Error creating task:", error),
      setIsLoading
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#131517] p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-[#e5e7eb] text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded bg-[#e5e7eb] text-black"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded bg-[#e5e7eb] text-black"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white-400 hover:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-gray-200 text-black rounded-lg "
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-[#303030] bg-opacity-50 flex items-center justify-center z-100">
          <div className="w-16 h-16 border-4 border-t-[#fff] border-[#000] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
