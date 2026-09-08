import { useState } from 'react';

export default function Leads() {
  const [view, setView] = useState<'table' | 'kanban'>('table');

  const kanbanColumns = [
    { name: 'Заявка', count: 4, sum: '95 000', color: 'indigo', cards: [
      { name: 'Сергей', sum: '15 000', source: 'Профи', status: 'Нужно касание' },
      { name: 'Мария', sum: '15 000', source: 'Профи', status: 'Нет даты' },
      { name: 'Дмитрий', sum: '15 000', source: 'Профи', status: 'Нет даты' },
      { name: 'Александра', sum: '50 000', source: 'Профи', status: 'Нет даты' },
    ]},
    { name: 'Диагностика', count: 2, sum: '100 000', color: 'cyan', cards: [
      { name: 'Камила', sum: '50 000', source: 'Профи', status: 'Нет даты' },
      { name: 'Евгений', sum: '50 000', source: 'Аномалия', status: 'Нужно касание' },
    ]},
    { name: 'КП', count: 1, sum: '100 000', color: 'amber', cards: [
      { name: 'Максим', sum: '100 000', source: 'Профи', status: 'Нет даты' },
    ]},
    { name: 'Договор', count: 0, sum: '0', color: 'emerald', cards: [] },
    { name: 'Продажа', count: 0, sum: '0', color: 'violet', cards: [] },
    { name: 'Отказ', count: 0, sum: '0', color: 'red', cards: [] },
  ];

  const leads = [
    { date: '31.08', name: 'Сергей', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'разработка мотивации', sum: '15 000', nextStep: 'Вывести на созвон', status: 'warning' },
    { date: '31.08', name: 'Мария', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'разработка мотивации', sum: '15 000', nextStep: 'Нет даты', status: 'danger' },
    { date: '31.08', name: 'Дмитрий', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'консультация', sum: '15 000', nextStep: 'Нет даты', status: 'danger' },
    { date: '31.08', name: 'Александра', source: 'Профи', stage: 'Заявка', product: 'Рекрутинг', project: 'МОП', sum: '50 000', nextStep: 'Нет даты', status: 'danger' },
    { date: '27.08', name: 'Максим', source: 'Профи', stage: 'КП', product: 'Рекрутинг', project: 'HRD', sum: '100 000', nextStep: 'Нет даты', status: 'danger' },
    { date: '26.08', name: 'Камила', source: 'Профи', stage: 'Диагностика', product: 'Рекрутинг', project: 'МОП', sum: '50 000', nextStep: 'Нет даты', status: 'danger' },
    { date: '26.08', name: 'Евгений', source: 'Аномалия', stage: 'Диагностика', product: 'Рекрутинг', project: 'МОП', sum: '50 000', nextStep: '03.09.2026', status: 'warning' },
  ];

  const sourceColors: Record<string, string> = {
    'Профи': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Авито': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Аномалия': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Рекомендация': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Действующий клиент': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const kanbanColors: Record<string, string> = {
    indigo: 'border-indigo-500/30 bg-indigo-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    violet: 'border-violet-500/30 bg-violet-500/5',
    red: 'border-red-500/30 bg-red-500/5',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Лиды</h1>
          <p className="text-sm text-slate-400 mt-1">Воронка продаж и управление лидами</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/50">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'table' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400'}`}>
              <i className="fas fa-table mr-1"></i>Таблица
            </button>
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'kanban' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400'}`}>
              <i className="fas fa-columns mr-1"></i>Канбан
            </button>
          </div>
          <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Добавить лид</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">116</p>
          <p className="text-xs text-slate-400 mt-1">Всего лидов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">7</p>
          <p className="text-xs text-slate-400 mt-1">В работе</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">8,6%</p>
          <p className="text-xs text-slate-400 mt-1">Конверсия</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">30 300</p>
          <p className="text-xs text-slate-400 mt-1">Средний чек</p>
        </div>
      </div>

      {view === 'kanban' ? (
        /* Kanban View */
        <div className="flex gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((col, i) => (
            <div key={i} className={`flex-shrink-0 w-64 rounded-xl border p-3 ${kanbanColors[col.color]}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-300">{col.name}</h4>
                <span className="text-[10px] text-slate-500">{col.count} / {col.sum}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((card, j) => (
                  <div key={j} className="kanban-card">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{card.name}</span>
                      <span className="text-xs text-indigo-300">{card.sum}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sourceColors[card.source] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {card.source}
                      </span>
                      <span className={`text-[10px] ${card.status === 'Нужно касание' ? 'text-amber-400' : 'text-red-400'}`}>
                        {card.status}
                      </span>
                    </div>
                  </div>
                ))}
                {col.cards.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">Нет карточек</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-700/50">
                <th className="text-left pb-3 font-medium">Дата</th>
                <th className="text-left pb-3 font-medium">Контакт</th>
                <th className="text-left pb-3 font-medium">Источник</th>
                <th className="text-left pb-3 font-medium">Этап</th>
                <th className="text-left pb-3 font-medium">Продукт</th>
                <th className="text-left pb-3 font-medium">Проект</th>
                <th className="text-right pb-3 font-medium">Сумма</th>
                <th className="text-left pb-3 font-medium">Следующий шаг</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={i} className="table-row">
                  <td className="py-3 text-slate-400">{lead.date}</td>
                  <td className="py-3 text-white font-medium">{lead.name}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${sourceColors[lead.source] || 'bg-slate-500/10 text-slate-400'}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="badge badge-info">{lead.stage}</span>
                  </td>
                  <td className="py-3 text-slate-400">{lead.product}</td>
                  <td className="py-3 text-slate-300">{lead.project}</td>
                  <td className="py-3 text-right text-white font-medium">{lead.sum} ₽</td>
                  <td className="py-3">
                    <span className={`text-xs ${lead.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                      {lead.nextStep}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
