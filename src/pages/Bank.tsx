import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';

export default function Bank() {
  const { moneyOperations } = useData();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Группируем операции по месяцам
  const monthlyStats = useMemo(() => {
    const stats: Record<string, { operations: number; income: number; expense: number }> = {};
    
    moneyOperations.forEach(op => {
      const date = new Date(op.date);
      const monthKey = `${date.getMonth() + 1}.${date.getFullYear()}`;
      
      if (!stats[monthKey]) {
        stats[monthKey] = { operations: 0, income: 0, expense: 0 };
      }
      
      stats[monthKey].operations++;
      if (op.type === 'income') {
        stats[monthKey].income += op.sum;
      } else {
        stats[monthKey].expense += op.sum;
      }
    });
    
    // Преобразуем в массив и сортируем по дате (новые сверху)
    return Object.entries(stats)
      .map(([id, data]) => ({
        id,
        ...data,
        result: data.income - data.expense
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.id.split('.').map(Number);
        const [bMonth, bYear] = b.id.split('.').map(Number);
        if (aYear !== bYear) return bYear - aYear;
        return bMonth - aMonth;
      });
  }, [moneyOperations]);

  // Фильтруем операции по выбранному месяцу
  const filteredOperations = useMemo(() => {
    if (!selectedMonth) return moneyOperations;
    
    const [month, year] = selectedMonth.split('.').map(Number);
    return moneyOperations.filter(op => {
      const date = new Date(op.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
  }, [moneyOperations, selectedMonth]);

  // Общая сводка
  const summary = useMemo(() => {
    const income = moneyOperations.filter(op => op.type === 'income').reduce((sum, op) => sum + op.sum, 0);
    const expense = moneyOperations.filter(op => op.type === 'expense').reduce((sum, op) => sum + op.sum, 0);
    const credits = moneyOperations.filter(op => op.category?.toLowerCase().includes('кредит')).reduce((sum, op) => sum + op.sum, 0);
    const cardWithdraw = moneyOperations.filter(op => op.category?.toLowerCase().includes('вывод')).reduce((sum, op) => sum + op.sum, 0);
    
    return {
      operations: moneyOperations.length,
      income,
      expense,
      credits,
      cardWithdraw,
      netMovement: income - expense
    };
  }, [moneyOperations]);

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
          {monthlyStats.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Нет данных</p>
          ) : (
            <>
              <button
                onClick={() => setSelectedMonth(null)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all mb-2 ${
                  selectedMonth === null
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : 'hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-white">Все месяцы</span>
                  <span className="text-xs text-slate-400">{moneyOperations.length} опер.</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-emerald-400">+{(summary.income / 1000).toFixed(0)}K</span>
                  <span className="text-xs text-red-400">-{(summary.expense / 1000).toFixed(0)}K</span>
                  <span className={`text-xs font-medium w-20 text-right ${summary.netMovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {summary.netMovement >= 0 ? '+' : ''}{(summary.netMovement / 1000).toFixed(0)}K
                  </span>
                </div>
              </button>
              {monthlyStats.map((m, i) => (
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
            </>
          )}
        </div>
      </div>

      {/* Operations Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <i className="fas fa-list text-cyan-400"></i>
            {selectedMonth ? `Операции за ${selectedMonth}` : 'Все операции'}
          </h3>
          <span className="text-xs text-slate-400">{filteredOperations.length} операций</span>
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
            {filteredOperations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Нет операций
                </td>
              </tr>
            ) : (
              filteredOperations.map((op) => (
                <tr key={op.id} className="table-row">
                  <td className="py-3 text-slate-400 text-xs">{op.date}</td>
                  <td className="py-3">
                    <span className={`badge ${op.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                      {op.type === 'income' ? 'Поступление' : 'Расход'}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 text-xs">{op.counterparty}</td>
                  <td className="py-3 text-slate-400 text-xs">{op.category}</td>
                  <td className={`py-3 text-right font-medium ${op.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {op.type === 'income' ? '+' : '-'}{op.sum.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="py-3 text-slate-500 text-xs truncate max-w-[200px]">{op.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
