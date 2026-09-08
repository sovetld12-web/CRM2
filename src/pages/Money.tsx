import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Money() {
  const { moneyOperations, addMoneyOperation, deleteMoneyOperation } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'income' as 'income' | 'expense',
    counterparty: '',
    category: '',
    paymentType: '',
    sum: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMoneyOperation({
      date: formData.date,
      type: formData.type,
      counterparty: formData.counterparty,
      category: formData.category,
      paymentType: formData.paymentType,
      sum: parseFloat(formData.sum),
      description: formData.description,
    });
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      counterparty: '',
      category: '',
      paymentType: '',
      sum: '',
      description: '',
    });
  };

  const totalIncome = moneyOperations
    .filter((m: any) => m.type === 'income')
    .reduce((acc: number, m: any) => acc + m.sum, 0);

  const totalExpense = moneyOperations
    .filter((m: any) => m.type === 'expense')
    .reduce((acc: number, m: any) => acc + m.sum, 0);

  const netMovement = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Деньги</h1>
          <p className="text-sm text-slate-400 mt-1">Финансовая картина агентства</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить операцию
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{(totalIncome / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Поступления ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{(totalExpense / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Расходы ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className={`text-2xl font-bold ${netMovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netMovement >= 0 ? '+' : ''}{(netMovement / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-400 mt-1">Чистое движение</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{moneyOperations.length}</p>
          <p className="text-xs text-slate-400 mt-1">Операций</p>
        </div>
      </div>

      {/* Operations Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Тип</th>
              <th className="text-left pb-3 font-medium">Контрагент</th>
              <th className="text-left pb-3 font-medium">Категория</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-left pb-3 font-medium">Описание</th>
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {moneyOperations.map((op: any) => (
              <tr key={op.id} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{op.date}</td>
                <td className="py-3">
                  <span className={`badge ${op.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                    {op.type === 'income' ? 'Поступление' : 'Расход'}
                  </span>
                </td>
                <td className="py-3 text-slate-300">{op.counterparty}</td>
                <td className="py-3 text-slate-400 text-xs">{op.category}</td>
                <td className={`py-3 text-right font-medium ${op.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {op.type === 'income' ? '+' : '-'}{op.sum.toLocaleString('ru-RU')} ₽
                </td>
                <td className="py-3 text-slate-500 text-xs">{op.description || '—'}</td>
                <td className="py-3 text-center">
                  <button onClick={() => deleteMoneyOperation(op.id)} className="text-xs text-red-400 hover:text-red-300">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Новая операция</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Тип операции *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  required
                >
                  <option value="income">Поступление</option>
                  <option value="expense">Расход</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Дата *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Контрагент *</label>
                <input
                  type="text"
                  value={formData.counterparty}
                  onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
                  placeholder="ООО Клиент"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Категория *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Поступление клиента"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Сумма (₽) *</label>
                <input
                  type="number"
                  value={formData.sum}
                  onChange={(e) => setFormData({ ...formData, sum: e.target.value })}
                  placeholder="50000"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Описание</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Оплата по договору"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
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
