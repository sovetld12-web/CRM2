import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'done' | 'critical'>('all');

  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'normal' as 'critical' | 'important' | 'normal',
    source: 'manual' as 'manual' | 'crm' | 'ai',
    dueDate: new Date().toISOString().split('T')[0],
    done: false,
  });

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setShowAddModal(false);
    setNewTask({ title: '', priority: 'normal', source: 'manual', dueDate: new Date().toISOString().split('T')[0], done: false });
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'open') return !t.done;
    if (filter === 'done') return t.done;
    if (filter === 'critical') return !t.done && t.priority === 'critical';
    return true;
  });

  const openTasks = tasks.filter(t => !t.done).length;
  const criticalTasks = tasks.filter(t => !t.done && t.priority === 'critical').length;
  const doneTasks = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Задачи</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Единый чек-лист по AI, CRM и ручным задачам</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить задачу
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasks.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Всего</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{openTasks}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Открыто</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{criticalTasks}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Критично</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{doneTasks}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Готово</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'all' ? 'var(--text-secondary)' : undefined }}>
          Все ({tasks.length})
        </button>
        <button onClick={() => setFilter('open')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'open' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'open' ? 'var(--text-secondary)' : undefined }}>
          Открыто ({openTasks})
        </button>
        <button onClick={() => setFilter('critical')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'critical' ? 'var(--text-secondary)' : undefined }}>
          Критично ({criticalTasks})
        </button>
        <button onClick={() => setFilter('done')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'done' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'done' ? 'var(--text-secondary)' : undefined }}>
          Готово ({doneTasks})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 && (
          <div className="glass-card p-8 text-center">
            <i className="fas fa-check-circle text-4xl text-emerald-400/30 mb-3"></i>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Задач нет</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <div key={task.id} className={`glass-card p-4 flex items-center gap-3 transition-all ${task.done ? 'opacity-50' : ''}`}>
            <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-indigo-400'}`}>
              {task.done && <i className="fas fa-check text-white text-xs"></i>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.done ? 'line-through' : ''}`} style={{ color: 'var(--text-primary)' }}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  task.priority === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  task.priority === 'important' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {task.priority === 'critical' ? 'Критично' : task.priority === 'important' ? 'Важно' : 'Обычная'}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>до {task.dueDate}</span>
                {task.source === 'crm' && <span className="text-[10px] text-indigo-400">CRM</span>}
                {task.source === 'ai' && <span className="text-[10px] text-cyan-400">AI</span>}
              </div>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300 text-sm">
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Новая задача" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Название задачи *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Что нужно сделать?"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Приоритет</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              <option value="normal">Обычная</option>
              <option value="important">Важно</option>
              <option value="critical">Критично</option>
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Срок</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }}>Отмена</button>
          <button onClick={handleAdd} disabled={!newTask.title.trim()} className="btn-primary disabled:opacity-50">
            <i className="fas fa-save mr-2"></i>Сохранить
          </button>
        </div>
      </Modal>
    </div>
  );
}
