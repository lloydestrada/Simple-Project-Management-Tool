"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getTasks, updateTask, deleteTask } from "@/app/services/taskService";
import { getProjects } from "@/app/services/projectService";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      await deleteTask(id); // use service
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };


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

  // Organize tasks into columns
  const columns = {
    Todo: tasks.filter((t) => t.status === "PENDING"),
    "In Progress": tasks.filter((t) => t.status === "IN_PROGRESS"),
    Done: tasks.filter((t) => t.status === "COMPLETED"),
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);

    // Map columnId to backend status
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
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update task status.");
    }
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
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-4 mb-3 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-800">
                                  {task.name}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-white text-xs ${getStatusClass(
                                    task.status
                                  )}`}
                                >
                                  {getStatusLabel(task.status)}
                                </span>
                              </div>

                              <p className="text-gray-700 text-sm mb-2">
                                {task.contents}
                              </p>

                              <p className="text-gray-700 text-xs mb-2">
                                Project:{" "}
                                <span className="font-medium">
                                  {task.project ? task.project.name : "Unknown"}
                                </span>
                              </p>

                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/tasks/edit/${task.id}`
                                    )
                                  }
                                  className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition shadow text-xs"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
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
