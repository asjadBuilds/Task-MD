import { useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import type { Task } from "../../hooks/useTaskManager";
import { CheckCircle, Filter, Search, X } from "lucide-react";
import TaskItem from "../TaskItem/TaskItem";

type TaskListProps = {
  tasks : Task[],
  onUpdate:({taskId, updates}:{taskId:string, updates:any})=>void,
  onDelete:(taskId:string)=>void,
  onToggleStatus:(taskId:string)=>void
}
const TaskList = ({ tasks, onUpdate, onDelete, onToggleStatus }:TaskListProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce({value:searchQuery, delay:300});

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((task: Task) => task.status === statusFilter);
    }

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((task:Task) => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Sort tasks
    filtered.sort((a: Task, b: Task) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return filtered;
  }, [tasks, statusFilter, sortBy, debouncedSearchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="task-list-container">
      <div className="task-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Date Created</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tasks-grid">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="no-tasks">
            {debouncedSearchQuery ? (
              <div className="no-results">
                <Search size={48} />
                <h3>No tasks found</h3>
                <p>No tasks match your search for "{debouncedSearchQuery}"</p>
                <button className="btn btn-primary" onClick={clearSearch}>
                  Clear Search
                </button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} />
                <h3>No tasks yet</h3>
                <p>Add your first task to get started!</p>
              </div>
            ) : (
              <div className="no-results">
                <Filter size={48} />
                <h3>No tasks in this filter</h3>
                <p>Try adjusting your filters to see more tasks.</p>
              </div>
            )}
          </div>
        ) : (
          filteredAndSortedTasks.map((task:Task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList