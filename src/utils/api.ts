// api.ts
export async function fetchTasks() {
  return fetch("/api/tasks").then(res => res.json());
}

// api.test.ts
import * as api from "./api";

jest.spyOn(api, "fetchTasks").mockResolvedValue([
  { id: "1", title: "Mocked Task" }
]);

test("fetchTasks returns mocked tasks", async () => {
  const tasks = await api.fetchTasks();
  expect(tasks[0].title).toBe("Mocked Task");
});
