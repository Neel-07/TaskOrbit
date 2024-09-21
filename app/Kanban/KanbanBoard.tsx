"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "../components/TaskItem/TaskItem"; // Assuming TaskItem remains unchanged
import { Task } from "@/app/utils/types";

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState({
    incomplete: [] as Task[],
    inProgress: [] as Task[],
    completed: [] as Task[],
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', date: '' });

  useEffect(() => {
    const newColumns = {
      incomplete: tasks.filter((task) => !task.completed && !task.important),
      inProgress: tasks.filter((task) => !task.completed && task.important),
      completed: tasks.filter((task) => task.completed),
    };
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const start = columns[source.droppableId as keyof typeof columns];
    const finish = columns[destination.droppableId as keyof typeof columns];

    // Handle reordering within the same column
    if (start === finish) {
        const newTasks = Array.from(start);
        const [reorderedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedTask);
        setColumns((prev) => ({ ...prev, [source.droppableId]: newTasks }));
    } else {
        // Handle moving between columns
        const startTasks = Array.from(start);
        const [movedTask] = startTasks.splice(source.index, 1);

        // Mark the task as completed or important based on the destination column
        if (destination.droppableId === "completed") {
            movedTask.completed = true; // Update the completion status
            movedTask.important = false; // Reset important status
        } else if (destination.droppableId === "inProgress") {
            movedTask.completed = false; // Ensure it's not marked as completed
            movedTask.important = true; // Mark it as important for in-progress
        } else {
            movedTask.completed = false; // Ensure it's not marked as completed if moved back
            movedTask.important = false; // Reset important status for "To Do"
        }

        const finishTasks = Array.from(finish);
        finishTasks.splice(destination.index, 0, movedTask);

        setColumns({
            ...columns,
            [source.droppableId]: startTasks,
            [destination.droppableId]: finishTasks,
        });

        // Update the tasks state to reflect the changes
        setTasks((prevTasks) => {
            return prevTasks.map(task => 
                task.id === movedTask.id ? movedTask : task
            );
        });
    }
};



  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.description && newTask.date) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        createdAt: new Date(newTask.date),
        completed: false,
        important: false,
      };
      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTask({ title: '', description: '', date: '' });
      setIsCreatingTask(false);
    }
  };

  return (
    <div className={`p-4 ${isCreatingTask ? 'overflow-hidden' : ''}`}>
      {isCreatingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center backdrop-blur-sm">
          <form onSubmit={addTask} className="bg-gray-800 p-4 rounded-lg shadow-md z-20 w-1/3">
            <h2 className="text-xl flex justify-center align-center font-bold mb-2 text-white">Create a New Task</h2>
            <div className="mb-2">
              <label className="block mb-1 text-white" htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task Title"
                className="border border-gray-600 p-2 w-full rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                placeholder="Task Description"
                className="border border-gray-600 p-2 w-full rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 text-white" htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="border border-gray-600 p-2 w-full rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mr-2">
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingTask(false)}
                className="bg-red-500 text-white rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreatingTask((prev) => !prev)}
          className="bg-green-500 text-white rounded px-4 py-2"
        >
          {isCreatingTask ? "Cancel" : "Add New Task"}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <div key={columnId} className="flex-1">
              <h2 className="text-lg font-semibold mb-2 text-white">
                {columnId === "incomplete"
                  ? "To Do"
                  : columnId === "inProgress"
                  ? "In Progress"
                  : "Completed"}
              </h2>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white p-4 rounded-lg min-h-[500px]"
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 bg-gray-700 text-white shadow-md rounded-lg p-2"
                          >
                            <TaskItem
                              title={task.title}
                              description={task.description}
                              date={task.createdAt.toString()}
                              isCompleted={task.completed}
                              id={task.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
