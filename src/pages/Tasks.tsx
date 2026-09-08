import { useState } from 'react';

export default function Tasks() {
  const [filter, setFilter] = useState('all');

  const tasks = [
    { id: 1, title: 'Выставить счет и акт: Константин / химик технолог', priority: 'critical', source: 'CRM', due: '07.09.2026', done: false },
    { id: 2, title: 'Выставить счет и акт: Юлия / Главный бухгалтер', priority: 'critical', source: 'CRM', due: '07.09.2026', done: false },
    { id: 3, title: 'Разобрать зависшую вакансию: ДК Дюкарева / МОП (93 раб. дн.)', priority: 'critical', source: 'CRM', due: '07.09.2026', done: false },
    { id: 4, title: 'Разобрать зависшую вакансию: Цивиоми / подбор бухгалтера (82 раб. дн.)', priority: 'critical', source: 'CRM', due: '07.09.2026', done: false },
    { id: 5, title: 'Выставить счет и акт: Ланторо / РОП', priority: 'critical', source: 'CRM', due: '07.09.2026', done: false },
    { id: 6, title: 'Разобрать зависшую вакансию: парковки / операционный директор (43 раб. дн.)', priority: 'important', source: 'CRM', due: '07.09.2026', done: false },
    { id: 7, title: 'Закрыть просроченные касания по лидам: 66', priority: 'important', source: 'CRM', due: '07.09.2026', done: false },
    { id: 8, title: 'Назначить действие по гарантийной замене: Нью вей / МОП ВЭД', priority: 'important', source: 'CRM', due: '07.09.2026', done: false },
    { id: 9, title: 'Назначить действие по гарантийной замене: ФОРТ / инженер ПТО', priority: 'important', source: 'CRM', due: '07.09.2026', done: false },
    { id: 10, title: 'Назначить действие по гарантийной замене: САМОРИ / МОП', priority: 'important', source: 'CRM', due: '07.09.2026', done: false },
    { id: 11, title: 'Провести собеседование с кандидатом для Промнастил', priority: 'normal', source: 'Ручная', due: '10.09.2026', done: false },
    { id: 12, title: 'Обновить профиль вакансии Цивиоми', priority: 'normal', source: 'Ручная', due: '12.09.2026', done: false },
  ];

  const filteredTasks = filter === 'all' ? tasks :
    filter === 'critical' ? tasks.filter(t => t.priority === 'critical') :
    filter === 'important' ? tasks.filter(t => t.priority === 'important') :
    tasks.filter(t => t.done);

  const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    critical: { label: 'Критично', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    important: { label: 'Важно', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    normal: { label: 'Нормально', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  };

  const stats = [
    { label: 'Открыто', value: tasks.filter(t => !t.done).length, color: 'text-indigo-400' },
    { label: 'Критично', value: tasks.filter(t => t.priority === 'critical' && !t.done).length, color: 'text-red-400' },
    { label: 'AI / CRM', value: tasks.filter(t => t.source === 'CRM').length, color: 'text-cyan-400' },
    { label: 'Готово', value: tasks.filter(t => t.done).length, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Задачи</h1>
          <p className="text-sm text-slate-400 mt-1">Единый чек-лист по AI-наставнику, CRM-рискам и ручным задачам</p>
        </div>
        <button className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить задачу
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="metric-card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'Все' },
          { id: 'critical', label: 'Критично' },
          { id: 'important', label: 'Важно' },
          { id: 'done', label: 'Готово' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="glass-card p-4">
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const pc = priorityConfig[task.priority];
            return (
              <div key={task.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all hover:bg-slate-800/30 ${task.done ? 'opacity-50' : ''} ${pc.bg}`}>
                <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done ? 'border-emerald-400 bg-emerald-400/20' : 'border-slate-600 hover:border-indigo-400'
                }`}>
                  {task.done && <i className="fas fa-check text-[8px] text-emerald-400"></i>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-medium ${pc.color}`}>{pc.label}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">{task.source}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">до {task.due}</span>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-red-400 transition-colors p-1">
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
