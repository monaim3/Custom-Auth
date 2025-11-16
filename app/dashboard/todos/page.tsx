
'use client';
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';

import toast from 'react-hot-toast';
import { Todo } from '@/app/types/todo';
import { getTodos } from '@/app/lib/api/todos';
import TodoList from '@/app/components/todos/TodoList';
import TodoFormModal from '@/app/components/todos/TodoFormModal';

export default function TodosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDays, setFilterDays] = useState<number | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  useEffect(() => {
    fetchTodos();
  }, [searchQuery, filterDays]);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      if (filterDays !== null) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + filterDays);
        params.todo_date = targetDate.toISOString().split('T')[0];
      }

      const response = await getTodos(params);
      setTodos(response.results);
    } catch (error) {
      toast.error('Failed to load todos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTodos();
  };

  const handleFilterSelect = (days: number) => {
    setFilterDays(days);
    setIsFilterOpen(false);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleAddTodo = () => {
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleDeleteSuccess = () => {
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] relative">

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          </div>
      )}
      <div className="p-8">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#1E293B]">Todos</h1>
          <button
            onClick={handleAddTodo}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#5272FF] text-white rounded-lg font-medium hover:bg-[#4461EE] transition-colors"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search your task here..."
              className="w-full px-4 py-2.5 pl-4 pr-12 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5272FF] focus:border-transparent transition-all text-[#1E293B] placeholder:text-[#94A3B8]"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-[#5272FF] rounded-md hover:bg-[#4461EE] transition-colors"
            >
              <Search size={18} className="text-white" />
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 px-5 py-2.5 border border-[#E2E8F0] rounded-lg font-medium hover:bg-gray-50 transition-colors text-[#334155] whitespace-nowrap"
            >
              <span>Sort by</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setFilterDays(null);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-[#334155]"
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={() => handleFilterSelect(0)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-[#334155]"
                  >
                    Deadline Today
                  </button>
                  <button
                    onClick={() => handleFilterSelect(5)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-[#334155]"
                  >
                    Expires in 5 days
                  </button>
                  <button
                    onClick={() => handleFilterSelect(10)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-[#334155]"
                  >
                    Expires in 10 days
                  </button>
                  <button
                    onClick={() => handleFilterSelect(30)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-[#334155]"
                  >
                    Expires in 30 days
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


        <TodoList
          todos={todos}
          isLoading={isLoading}
          onEdit={handleEditTodo}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
      <TodoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchTodos}
        todo={selectedTodo}
      />
    </div>
  );
}