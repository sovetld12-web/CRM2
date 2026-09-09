import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const allMenuItems: Record<string, { label: string; icon: string; highlight?: boolean }> = {
  dashboard: { label: 'Центр управления', icon: 'fas fa-chart-line' },
  tasks: { label: 'Задачи', icon: 'fas fa-tasks' },
  money: { label: 'Деньги', icon: 'fas fa-wallet' },
  leads: { label: 'Лиды', icon: 'fas fa-user-plus' },
  production: { label: 'Производство', icon: 'fas fa-briefcase' },
  projects: { label: 'Проекты', icon: 'fas fa-project-diagram' },
  marketing: { label: 'Маркетинг', icon: 'fas fa-bullhorn' },
  'ai-assistant': { label: 'AI-помощник', icon: 'fas fa-robot' },
  documents: { label: 'Документы', icon: 'fas fa-file-contract' },
  invoices: { label: 'Счета', icon: 'fas fa-file-invoice' },
  expenses: { label: 'Затраты', icon: 'fas fa-receipt' },
  bank: { label: 'Банк', icon: 'fas fa-university' },
  'sleeping-base': { label: 'Спящая база', icon: 'fas fa-bed' },
  'data-manager': { label: '💾 Управление данными', icon: 'fas fa-cloud-upload-alt', highlight: true },
};

function SortableMenuItem({
  id,
  currentPage,
  onPageChange,
  isOpen,
  badge,
}: {
  id: string;
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  badge?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const item = allMenuItems[id];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!item) return null;

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <button
        onClick={() => onPageChange(id)}
        className={`sidebar-item w-full ${currentPage === id ? 'active' : ''} ${item.highlight ? 'border-l-2 border-l-emerald-500' : ''}`}
        title={!isOpen ? item.label : undefined}
      >
        <span {...listeners} className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
          ⋮⋮
        </span>
        {item.highlight ? (
          <span className="flex items-center gap-2 flex-1">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <i className={`${item.icon} text-emerald-400`}></i>
            </span>
            {isOpen && (
              <span className="font-semibold text-emerald-300 text-sm">{item.label}</span>
            )}
          </span>
        ) : (
          <>
            <i className={`${item.icon} w-5 text-center`}></i>
            {isOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </>
            )}
          </>
        )}
      </button>
    </li>
  );
}

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  
  const [menuOrder, setMenuOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('crm_menu_order');
    return saved ? JSON.parse(saved) : [
      'dashboard',
      'data-manager',
      'tasks',
      'money',
      'leads',
      'production',
      'projects',
      'marketing',
      'ai-assistant',
      'documents',
      'invoices',
      'expenses',
      'bank',
      'sleeping-base',
    ];
  });

  useEffect(() => {
    localStorage.setItem('crm_menu_order', JSON.stringify(menuOrder));
  }, [menuOrder]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMenuOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside
        className={`sidebar-container fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 w-16'
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <i className="fas fa-rocket text-white text-sm"></i>
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Команда Роста</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            <i className={`fas ${isOpen ? 'fa-times md:hidden' : 'fa-bars'} text-xs`}></i>
            <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-xs hidden md:block`}></i>
          </button>
        </div>

      {/* Navigation */}
      <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={menuOrder} strategy={verticalListSortingStrategy}>
            <ul className="space-y-1">
              {menuOrder.map((id) => (
                <SortableMenuItem
                  key={id}
                  id={id}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                  isOpen={isOpen}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        {/* Theme toggle */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} mb-2`}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          >
            <span className={`absolute inset-0 flex items-center ${theme === 'dark' ? 'justify-start pl-1.5' : 'justify-end pr-1.5'}`}>
              <i className={`fas ${theme === 'dark' ? 'fa-moon text-indigo-300' : 'fa-sun text-amber-400'} text-[10px]`}></i>
            </span>
          </button>
          {isOpen && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            </span>
          )}
        </div>

        {/* User */}
        {isOpen && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: 'var(--bg-input)' }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Л</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Любовь</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Администратор</p>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
