import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const columnStyles = {
  todo: 'border-t-4 border-gray-400',
  inprogress: 'border-t-4 border-blue-400',
  done: 'border-t-4 border-green-400',
};

const columnTitles = {
  todo: '📋 To Do',
  inprogress: '⚡ In Progress',
  done: '✅ Done',
};

const Column = ({ status, tasks, boardId, onAddTask }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className={`bg-gray-50 rounded-lg p-4 flex flex-col gap-3 min-h-96 ${columnStyles[status]}`}>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">{columnTitles[status]}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 flex-1">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} boardId={boardId} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(status)}
        className="text-gray-400 hover:text-gray-600 text-sm border border-dashed border-gray-300 rounded p-2 hover:border-gray-400 transition-colors"
      >
        + Add Task
      </button>
    </div>
  );
};

export default Column;