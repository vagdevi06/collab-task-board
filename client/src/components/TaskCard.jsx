import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deleteTask } from '../api/tasks';
import useBoardStore from '../store/boardStore';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const TaskCard = ({ task, boardId }) => {
  const { removeTask } = useBoardStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    removeTask(task._id);
    await deleteTask(boardId, task._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <h3
          {...attributes}
          {...listeners}
          className="font-medium text-gray-800 text-sm cursor-grab active:cursor-grabbing flex-1"
        >
          {task.title}
        </h3>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 text-xs ml-2 cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        {task.description && (
          <p className="text-gray-500 text-xs mt-1">{task.description}</p>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          {task.assignee && (
            <span className="text-xs text-gray-400">👤 {task.assignee.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;