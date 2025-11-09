import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "../utils/auth-client";
import { useTasks } from "../hooks/useTasks";
import { useAddTask } from "../hooks/useAddTask";
import { FormEvent } from "react";
import { useToggleTask } from "../hooks/useToggleTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { Card, CardHeader, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Spinner } from "@repo/ui/spinner";
import { useEditTask } from "../hooks/useEditTask";
import { EditableTaskTitle } from "../components/EditableTaskTitle";
import Header from "../components/Header";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: session } = useSession();
  return session ? <TodoApp /> : <Landing />;
}

function Landing() {
  return (
    <div className="min-h-screen  flex items-center justify-center pt-20 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="text-center px-4 max-w-md">
        <div className="mb-6 inline-block p-4 bg-blue-600 rounded-2xl shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Todo App</h1>
        <p className="text-gray-600 mb-8">
          Simple and elegant way to organize your tasks
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link
            to="/login"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all hover:shadow-lg"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full px-6 py-3 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function TodoApp() {
  const { data: tasks, isLoading } = useTasks();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title");
    if (typeof title === "string" && title.trim().length > 0) {
      addTask.mutate(form.get("title") as string);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="w-full min-h-screen flex pt-20 items-center justify-center p-6">
      <Header />
      <Card className="w-88 shadow-sm border">
        <CardHeader>
          <h1 className="text-lg font-semibold">My Tasks</h1>
        </CardHeader>

        <CardContent className="space-y-4 w-full">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              name="title"
              placeholder="Enter task..."
              className="flex-1"
            />
            <Button type="submit" disabled={addTask.isPending}>
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {tasks?.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center gap-2 p-2 rounded-md hover:bg-accent transition"
                >
                  <div className="flex gap-2 items-center">
                    {toggleTask.isPending ? (
                      <Spinner size={18} />
                    ) : (
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask.mutate(task.id)}
                        disabled={toggleTask.isPending}
                      />
                    )}

                    <EditableTaskTitle
                      id={task.id}
                      title={task.title}
                      completed={task.completed}
                      onSave={(newTitle) =>
                        editTask.mutate({ id: task.id, title: newTitle })
                      }
                      loading={editTask.loadingIds.has(task.id)}
                    />
                  </div>

                  {deleteTask.loadingIds.has(task.id) ? (
                    <Spinner size={15} />
                  ) : (
                    <svg
                      onClick={() =>
                        confirm("Are you sure to delete?") &&
                        deleteTask.mutate(task.id)
                      }
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-trash text-red-700 cursor-pointer hover:text-red-600"
                      viewBox="0 0 18 18"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
