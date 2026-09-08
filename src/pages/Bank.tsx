import { useState } from 'react';

export default function Bank() {
  const [selectedMonth, setSelectedMonth] = useState('09.2026');

  const months = [
    { id: '09.2026', operations: 5, income: 126000, expense: 28000, result: 98000 },
    { id: '08.2026', operations: 38, income: 335000, expense: 313209, result: 21791 },
    { id: '07.2026', operations: 61, income: 325318, expense: 665470, result: -340152 },
    { id: '06.2026', operations: 39, income: 403000, expense: 342798, result: 60202 },
    { id: '05.2026', operations: 35, income: 165500, expense: 227380, result: -61880 },
    { id: '04.2026', operations: 18, income: 166500, expense: 107676, result: 58824 },
    { id: '03.2026', operations: 46, income: 199000, expense: 193374, result: 5626 },
    { id: '02.2026', operations: 56, income: 328500, expense: 172925, result: 155575 },
  ];

  const bankOperations = [
    { date: '02.09.2026', type: 'Расход', account: '4080...1859914', counterparty: 'ИП Кузнецова Е.Л.', category: 'Обучение', sum: '-15 000', desc: 'Счет на оплату № 642' },
    { date: '02.09.2026', type: 'Расход', account: '4081...832441', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', sum: '-10 000', desc: 'Перевод между счетами' },
    { date: '02.09.2026', type: 'Поступление', account: '4080...3414834', counterparty: 'ИП Браун И.В.', category: 'Поступление клиента', sum: '+60 000', desc: 'Счет №84 от 02.09.2026' },
    { date: '01.09.2026', type: 'Расход', account: '4081...832441', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', sum: '-3 000', desc: 'Перевод между счетами' },
    { date: '01.09.2026', type: 'Поступление', account: '4070...949214', counterparty: 'ООО "Промнастил"', category: 'Поступление клиента', sum: '+66 000', desc: 'Оплата по счету № 82' },
  ];

  const summary = {
    operations: 341,
    income: 2192818,
    expense: 2243892,
    credits: 477619,
    cardWithdraw: 842000,
    netMovement: -51074,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Банк</h1>
          <p className="text-sm text-slate-400 mt-1">Поступления и расходы по банковским выпискам</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <i className="fas fa-upload mr-1"></i>Загрузить выписку
          </button>
          <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Добавить операцию</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="metric-card text-center">
          <p className="text-lg font-bold text-white">{summary.operations}</p>
          <p className="text-[10px] text-slate-400 mt-1">Операций</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-lg font-bold text-emerald-400">{(summary.income / 1000000).toFixed(1)}M</p>
          <p className="text-[10px] text-slate-400 mt-1">Поступления</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-lg font-bold text-red-400">{(summary.expense / 1000000).toFixed(1)}M</p>
          <p className="text-[10px] text-slate-400 mt-1">Расходы</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-lg font-bold text-amber-400">{(summary.credits / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-slate-400 mt-1">Кредиты</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-lg font-bold text-violet-400">{(summary.cardWithdraw / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-slate-400 mt-1">Вывод на карту</p>
        </div>
        <div className="metric-card text-center">
          <p className={`text-lg font-bold ${summary.netMovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.netMovement >= 0 ? '+' : ''}{(summary.netMovement / 1000).toFixed(0)}K
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Чистое движение</p>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-calendar-alt text-indigo-400"></i>
          Помесячная сводка
        </h3>
        <div className="space-y-2">
          {months.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMonth(m.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                selectedMonth === m.id
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : 'hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white w-20">{m.id}</span>
                <span className="text-xs text-slate-400">{m.operations} опер.</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-emerald-400">+{(m.income / 1000).toFixed(0)}K</span>
                <span className="text-xs text-red-400">-{(m.expense / 1000).toFixed(0)}K</span>
                <span className={`text-xs font-medium w-20 text-right ${m.result >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.result >= 0 ? '+' : ''}{(m.result / 1000).toFixed(0)}K
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Operations Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <i className="fas fa-list text-cyan-400"></i>
            Операции за {selectedMonth}
          </h3>
          <span className="text-xs text-slate-400">{bankOperations.length} операций</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Тип</th>
              <th className="text-left pb-3 font-medium">Контрагент</th>
              <th className="text-left pb-3 font-medium">Категория</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-left pb-3 font-medium">Описание</th>
            </tr>
          </thead>
          <tbody>
            {bankOperations.map((op, i) => (
              <tr key={i} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{op.date}</td>
                <td className="py-3">
                  <span className={`badge ${op.type === 'Поступление' ? 'badge-success' : 'badge-danger'}`}>
                    {op.type}
                  </span>
                </td>
                <td className="py-3 text-slate-300 text-xs">{op.counterparty}</td>
                <td className="py-3 text-slate-400 text-xs">{op.category}</td>
                <td className={`py-3 text-right font-medium ${op.sum.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {op.sum} ₽
                </td>
                <td className="py-3 text-slate-500 text-xs truncate max-w-[200px]">{op.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
