"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getTasks, updateTask, deleteTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";
import TaskCard from "@/components/TaskCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getCurrentUser } from "@/lib/auth";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = typeof window !== "undefined" ? getCurrentUser() : null;
  const userRole = user?.role || "";

  useEffect(() => {
    Promise.all([getTasks(), getProjects()])
      .then(([taskRes, projectRes]) => {
        setTasks(taskRes.data.data);
        setProjects(projectRes.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tasks or projects.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  const handleUpdate = (id) => {
    router.push(`/dashboard/tasks/edit/${id}`);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    let newStatus;
    switch (destination.droppableId) {
      case "Todo":
        newStatus = "PENDING";
        break;
      case "In Progress":
        newStatus = "IN_PROGRESS";
        break;
      case "Done":
        newStatus = "COMPLETED";
        break;
      default:
        return;
    }

    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update task status.");
    }
  };

  const columns = {
    Todo: tasks.filter((t) => t.status === "PENDING"),
    "In Progress": tasks.filter((t) => t.status === "IN_PROGRESS"),
    Done: tasks.filter((t) => t.status === "COMPLETED"),
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

        <button
          onClick={() => router.push("/dashboard/tasks/add")}
          className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition shadow self-start"
        >
          Add Task
        </button>

        {loading && <p className="text-gray-500">Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 mt-4 w-full overflow-x-auto">
              {["Todo", "In Progress", "Done"].map((columnId) => (
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white rounded-2xl border border-gray-300 p-4 w-1/3 min-h-[400px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    >
                      <h2 className="text-xl font-semibold mb-4 text-white bg-gray-900 rounded-t-xl p-2 text-center">
                        {columnId}
                      </h2>

                      {columns[columnId].map((task, index) => (
                        <Draggable
                          draggableId={task.id.toString()}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <TaskCard
                              task={task}
                              onDelete={
                                userRole === "SUPER_ADMIN" ? handleDelete : null
                              }
                              onUpdate={
                                ["ADMIN", "SUPER_ADMIN"].includes(userRole)
                                  ? handleUpdate
                                  : null
                              }
                              isDraggable
                              provided={provided}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </DashboardLayout>
  );
}
