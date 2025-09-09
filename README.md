# 📝 Task Manager (React + TypeScript)

A modern **Task Management App** built with **React 18 + TypeScript + Vite**, featuring:
- Add, edit, delete tasks
- Task prioritization (High / Medium / Low)
- Task status cycle (Pending → In Progress → Completed)
- LocalStorage persistence
- Search and filter tasks
- Unit & integration testing with **Jest, React Testing Library, and Enzyme**

---

## 🚀 Features
- ✅ **Add new tasks** with title, description, and priority  
- ✏️ **Edit tasks** inline  
- ❌ **Delete tasks**  
- 🔄 **Toggle status** between `pending`, `in-progress`, and `completed`  
- 🗂️ **Filter & search** tasks in real time  
- 💾 **Persistent storage** via LocalStorage  
- 🧪 **Testing setup** with Jest + RTL + Enzyme (unit, integration, coverage reports)  

---

## 📂 Project Structure

src/
├── components/
│ ├── AddTaskForm/ # Add new task form
│ ├── TaskItem/ # Single task item
│ └── TaskDashboard/ # Integration of form + list
├── hooks/
│ ├── useTaskManager.ts # Core task management logic
│ ├── useLocalStorage.ts
│ └── useDebounce.ts
├── utils/
│ ├── testUtils.tsx # Custom render function for tests
│ └── testData.ts # Factories for test tasks
├── App.tsx
├── main.tsx
└── setupTests.ts # Jest/RTL/Enzyme setup
