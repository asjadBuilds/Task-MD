import AddTaskForm from '../../components/AddTaskForm/AddTaskForm'
import TaskList from '../../components/TaskList/TaskList'
import useTaskManager, { type Task } from '../../hooks/useTaskManager';
import './home.css'

const Home = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTaskManager();
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tasks.filter((t:Task) => t.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tasks.filter((t:Task) => t.status === 'in-progress').length}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tasks.filter((t:Task) => t.status === 'completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <AddTaskForm onAddTask={addTask} />
        <TaskList
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </main>
    </div>
  )
}

export default Home