'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Todo } from '@/app/types/todo';
import { createTodo, updateTodo } from '@/app/lib/api/todos';


interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  todo?: Todo | null; // If provided, it's edit mode
}

export default function TodoFormModal({ isOpen, onClose, onSuccess, todo }: TodoFormModalProps) {
  const isEditMode = !!todo;
  
  const [formData, setFormData] = useState({
    title: '',
    todo_date: '',
    priority: 'moderate' as 'extreme' | 'moderate' | 'low',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && todo) {
      setFormData({
        title: todo.title,
        todo_date: todo.todo_date,
        priority: todo.priority,
        description: todo.description,
      });
    } else {
      // Reset form when adding
      setFormData({
        title: '',
        todo_date: '',
        priority: 'moderate',
        description: '',
      });
    }
  }, [isEditMode, todo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (priority: 'extreme' | 'moderate' | 'low') => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsLoading(true);

    try {
      const todoData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      };

      // Only include todo_date if it has a value
      if (formData.todo_date) {
        todoData.todo_date = formData.todo_date;
      }

      if (isEditMode && todo) {
        // Update existing todo
        await updateTodo(todo.id, todoData);
        toast.success('Task updated successfully!');
      } else {
        // Create new todo
        await createTodo(todoData);
        toast.success('Task created successfully!');
      }
      
      setFormData({ title: '', todo_date: '', priority: 'moderate', description: '' });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} task`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', todo_date: '', priority: 'moderate', description: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md ml-64">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-sm font-medium text-[#1E293B] hover:text-[#5272FF] transition-colors underline"
          >
            Go Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="todo_date"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="todo_date"
                name="todo_date"
                value={formData.todo_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B]"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-3">
              Priority
            </label>
            <div className="flex items-center space-x-8">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-[#334155]">
                  Extreme
                </span>
                <input
                  type="checkbox"
                  checked={formData.priority === 'extreme'}
                  onChange={() => handlePriorityChange('extreme')}
                  className="w-4 h-4 rounded border-gray-300 text-[#5272FF] focus:ring-[#5272FF]"
                />
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-[#334155]">
                  Moderate
                </span>
                <input
                  type="checkbox"
                  checked={formData.priority === 'moderate'}
                  onChange={() => handlePriorityChange('moderate')}
                  className="w-4 h-4 rounded border-gray-300 text-[#5272FF] focus:ring-[#5272FF]"
                />
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-[#334155]">
                  Low
                </span>
                <input
                  type="checkbox"
                  checked={formData.priority === 'low'}
                  onChange={() => handlePriorityChange('low')}
                  className="w-4 h-4 rounded border-gray-300 text-[#5272FF] focus:ring-[#5272FF]"
                />
              </label>
            </div>
          </div>

          {/* Task Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#334155] mb-2"
            >
              Task Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Start writing here...."
              rows={4}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 bg-[#5272FF] text-white rounded-lg font-medium hover:bg-[#4461EE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Done')}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}