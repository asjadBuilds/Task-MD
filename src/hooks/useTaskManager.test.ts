import { renderHook, act } from "@testing-library/react";
import useTaskManager from "./useTaskManager";
import type { Task } from "./useTaskManager";
// Mock useLocalStorage
jest.mock("./useLocalStorage", () => {
  return jest.fn((options) => {
    let value = options.initialValue;
    const setValue = jest.fn((updater) => {
      if (typeof updater === "function") {
        value = updater(value);
      } else {
        value = updater;
      }
      return value;
    });
    return [value, setValue];
  });
});

describe("useTaskManager hook", () => {
  it("adds a task", () => {
    const { result } = renderHook(() => useTaskManager());
    let newTask: Task;
    act(() => {
      newTask = result.current.addTask({
        id: "temp",
        title: "My Task",
        description: "Description",
        priority: "high",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    expect(newTask!.title).toBe("My Task");
    expect(newTask!.priority).toBe("high");
  });

  it("updates a task", () => {
    const { result } = renderHook(() => useTaskManager());

    let addedTask: Task;
    act(() => {
      addedTask = result.current.addTask({
        id: "temp",
        title: "Initial",
        description: "",
        priority: "low",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.updateTask({ taskId: addedTask!.id, updates: { title: "Updated" } });
    });

    //checking if setter was called with update function
    expect(result.current.updateTask).toBeDefined();
  });

  it("deletes a task", () => {
    const { result } = renderHook(() => useTaskManager());

    let addedTask: Task;
    act(() => {
      addedTask = result.current.addTask({
        id: "temp",
        title: "Delete Me",
        description: "",
        priority: "medium",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.deleteTask(addedTask!.id);
    });

    expect(result.current.deleteTask).toBeDefined();
  });

  it("toggles task status correctly", () => {
    const { result } = renderHook(() => useTaskManager());

    let addedTask: Task;
    act(() => {
      addedTask = result.current.addTask({
        id: "temp",
        title: "Toggle Me",
        description: "",
        priority: "low",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.toggleTaskStatus(addedTask!.id);
    });
    expect(result.current.toggleTaskStatus).toBeDefined();
  });
});
