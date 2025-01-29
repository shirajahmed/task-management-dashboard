"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskColumn from "./components/TaskColumn";
import TaskCard from "./components/TaskCard";
import AddTaskModal from "./components/AddTaskModal";
import { handleApiRequest } from "./lib/api";

const STATUSES = ["To Do", "In Progress", "Done"];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("selectedTask", selectedTask);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    handleApiRequest(
      () => fetch("https://dummydata-9wt5.onrender.com/tasks"),
      (data) => setTasks(data),
      (error) => toast("Error fetching tasks:", error),
      setIsLoading
    );
  };

  const handleDragStart = (event) => {
    const task = tasks.find((task) => task.id === event.active.id);
    setActiveTask(task);
  };

  const handleDelete = async (taskId) => {
    handleApiRequest(
      () =>
        fetch(`https://dummydata-9wt5.onrender.com/tasks/${taskId}`, {
          method: "DELETE",
        }),
      () => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setSelectedTask(null);
      },
      (error) => toast("Error deleting task:", error),
      setIsLoading
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeStatus = active.data.current?.sortable.containerId;
    const overStatus = over.data.current?.sortable.containerId || over.id;

    if (activeStatus !== overStatus) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === active.id) {
          return { ...task, status: overStatus };
        }
        return task;
      });
      setTasks(updatedTasks);

      try {
        const updatedTask = updatedTasks.find((task) => task.id === active.id);
        await fetch(`https://dummydata-9wt5.onrender.com/tasks/${active.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white-800">
          Task Management Dashboard
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg"
        >
          Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onDelete={(taskId) => setSelectedTask(taskId)}
            />
          ))}

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskAdded={fetchTasks}
        />
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50 items-center justify-center">
          <div className="bg-[#131517] p-6 rounded-lg">
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-white-400 hover:text-gray-400"
                onClick={() => setSelectedTask(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => handleDelete(selectedTask)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-[#303030] bg-opacity-50 flex items-center justify-center z-100">
          <div className="w-16 h-16 border-4 border-t-[#fff] border-[#000] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
