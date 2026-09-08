import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Money() {
  const { money, addMoney, deleteMoney } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const [newOp, setNewOp] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'income' as 'income' | 'expense',
    counterparty: '',
    category: 'Поступление клиента',
    paymentType: '',
    sum: 0,
    description: '',
  });

  const handleAdd = () => {
    if (!newOp.counterparty || newOp.sum <= 0) return;
    addMoney(newOp);
    setShowAddModal(false);
    setNewOp({ date: new Date().toISOString().split('T')[0], type: 'income', counterparty: '', category: 'Поступление клиента', paymentType: '', sum: 0, description: '' });
  };

  const income = money.filter(m => m.type === 'income').reduce((a, m) => a + m.sum, 0);
  const expenses = money.filter(m => m.type === 'expense').reduce((a, m) => a + m.sum, 0);
  const net = income - expenses;

  const filteredMoney = filter === 'all' ? money : money.filter(m => m.type === filter);

  const chartData = [
    { name: 'Поступления', value: income, fill: '#10b981' },
    { name: 'Расходы', value: expenses, fill: '#ef4444' },
    { name: 'Чистое', value: net, fill: net >= 0 ? '#06b6d4' : '#f59e0b' },
  ];

  const categories = ['Поступление клиента', 'Вывод на карту', 'Обучение', 'Маркетинг', 'Сервисы', 'Прочее'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Деньги</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Финансовая картина: поступления, расходы, остатки</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить операцию
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{(income / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Поступления</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{(expenses / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Расходы</p>
        </div>
        <div className="metric-card text-center">
          <p className={`text-2xl font-bold ${net >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
            {net >= 0 ? '+' : ''}{(net / 1000).toFixed(0)}K
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Чистое движение</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{money.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Операций</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          <i className="fas fa-chart-bar text-indigo-400 mr-2"></i>
          Структура движения денег
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
            <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Bar key={index} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'all' ? 'var(--text-secondary)' : undefined }}>
          Все ({money.length})
        </button>
        <button onClick={() => setFilter('income')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'income' ? 'var(--text-secondary)' : undefined }}>
          Поступления ({money.filter(m => m.type === 'income').length})
        </button>
        <button onClick={() => setFilter('expense')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'expense' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'expense' ? 'var(--text-secondary)' : undefined }}>
          Расходы ({money.filter(m => m.type === 'expense').length})
        </button>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Тип</th>
              <th className="text-left pb-3 font-medium">Контрагент</th>
              <th className="text-left pb-3 font-medium">Категория</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredMoney.map(op => (
              <tr key={op.id} className="table-row">
                <td className="py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{op.date}</td>
                <td className="py-3">
                  <span className={`badge ${op.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                    {op.type === 'income' ? 'Поступление' : 'Расход'}
                  </span>
                </td>
                <td className="py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{op.counterparty}</td>
                <td className="py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{op.category}</td>
                <td className={`py-3 text-right font-medium ${op.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {op.type === 'income' ? '+' : '-'}{op.sum.toLocaleString('ru-RU')} ₽
                </td>
                <td className="py-3 text-center">
                  <button onClick={() => deleteMoney(op.id)} className="text-red-400 hover:text-red-300 text-xs">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Новая операция" size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Дата</label>
            <input type="date" value={newOp.date} onChange={(e) => setNewOp({ ...newOp, date: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Тип</label>
            <select value={newOp.type} onChange={(e) => setNewOp({ ...newOp, type: e.target.value as any })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <option value="income">Поступление</option>
              <option value="expense">Расход</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Контрагент *</label>
            <input type="text" value={newOp.counterparty} onChange={(e) => setNewOp({ ...newOp, counterparty: e.target.value })} placeholder="Название компании или имя" className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Категория</label>
            <select value={newOp.category} onChange={(e) => setNewOp({ ...newOp, category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Сумма (₽) *</label>
            <input type="number" value={newOp.sum} onChange={(e) => setNewOp({ ...newOp, sum: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Описание</label>
            <textarea value={newOp.description} onChange={(e) => setNewOp({ ...newOp, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }}>Отмена</button>
          <button onClick={handleAdd} disabled={!newOp.counterparty || newOp.sum <= 0} className="btn-primary disabled:opacity-50">
            <i className="fas fa-save mr-2"></i>Сохранить
          </button>
        </div>
      </Modal>
    </div>
  );
}
