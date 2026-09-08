import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [formData, setFormData] = useState({
    title: '',
    priority: 'normal' as 'critical' | 'important' | 'normal',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: formData.title,
      priority: formData.priority,
      source: 'manual',
      dueDate: formData.dueDate,
      done: false,
    });
    setShowForm(false);
    setFormData({ title: '', priority: 'normal', dueDate: new Date().toISOString().split('T')[0] });
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'open') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const openCount = tasks.filter(t => !t.done).length;
  const criticalCount = tasks.filter(t => !t.done && t.priority === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Задачи</h1>
          <p className="text-sm text-slate-400 mt-1">Единый чек-лист по AI-наставнику, CRM-рискам и ручным задачам</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить задачу
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{openCount}</p>
          <p className="text-xs text-slate-400 mt-1">Открыто</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-xs text-slate-400 mt-1">Критично</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{tasks.filter(t => t.done).length}</p>
          <p className="text-xs text-slate-400 mt-1">Выполнено</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Все ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'open'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Открытые ({openCount})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'done'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Выполненные ({tasks.filter(t => t.done).length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`glass-card p-4 flex items-start gap-3 ${task.done ? 'opacity-50' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => updateTask(task.id, { done: !task.done })}
              className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.done ? 'line-through text-slate-500' : 'text-white'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`badge ${
                  task.priority === 'critical' ? 'badge-danger' :
                  task.priority === 'important' ? 'badge-warning' :
                  'badge-info'
                }`}>
                  {task.priority === 'critical' ? 'Критично' : task.priority === 'important' ? 'Важно' : 'Нормально'}
                </span>
                <span className="text-xs text-slate-500">до {task.dueDate}</span>
                {task.source === 'crm' && (
                  <span className="badge badge-info">CRM</span>
                )}
                {task.source === 'ai' && (
                  <span className="badge badge-info">AI</span>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Новая задача</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Название задачи *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Описание задачи"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Приоритет *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  required
                >
                  <option value="normal">Нормально</option>
                  <option value="important">Важно</option>
                  <option value="critical">Критично</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Срок выполнения *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50">
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-check mr-2"></i>Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
