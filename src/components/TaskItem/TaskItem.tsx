import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import './taskitem.css'
import type { Task } from "../../hooks/useTaskManager";

type TaskItemProps = {
  task:Task,
  onUpdate:({taskId, updates}:{taskId:string, updates:any})=>void,
  onDelete:(taskId:string)=>void,
  onToggleStatus:(taskId:string)=>void
}
const TaskItem = ({ task, onUpdate, onDelete, onToggleStatus }:TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority
  });

  const handleSave = () => {
    if (editData.title.trim()) {
      onUpdate({taskId:task.id, updates:editData});
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
    setIsEditing(false);
  };

  const getPriorityClass = (priority:string) => {
    return `priority-${priority}`;
  };

  const getStatusIcon = (status:string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} />;
      case 'in-progress':
        return <Clock size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const getStatusClass = (status:string) => {
    return `status-${status}`;
  };

  return (
    <div className={`task-item ${getPriorityClass(task.priority)} ${getStatusClass(task.status)}`}>
      <div className="task-header">
        <div className="task-priority">
          <span className={`priority-badge ${task.priority}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        <div className="task-actions">
          {!isEditing && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsEditing(true)}
                title="Edit task"
              >
                Edit
              </button>
              <button
                className="btn btn-ghost btn-sm btn-danger"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="task-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="form-input"
              placeholder="Task title"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              placeholder="Task description"
              rows={2}
            />
            <select
              value={editData.priority}
              onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as typeof prev.priority }))}
              className="form-select"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="edit-actions">
              <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <h4 className="task-title">{task.title}</h4>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </>
        )}
      </div>

      <div className="task-footer">
        <div className="task-status">
          <button
            className={`status-button ${task.status}`}
            onClick={() => onToggleStatus(task.id)}
            title="Click to change status"
          >
            {getStatusIcon(task.status)}
            <span className="status-text">
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
          </button>
        </div>
        <div className="task-date">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskItem