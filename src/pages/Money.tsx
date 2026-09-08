export default function Money() {
  const financeCards = [
    { icon: 'fas fa-wallet', label: 'Деньги сейчас', value: '98 000', sub: 'начало + движение', color: 'emerald' },
    { icon: 'fas fa-arrow-down', label: 'Поступления', value: '126 000', sub: '2 операций', color: 'cyan' },
    { icon: 'fas fa-arrow-up', label: 'Расходы бизнеса', value: '15 000', sub: '11,9% от поступлений', color: 'red' },
    { icon: 'fas fa-exchange-alt', label: 'Чистое движение', value: '+111 000', sub: 'положительное', color: 'indigo' },
    { icon: 'fas fa-piggy-bank', label: 'Свободные деньги', value: '98 000', sub: 'после обязательств', color: 'violet' },
    { icon: 'fas fa-file-contract', label: 'Кредиторка', value: '0', sub: 'обязательств нет', color: 'slate' },
  ];

  const operations = [
    { date: '02.09.2026', type: 'Расход', counterparty: 'ИП Кузнецова Е.Л.', category: 'Обучение', amount: '-15 000' },
    { date: '02.09.2026', type: 'Расход', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', amount: '-10 000' },
    { date: '02.09.2026', type: 'Поступление', counterparty: 'ИП Браун И.В.', category: 'Предоплата', amount: '+60 000' },
    { date: '01.09.2026', type: 'Расход', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', amount: '-3 000' },
    { date: '01.09.2026', type: 'Поступление', counterparty: 'ООО "Промнастил"', category: 'Постоплата', amount: '+66 000' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    red: 'text-red-400 bg-red-500/10',
    indigo: 'text-indigo-400 bg-indigo-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
    slate: 'text-slate-400 bg-slate-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Деньги</h1>
          <p className="text-sm text-slate-400 mt-1">Финансовая картина агентства</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary"><i className="fas fa-upload mr-2"></i>Загрузить выписку</button>
          <button className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <i className="fas fa-plus mr-1"></i>Добавить операцию
          </button>
        </div>
      </div>

      {/* Finance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {financeCards.map((card, i) => (
          <div key={i} className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
                <i className={`${card.icon} text-sm`}></i>
              </div>
              <span className="text-xs text-slate-400">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value} <span className="text-sm text-slate-400">₽</span></p>
            <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-chart-area text-indigo-400"></i>
          Динамика денег
        </h3>
        <div className="h-48 flex items-end gap-2 px-4">
          {[40, 65, 50, 80, 45, 70, 90, 55, 75, 60, 85, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/40 to-indigo-400/20 transition-all hover:from-indigo-600/60 hover:to-indigo-400/40" style={{ height: `${h}%` }}></div>
              <span className="text-[9px] text-slate-500">{['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Operations Table */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-list text-cyan-400"></i>
          Операции за период
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-700/50">
                <th className="text-left pb-3 font-medium">Дата</th>
                <th className="text-left pb-3 font-medium">Тип</th>
                <th className="text-left pb-3 font-medium">Контрагент</th>
                <th className="text-left pb-3 font-medium">Категория</th>
                <th className="text-right pb-3 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, i) => (
                <tr key={i} className="table-row">
                  <td className="py-3 text-slate-400">{op.date}</td>
                  <td className="py-3">
                    <span className={`badge ${op.type === 'Поступление' ? 'badge-success' : 'badge-danger'}`}>
                      {op.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{op.counterparty}</td>
                  <td className="py-3 text-slate-400">{op.category}</td>
                  <td className={`py-3 text-right font-medium ${op.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {op.amount} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Health */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-heartbeat text-emerald-400"></i>
          Финансовое здоровье
          <span className="badge badge-success ml-2">Стабильно</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs text-emerald-400 font-medium">Свободные деньги</p>
            <p className="text-xl font-bold text-white mt-1">98 000 ₽</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs text-emerald-400 font-medium">Денежная подушка</p>
            <p className="text-xl font-bold text-white mt-1">1.7 мес.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs text-emerald-400 font-medium">Концентрация клиента</p>
            <p className="text-xl font-bold text-white mt-1">14,4%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
