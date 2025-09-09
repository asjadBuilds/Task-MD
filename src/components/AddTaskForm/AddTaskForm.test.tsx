
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import AddTaskForm from "./AddTaskForm";

describe("AddTaskForm Component", () => {
  const mockAddTask = jest.fn();

  const setup = () => mount(<AddTaskForm onAddTask={mockAddTask} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders only Add New Task button initially", () => {
    const wrapper = setup();
    expect(wrapper.find(".btn-add-task").exists()).toBe(true);
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("shows form when Add New Task button is clicked", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("validates required title field", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    wrapper.find("form").simulate("submit", { preventDefault: jest.fn() });
    expect(wrapper.find(".error-message").at(0).text()).toContain("Title is required");
  });

  it("validates title minimum length", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    wrapper.find("#title").simulate("change", { target: { value: "Hi" } });
    wrapper.find("form").simulate("submit", { preventDefault: jest.fn() });
    expect(wrapper.find(".error-message").at(0).text()).toContain("at least 3 characters");
  });

  it("validates description max length", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    const longDesc = "a".repeat(201);
    wrapper.find("#description").simulate("change", { target: { value: longDesc } });
    wrapper.find("form").simulate("submit", { preventDefault: jest.fn() });
    expect(wrapper.find(".error-message").at(0).text()).toContain("less than 200 characters");
  });

  it("calls onAddTask with correct data on valid submit", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");

    wrapper.find("#title").simulate("change", { target: { value: "New Task" } });
    wrapper.find("#description").simulate("change", { target: { value: "Details" } });
    wrapper.find("#priority").simulate("change", { target: { value: "high" } });

    wrapper.find("form").simulate("submit", { preventDefault: jest.fn() });

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "Details",
      priority: "high",
    });
  });

  it("resets form and hides after successful submit", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");

    wrapper.find("#title").simulate("change", { target: { value: "Another Task" } });
    wrapper.find("form").simulate("submit", { preventDefault: jest.fn() });

    expect(wrapper.find(".btn-add-task").exists()).toBe(true); // form closed
  });

  it("cancels form when Cancel button is clicked", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    wrapper.find("button.btn-secondary").simulate("click");
    expect(wrapper.find(".btn-add-task").exists()).toBe(true);
  });

  it("matches snapshot", () => {
    const wrapper = setup();
    wrapper.find(".btn-add-task").simulate("click");
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("matches snapshot in collapsed state (only Add button)", () => {
  const wrapper = setup();
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("matches snapshot in expanded form state", () => {
  const wrapper = setup();
  wrapper.find(".btn-add-task").simulate("click");
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("matches snapshot with validation error shown", () => {
  const wrapper = setup();
  wrapper.find(".btn-add-task").simulate("click");
  wrapper.find("form").simulate("submit", { preventDefault: jest.fn() }); // empty title
  expect(toJson(wrapper)).toMatchSnapshot();
});

it("matches snapshot while submitting", () => {
  const wrapper = setup();
  wrapper.find(".btn-add-task").simulate("click");

  // manually set isSubmitting state
  wrapper.setState({ isSubmitting: true });

  expect(toJson(wrapper)).toMatchSnapshot();
});

});
