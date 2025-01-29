"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, tasks, onDelete }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="bg-[#131517] border border-[#242526] rounded-lg   shadow-sm">
      <h2 className="text-lg font-semibold mb-4 border-b-2 border-[#32383e] p-3 text-white-700">
        {status}
      </h2>
      <SortableContext
        id={status}
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
