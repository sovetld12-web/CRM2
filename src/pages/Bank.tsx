import { useState, useMemo } from 'react';
import { useData, MoneyOperation } from '../contexts/DataContext';
import Modal from '../components/Modal';

export default function Bank() {
  const { moneyOperations, updateMoneyOperation, deleteMoneyOperation } = useData();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [editingOperation, setEditingOperation] = useState<MoneyOperation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOperations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
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
                  <td className="py-3 text-center">
                    <button
                      onClick={() => {
                        setEditingOperation(op);
                        setShowEditModal(true);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      title="Редактировать"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно редактирования операции */}
      {showEditModal && editingOperation && (
        <EditOperationModal
          operation={editingOperation}
          onClose={() => {
            setShowEditModal(false);
            setEditingOperation(null);
          }}
          onSave={(updates) => {
            updateMoneyOperation(editingOperation.id, updates);
            setShowEditModal(false);
            setEditingOperation(null);
          }}
          onDelete={() => {
            if (confirm('Удалить эту операцию?')) {
              deleteMoneyOperation(editingOperation.id);
              setShowEditModal(false);
              setEditingOperation(null);
            }
          }}
        />
      )}
    </div>
  );
}

// Компонент модального окна редактирования операции
function EditOperationModal({
  operation,
  onClose,
  onSave,
  onDelete,
}: {
  operation: MoneyOperation;
  onClose: () => void;
  onSave: (updates: Partial<MoneyOperation>) => void;
  onDelete: () => void;
}) {
  const [formData, setFormData] = useState({
    date: operation.date,
    type: operation.type,
    counterparty: operation.counterparty,
    category: operation.category,
    sum: operation.sum,
    description: operation.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Редактирование операции">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Дата
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Тип операции
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              required
            >
              <option value="income">Поступление</option>
              <option value="expense">Расход</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Контрагент
          </label>
          <input
            type="text"
            value={formData.counterparty}
            onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Категория (статья)
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Например: Поступление от клиента, Доступы / HH, Маркетинг"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Вы можете изменить категорию операции (статью дохода или расхода)
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Сумма (₽)
          </label>
          <input
            type="number"
            value={formData.sum}
            onChange={(e) => setFormData({ ...formData, sum: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all"
          >
            <i className="fas fa-trash mr-2"></i>
            Удалить
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-sm hover:border-slate-600 transition-all"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <i className="fas fa-check mr-2"></i>
              Сохранить
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
