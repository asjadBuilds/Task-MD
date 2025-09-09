import { Plus, X } from "lucide-react";
import { useState } from "react";
import './addtaskform.css'

interface Errors {
  title?: string;
  description?: string;
  submit?: string;
  [key: string]: string | undefined;
}
type AddTaskProps = {
  onAddTask: (taskData: any) => void
}
const AddTaskForm = ({ onAddTask }: AddTaskProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const validateForm = () => {
    const newErrors = { title: '', description: '' };
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return newErrors.title === '' && newErrors.description === ''
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      onAddTask(formData);
      setFormData({ title: '', description: '', priority: 'medium' });
      setErrors({});
      setShowForm(false);
    } catch (error) {
      setErrors({ submit: 'Failed to add task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = ({ field, value }: { field: string, value: string }) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!showForm) {
    return (
      <div className="add-task-toggle">
        <button
          className="btn btn-primary btn-add-task"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add New Task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task-form-container">
      <div className="form-header">
        <h3>Add New Task</h3>
        <button
          className="btn btn-ghost btn-close"
          onClick={() => setShowForm(false)}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange({ field: 'title', value: e.target.value })}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            disabled={isSubmitting}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange({ field: 'description', value: e.target.value })}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description..."
            rows={3}
            disabled={isSubmitting}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange({ field: 'priority', value: e.target.value })}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm