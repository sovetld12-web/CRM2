import { useState } from 'react';
import { useData, Lead } from '../contexts/DataContext';

type LeadStage = Lead['stage'];

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'sleeping'>('all');
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('ru-RU'),
    company: '',
    contact: '',
    phone: '',
    source: 'Профи',
    stage: 'Заявка' as LeadStage,
    product: 'Рекрутинг',
    project: '',
    sum: 0,
    paid: 0,
    nextStep: '',
    nextStepDate: '',
    responsible: 'Любовь',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      date: formData.date,
      company: formData.company,
      contact: formData.contact,
      phone: formData.phone,
      source: formData.source,
      stage: formData.stage,
      product: formData.product,
      project: formData.project,
      sum: formData.sum,
      paid: formData.paid,
      nextStep: formData.nextStep,
      nextStepDate: formData.nextStepDate,
      responsible: formData.responsible,
      comment: formData.comment,
    });
    setShowForm(false);
    setFormData({
      date: new Date().toLocaleDateString('ru-RU'),
      company: '',
      contact: '',
      phone: '',
      source: 'Профи',
      stage: 'Заявка',
      product: 'Рекрутинг',
      project: '',
      sum: 0,
      paid: 0,
      nextStep: '',
      nextStepDate: '',
      responsible: 'Любовь',
      comment: '',
    });
  };

  const filteredLeads = leads.filter(l => {
    if (filter === 'active') return !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage);
    if (filter === 'sleeping') return ['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage);
    return true;
  });

  const activeLeads = leads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage));
  const sleepingLeads = leads.filter(l => ['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage));
  const totalSales = leads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');
  const conversionRate = leads.length > 0 ? ((totalSales.length / leads.length) * 100).toFixed(1) : '0';

  const stages: LeadStage[] = ['Заявка', 'Диагностика', 'КП', 'Договор заключен', 'Продажа', 'Отказ', 'Клиент не отвечает', 'Спящая база'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Лиды</h1>
          <p className="text-sm text-slate-400 mt-1">Воронка продаж и управление лидами</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить лид
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{leads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Всего лидов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{activeLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Активных</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Конверсия</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-slate-400">{sleepingLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1">Спящая база</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Все ({leads.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'active'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Активные ({activeLeads.length})
        </button>
        <button
          onClick={() => setFilter('sleeping')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'sleeping'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}
        >
          Спящая база ({sleepingLeads.length})
        </button>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Контакт</th>
              <th className="text-left pb-3 font-medium">Компания</th>
              <th className="text-left pb-3 font-medium">Источник</th>
              <th className="text-left pb-3 font-medium">Этап</th>
              <th className="text-left pb-3 font-medium">Продукт</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{lead.date}</td>
                <td className="py-3 text-white font-medium">{lead.contact}</td>
                <td className="py-3 text-slate-300">{lead.company || '—'}</td>
                <td className="py-3">
                  <span className="badge badge-info">{lead.source}</span>
                </td>
                <td className="py-3">
                  <select
                    value={lead.stage}
                    onChange={(e) => updateLead(lead.id, { stage: e.target.value as LeadStage })}
                    className="bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-slate-400">{lead.product}</td>
                <td className="py-3 text-right text-white font-medium">{lead.sum.toLocaleString('ru-RU')} ₽</td>
                <td className="py-3 text-center">
                  <button onClick={() => deleteLead(lead.id)} className="text-xs text-red-400 hover:text-red-300">
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
          <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Новый лид</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Контакт *</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Иван Иванов"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Компания</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ООО Пример"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Телефон / Ник</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 999 123-45-67"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Источник *</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    required
                  >
                    <option value="Профи">Профи</option>
                    <option value="Авито">Авито</option>
                    <option value="hh.ru">hh.ru</option>
                    <option value="Рекомендация">Рекомендация</option>
                    <option value="Действующий клиент">Действующий клиент</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Продукт *</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    required
                  >
                    <option value="Рекрутинг">Рекрутинг</option>
                    <option value="Консалтинг">Консалтинг</option>
                    <option value="Абонентка">Абонентка</option>
                    <option value="KPI">KPI</option>
                    <option value="Адаптация">Адаптация</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Сумма (₽) *</label>
                  <input
                    type="number"
                    value={formData.sum}
                    onChange={(e) => setFormData({ ...formData, sum: parseFloat(e.target.value) })}
                    placeholder="50000"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Проект / Вакансия</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="Менеджер по продажам"
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
