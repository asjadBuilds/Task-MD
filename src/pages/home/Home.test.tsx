
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./Home";

describe("TaskDashboard Integration Tests", () => {
  it("allows user to add, edit, and delete a task", async () => {
    render(<Home />);
    const user = userEvent.setup();

    // Add task
    await user.click(screen.getByText(/Add New Task/i));
    await user.type(screen.getByLabelText(/Title/i), "My Task");
    await user.type(screen.getByLabelText(/Description/i), "Task details");
    await user.selectOptions(screen.getByLabelText(/Priority/i), "high");
    await user.click(screen.getByText(/Add Task/i));

    expect(await screen.findByText("My Task")).toBeInTheDocument();

    // Edit task
    await user.click(screen.getByTitle("Edit task"));
    const titleInput = screen.getByPlaceholderText(/Task title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task");
    await user.click(screen.getByText(/Save/i));

    expect(await screen.findByText("Updated Task")).toBeInTheDocument();

    // Delete task
    await user.click(screen.getByTitle("Delete task"));
    expect(screen.queryByText("Updated Task")).not.toBeInTheDocument();
  });

  it("validates form input before adding task", async () => {
    render(<Home />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/Add New Task/i));
    await user.click(screen.getByText(/Add Task/i)); // submit without typing

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
  });

  it("filters tasks by status", async () => {
    render(<Home />);
    const user = userEvent.setup();

    // Add one task
    await user.click(screen.getByText(/Add New Task/i));
    await user.type(screen.getByLabelText(/Title/i), "Task A");
    await user.click(screen.getByText(/Add Task/i));

    // Toggle status to completed
    await user.click(screen.getByTitle(/Click to change status/i));

    await user.selectOptions(screen.getByLabelText(/Filter Tasks/i), "Completed");

    expect(await screen.findByText("Task A")).toBeInTheDocument();
  });

  it("searches tasks in real-time", async () => {
    render(<Home />);
    const user = userEvent.setup();

    // Add multiple tasks
    await user.click(screen.getByText(/Add New Task/i));
    await user.type(screen.getByLabelText(/Title/i), "Buy Milk");
    await user.click(screen.getByText(/Add Task/i));

    await user.click(screen.getByText(/Add New Task/i));
    await user.type(screen.getByLabelText(/Title/i), "Do Laundry");
    await user.click(screen.getByText(/Add Task/i));

    // Search
    const searchInput = screen.getByPlaceholderText(/Search tasks/i);
    await user.type(searchInput, "Milk");

    expect(screen.getByText("Buy Milk")).toBeInTheDocument();
    expect(screen.queryByText("Do Laundry")).not.toBeInTheDocument();
  });
});
