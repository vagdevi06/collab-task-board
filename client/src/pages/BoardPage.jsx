import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { getTasks, updateTask } from '../api/tasks';
import { getBoardById } from '../api/boards';
import useBoardStore from '../store/boardStore';
import useAuthStore from '../store/authStore';
import useWebSocket from '../hooks/useWebSocket';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskCard from '../components/TaskCard';

const STATUSES = ['todo', 'inprogress', 'done'];

const BoardPage = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { tasks, setTasks, setCurrentBoard, currentBoard, updateTask: updateTaskStore } = useBoardStore();
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [activeTask, setActiveTask] = useState(null);

  useWebSocket(id, token);

  useEffect(() => {
    getBoardById(id).then(({ data }) => setCurrentBoard(data));
    getTasks(id).then(({ data }) => setTasks(data));
  }, [id]);

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setShowModal(true);
  };

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;

    let newStatus;
    if (STATUSES.includes(over.id)) {
      newStatus = over.id;
    } else {
      const overTask = tasks.find((t) => t._id === over.id);
      newStatus = overTask ? overTask.status : task.status;
    }

    if (task.status !== newStatus) {
      const updated = { ...task, status: newStatus };
      updateTaskStore(updated);
      await updateTask(id, task._id, { status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentBoard?.name || 'Loading...'}
        </h2>
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                boardId={id}
                tasks={tasks.filter((t) => t.status === status)}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} boardId={id} />}
          </DragOverlay>
        </DndContext>
      </div>
      {showModal && (
        <CreateTaskModal
          boardId={id}
          defaultStatus={defaultStatus}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BoardPage;