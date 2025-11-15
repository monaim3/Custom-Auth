'use client';

import { Plus } from 'lucide-react';
import TodoItem from './TodoItem';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Todo } from '@/app/types/todo';
import Image from 'next/image';

interface TodoListProps {
    todos: Todo[];
    isLoading: boolean;
    onEdit: (todo: Todo) => void;
    onDeleteSuccess: () => void;
}

export default function TodoList({ todos, isLoading, onEdit, onDeleteSuccess }: TodoListProps) {
    const [items, setItems] = useState<Todo[]>([]);

    useEffect(() => {
        // Sort todos by position when they change
        const sortedTodos = [...todos].sort((a, b) => {
            // Use position if available, otherwise use id
            const posA = a.position !== undefined ? a.position : a.id;
            const posB = b.position !== undefined ? b.position : b.id;
            return posA - posB;
        });
        setItems(sortedTodos);
    }, [todos]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update positions in UI only
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            position: index + 1,
        }));

        // Update UI
        setItems(updatedItems);
        toast.success('Tasks reordered');
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-16 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5272FF]"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
           <div className="bg-white rounded-lg shadow-sm p-16 flex flex-col items-center justify-center">
     <div className="relative mb-6">
        <div className="relative w-40 h-40">
            <Image
                src="/icon-no-projects.png"
                alt="No Projects"
                fill
                priority
                className="object-contain"
                sizes="200px"
            />
        </div>

    
    </div>

    <p className="text-xl font-medium text-[#64748B]">No todos yet</p>
</div>

        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Your Tasks</h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onEdit={onEdit}
                                onDeleteSuccess={onDeleteSuccess}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}