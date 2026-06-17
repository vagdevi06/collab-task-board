import { create } from 'zustand';

const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  tasks: [],

  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => {
    if (state.tasks.some((t) => t._id === task._id)) return state;
    return { tasks: [...state.tasks, task] };
  }),

  updateTask: (updated) => set((state) => ({
    tasks: state.tasks.map((t) => t._id === updated._id ? updated : t),
  })),

  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t._id !== taskId),
  })),
}));

export default useBoardStore;