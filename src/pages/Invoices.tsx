import { useState } from 'react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  client: string;
  service: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', number: 'КР-001', date: '01.09.2026', client: 'Промнастил', service: 'Подбор бухгалтера', amount: 80000, status: 'sent', dueDate: '15.09.2026' },
    { id: '2', number: 'КР-002', date: '02.09.2026', client: 'Браун И.В.', service: 'Подбор МОП', amount: 60000, status: 'paid', dueDate: '16.09.2026' },
    { id: '3', number: 'КР-003', date: '15.08.2026', client: 'Цивиоми', service: 'Подбор ГИП', amount: 100000, status: 'overdue', dueDate: '30.08.2026' },
    { id: '4', number: 'КР-004', date: '20.08.2026', client: 'ДК Дюкарева', service: 'Подбор МОП', amount: 75000, status: 'overdue', dueDate: '04.09.2026' },
    { id: '5', number: 'КР-005', date: '25.08.2026', client: 'На колесах', service: 'Автомеханик', amount: 120000, status: 'sent', dueDate: '10.09.2026' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    service: '',
    amount: 0,
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: `КР-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('ru-RU'),
      client: formData.client,
      service: formData.service,
      amount: formData.amount,
      status: 'draft',
      dueDate: formData.dueDate,
    };
    setInvoices([newInvoice, ...invoices]);
    setShowForm(false);
    setFormData({ client: '', service: '', amount: 0, dueDate: '' });
  };

  const updateStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((acc, i) => acc + i.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0),
  };

  const statusLabels = {
    draft: 'Черновик',
    sent: 'Отправлен',
    paid: 'Оплачен',
    overdue: 'Просрочен',
  };

  const statusColors = {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    sent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Счета</h1>
          <p className="text-sm text-slate-400 mt-1">Выставленные счета и оплаты</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus mr-2"></i>Выставить счёт
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">Всего счетов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{(stats.totalAmount / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Общая сумма ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{(stats.paidAmount / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Оплачено ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
          <p className="text-xs text-slate-400 mt-1">Просрочено</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Номер</th>
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Клиент</th>
              <th className="text-left pb-3 font-medium">Услуга</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-left pb-3 font-medium">Срок оплаты</th>
              <th className="text-center pb-3 font-medium">Статус</th>
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="table-row">
                <td className="py-3 text-white font-medium">{inv.number}</td>
                <td className="py-3 text-slate-400 text-xs">{inv.date}</td>
                <td className="py-3 text-slate-300">{inv.client}</td>
                <td className="py-3 text-slate-400">{inv.service}</td>
                <td className="py-3 text-right text-white font-medium">{inv.amount.toLocaleString('ru-RU')} ₽</td>
                <td className="py-3 text-slate-400 text-xs">{inv.dueDate}</td>
                <td className="py-3 text-center">
                  <select
                    value={inv.status}
                    onChange={(e) => updateStatus(inv.id, e.target.value as Invoice['status'])}
                    className={`text-xs px-2 py-1 rounded border ${statusColors[inv.status]} bg-transparent cursor-pointer`}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key} className="bg-slate-800">{label}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => deleteInvoice(inv.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
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
              <h2 className="text-xl font-bold text-white">Выставить счёт</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Клиент *</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Название компании"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Услуга *</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Подбор персонала"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Сумма (₽) *</label>
                <input
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="100000"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Срок оплаты *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50">
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-check mr-2"></i>Выставить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
