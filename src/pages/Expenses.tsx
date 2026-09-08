export default function Expenses() {
  const expenses = [
    { date: '13.04.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '10 000', comment: '' },
    { date: '12.03.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '12 000', comment: '' },
    { date: '16.03.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '3 500', comment: '' },
    { date: '18.03.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '10 000', comment: '' },
    { date: '30.03.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '10 000', comment: '' },
    { date: '30.03.2026', category: 'Маркетинг', status: 'Оплачено', sum: '9 410', comment: '' },
    { date: '30.04.2026', category: 'Маркетинг', status: 'Оплачено', sum: '14 910', comment: '' },
    { date: '30.04.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '36 249', comment: '' },
    { date: '31.03.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '27 153', comment: '' },
    { date: '10.03.2026', category: 'Маркетинг', status: 'Оплачено', sum: '5 000', comment: '' },
    { date: '10.04.2026', category: 'Маркетинг', status: 'Оплачено', sum: '5 000', comment: '' },
    { date: '12.05.2026', category: 'Маркетинг', status: 'Оплачено', sum: '5 000', comment: '' },
    { date: '15.05.2026', category: 'Доступы / HH', status: 'Оплачено', sum: '18 000', comment: '' },
    { date: '20.05.2026', category: 'Прочее', status: 'Оплачено', sum: '6 000', comment: '' },
  ];

  const totalSum = expenses.reduce((acc, e) => acc + parseInt(e.sum.replace(/\s/g, '')), 0);

  const categoryBreakdown = [
    { name: 'Доступы / HH', sum: 126902, percent: 68, color: 'bg-indigo-500' },
    { name: 'Маркетинг', sum: 34320, percent: 18, color: 'bg-cyan-500' },
    { name: 'Прочее', sum: 6000, percent: 3, color: 'bg-amber-500' },
    { name: 'ФОТ', sum: 7000, percent: 4, color: 'bg-emerald-500' },
    { name: 'Обучение', sum: 13430, percent: 7, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Затраты</h1>
          <p className="text-sm text-slate-400 mt-1">Расходы бизнеса по категориям</p>
        </div>
        <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Новая затрата</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{(totalSum / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Общие затраты ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{expenses.length}</p>
          <p className="text-xs text-slate-400 mt-1">Операций</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{expenses.filter(e => e.status === 'Оплачено').length}</p>
          <p className="text-xs text-slate-400 mt-1">Оплачено</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-chart-pie text-indigo-400"></i>
          Структура расходов
        </h3>
        <div className="space-y-3">
          {categoryBreakdown.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-slate-300 w-32">{cat.name}</span>
              <div className="flex-1 progress-bar">
                <div className={`progress-bar-fill ${cat.color}`} style={{ width: `${cat.percent}%`, background: 'none' }}>
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: '100%' }}></div>
                </div>
              </div>
              <span className="text-xs text-slate-400 w-20 text-right">{(cat.sum / 1000).toFixed(1)}K ₽</span>
              <span className="text-xs text-slate-500 w-10 text-right">{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Категория</th>
              <th className="text-center pb-3 font-medium">Статус</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-left pb-3 font-medium">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => (
              <tr key={i} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{exp.date}</td>
                <td className="py-3 text-slate-300">{exp.category}</td>
                <td className="py-3 text-center">
                  <span className="badge badge-success">{exp.status}</span>
                </td>
                <td className="py-3 text-right text-red-400 font-medium">-{exp.sum} ₽</td>
                <td className="py-3 text-slate-500 text-xs">{exp.comment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
