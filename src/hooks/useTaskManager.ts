import useLocalStorage from "./useLocalStorage";

export type Task = {
    id:string
    title:string,
    description:string,
    priority:Priority,
    status:string,
    createdAt:string
}
export type Priority = "low" | "medium" | "high";



const useTaskManager = () => {
  const [tasks, setTasks] = useLocalStorage({key:'tasks', initialValue:[]});

  const addTask = (taskData:Task) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      priority: taskData.priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev: any) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = ({taskId, updates}:{taskId:string, updates:any}) => {
    setTasks((prev: Task[]) => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId:string) => {
    setTasks((prev: Task[]) => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId:string) => {
    setTasks((prev: Task[]) => prev.map(task => {
      if (task.id === taskId) {
        const statusMap = {
          'pending': 'in-progress',
          'in-progress': 'completed',
          'completed': 'pending'
        };
        return { ...task, status: statusMap[task.status as keyof typeof statusMap] };
      }
      return task;
    }));
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };
};

export default useTaskManager