import type { Task } from "../hooks/useTaskManager";

export function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: Date.now().toString(),
    title: "Default Task",
    description: "Default description",
    priority: "medium",
    status: "pending",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
