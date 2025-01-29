"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, isDragging, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: { task },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-200 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute rounded-lg top-0 left-0 w-full h-4 cursor-move bg-gray-100 flex items-center justify-center py-1"
      >
        <span className="text-gray-500 text-sm">☰</span>
      </div>

      {/* /seperate body */}
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[1.1rem] text-gray-800 pt-4">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-400 hover:text-red-700 z-20 relative mt-4 text-[2rem]"
            style={{ pointerEvents: "auto" }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
