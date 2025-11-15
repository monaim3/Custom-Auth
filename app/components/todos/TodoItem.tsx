'use client';

import { Pencil, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/app/types/todo';
import { deleteTodo } from '@/app/lib/api/todos';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDeleteSuccess: () => void;
}

export default function TodoItem({ todo, onEdit, onDeleteSuccess }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'extreme':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'moderate':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      toast.success('Task deleted successfully');
      onDeleteSuccess();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      {/* Header with Title and Priority */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
            {todo.title}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              todo.priority
            )}`}
          >
            {getPriorityLabel(todo.priority)}
          </span>
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical size={18} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#64748B] mb-4 line-clamp-2">
        {todo.description || 'No description provided'}
      </p>

      {/* Footer with Date and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-[#64748B]">
          Due {formatDate(todo.todo_date)}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 text-blue-500 bg-[#EEF7FF] hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-red-500 bg-[#EEF7FF] hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}