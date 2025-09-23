"use client";

import React from "react";

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  isDraggable,
  provided,
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Todo";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div
      ref={provided?.innerRef}
      {...(provided ? provided.draggableProps : {})}
      {...(provided ? provided.dragHandleProps : {})}
      className="bg-gray-50 p-4 mb-3 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
    >
      {/* Task Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-800">{task.name}</span>
        <span
          className={`px-2 py-1 rounded-full text-white text-xs ${getStatusClass(
            task.status
          )}`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Task Contents */}
      <p className="text-gray-700 text-sm mb-2">{task.contents}</p>

      {/* Project Name */}
      <p className="text-gray-700 text-xs mb-2">
        Project:{" "}
        <span className="font-medium">
          {task.project ? task.project.name : "Unknown"}
        </span>
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onUpdate && (
          <button
            onClick={() => onUpdate(task.id)}
            className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow text-xs"
          >
            Update
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow text-xs"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
