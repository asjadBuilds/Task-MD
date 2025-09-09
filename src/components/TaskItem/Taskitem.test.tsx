
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import TaskItem from "./TaskItem";
import type { Task } from "../../hooks/useTaskManager";

describe("TaskItem Component", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Some description",
    priority: "high",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockToggle = jest.fn();

  const setup = (taskOverrides = {}) =>
    mount(
      <TaskItem
        task={{ ...mockTask, ...taskOverrides }}
        onUpdate={mockUpdate}
        onDelete={mockDelete}
        onToggleStatus={mockToggle}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders task details correctly", () => {
    const wrapper = setup();
    expect(wrapper.find(".task-title").text()).toBe("Test Task");
    expect(wrapper.find(".task-description").text()).toBe("Some description");
    expect(wrapper.find(".priority-badge").text()).toBe("HIGH");
  });

  it("enters edit mode when Edit button is clicked", () => {
    const wrapper = setup();
    wrapper.find("button[title='Edit task']").simulate("click");
    expect(wrapper.find(".edit-form").exists()).toBe(true);
  });

  it("saves changes and calls onUpdate when Save is clicked", () => {
    const wrapper = setup();
    wrapper.find("button[title='Edit task']").simulate("click");

    wrapper.find("input").simulate("change", {
      target: { value: "Updated Title" },
    });

    wrapper.find("button.btn-primary").simulate("click"); // Save
    expect(mockUpdate).toHaveBeenCalledWith({
      taskId: "1",
      updates: expect.objectContaining({ title: "Updated Title" }),
    });
  });

  it("cancels edit mode and resets changes", () => {
    const wrapper = setup();
    wrapper.find("button[title='Edit task']").simulate("click");

    wrapper.find("input").simulate("change", {
      target: { value: "Wrong Title" },
    });

    wrapper.find("button.btn-secondary").simulate("click"); // Cancel
    expect(wrapper.find(".edit-form").exists()).toBe(false);
    expect(wrapper.find(".task-title").text()).toBe("Test Task"); // original
  });

  it("calls onDelete when Delete button is clicked", () => {
    const wrapper = setup();
    wrapper.find("button[title='Delete task']").simulate("click");
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("calls onToggleStatus when status button is clicked", () => {
    const wrapper = setup();
    wrapper.find(".status-button").simulate("click");
    expect(mockToggle).toHaveBeenCalledWith("1");
  });

  it("matches snapshot", () => {
    const wrapper = setup();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("matches snapshot with pending status and high priority", () => {
    const wrapper = setup({ priority: "high", status: "pending" });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  
  it("matches snapshot with in-progress status and medium priority", () => {
    const wrapper = setup({ priority: "medium", status: "in-progress" });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  
  it("matches snapshot with completed status and low priority", () => {
    const wrapper = setup({ priority: "low", status: "completed" });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  
  it("matches snapshot when in edit mode", () => {
    const wrapper = setup();
    wrapper.find("button[title='Edit task']").simulate("click");
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

