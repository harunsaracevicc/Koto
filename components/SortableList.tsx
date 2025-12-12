import React from 'react';
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
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
    id: string | number;
    children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10" {...attributes} {...listeners}>
                <GripVertical size={20} className="text-white/40 hover:text-white/60" />
            </div>
            <div className="pl-8">
                {children}
            </div>
        </div>
    );
}

interface SortableListProps {
    items: any[];
    onReorder: (items: any[]) => void;
    renderItem: (item: any) => React.ReactNode;
    getItemId: (item: any) => string | number;
}

export function SortableList({ items, onReorder, renderItem, getItemId }: SortableListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => getItemId(item) === active.id);
            const newIndex = items.findIndex(item => getItemId(item) === over.id);

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            onReorder(reorderedItems);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(getItemId)}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item) => (
                    <SortableItem key={getItemId(item)} id={getItemId(item)}>
                        {renderItem(item)}
                    </SortableItem>
                ))}
            </SortableContext>
        </DndContext>
    );
}
