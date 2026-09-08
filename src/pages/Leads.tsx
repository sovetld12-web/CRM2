import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';

export default function Leads() {
  const { leads, addLead, deleteLead, updateLead } = useData();
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const [newLead, setNewLead] = useState({
    date: new Date().toISOString().split('T')[0],
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

  const handleAdd = () => {
    addLead(newLead);
    setShowAddModal(false);
    setNewLead({
      date: new Date().toISOString().split('T')[0],
      company: '', contact: '', phone: '', source: 'Профи', stage: 'Заявка',
      product: 'Рекрутинг', project: '', sum: 0, paid: 0,
      nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '',
    });
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.stage === filter);

  const stages = ['Заявка', 'Диагностика', 'КП', 'Договор заключен', 'Продажа', 'Клиент не отвечает', 'Отказ'];
  const sources = ['Авито', 'Профи', 'Аномалия', 'Холодный лид', 'Спящая база', 'Действующий клиент', 'Рекомендация', 'Партнерка'];
  const products = ['Рекрутинг', 'Консалтинг', 'Абонентка', 'Продажи', 'Другое'];

  const sourceColors: Record<string, string> = {
    'Профи': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Авито': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Аномалия': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Рекомендация': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Действующий клиент': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Холодный лид': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const activeLeads = leads.filter(l => !['Отказ', 'Продажа'].includes(l.stage));
  const totalSum = leads.reduce((acc, l) => acc + l.sum, 0);
  const salesCount = leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').length;
  const avgCheck = salesCount > 0 ? Math.round(leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').reduce((a, l) => a + l.sum, 0) / salesCount) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Лиды</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Воронка продаж и управление лидами</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800/50 rounded-lg p-0.5 border" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'table' ? 'bg-indigo-500/20 text-indigo-300' : ''}`} style={{ color: view !== 'table' ? 'var(--text-muted)' : undefined }}>
              <i className="fas fa-table mr-1"></i>Таблица
            </button>
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'kanban' ? 'bg-indigo-500/20 text-indigo-300' : ''}`} style={{ color: view !== 'kanban' ? 'var(--text-muted)' : undefined }}>
              <i className="fas fa-columns mr-1"></i>Канбан
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <i className="fas fa-plus mr-2"></i>Добавить лид
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{leads.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Всего лидов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{activeLeads.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>В работе</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{leads.length > 0 ? Math.round((salesCount / leads.length) * 100) : 0}%</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Конверсия</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">{(totalSum / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Общая сумма</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'border border-transparent'}`} style={{ color: filter !== 'all' ? 'var(--text-secondary)' : undefined }}>
          Все ({leads.length})
        </button>
        {stages.map(stage => {
          const count = leads.filter(l => l.stage === stage).length;
          return (
            <button key={stage} onClick={() => setFilter(stage)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === stage ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'border border-transparent'}`} style={{ color: filter !== stage ? 'var(--text-secondary)' : undefined }}>
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {view === 'table' ? (
        <div className="glass-card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
                <th className="text-left pb-3 font-medium">Дата</th>
                <th className="text-left pb-3 font-medium">Контакт</th>
                <th className="text-left pb-3 font-medium">Источник</th>
                <th className="text-left pb-3 font-medium">Этап</th>
                <th className="text-left pb-3 font-medium">Продукт</th>
                <th className="text-right pb-3 font-medium">Сумма</th>
                <th className="text-left pb-3 font-medium">Следующий шаг</th>
                <th className="text-center pb-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="table-row">
                  <td className="py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{lead.date}</td>
                  <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{lead.contact}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${sourceColors[lead.source] || 'bg-slate-500/10 text-slate-400'}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3">
                    <select
                      value={lead.stage}
                      onChange={(e) => updateLead(lead.id, { stage: e.target.value })}
                      className="text-xs px-2 py-1 rounded border"
                      style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                    >
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{lead.product}</td>
                  <td className="py-3 text-right font-medium" style={{ color: 'var(--text-primary)' }}>{lead.sum.toLocaleString('ru-RU')} ₽</td>
                  <td className="py-3 text-xs" style={{ color: lead.nextStepDate ? 'var(--text-secondary)' : '#f87171' }}>
                    {lead.nextStep || 'Нет шага'}
                  </td>
                  <td className="py-3 text-center">
                    <button onClick={() => deleteLead(lead.id)} className="text-red-400 hover:text-red-300 text-xs">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="flex-shrink-0 w-64 rounded-xl border p-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{stage}</h4>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stageLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="kanban-card">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lead.contact}</span>
                        <span className="text-xs text-indigo-300">{lead.sum.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sourceColors[lead.source] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          {lead.source}
                        </span>
                      </div>
                      <button onClick={() => deleteLead(lead.id)} className="text-red-400 hover:text-red-300 text-xs mt-2">
                        <i className="fas fa-trash"></i> Удалить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lead Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Новый лид" size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Дата</label>
            <input type="date" value={newLead.date} onChange={(e) => setNewLead({ ...newLead, date: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Контакт *</label>
            <input type="text" value={newLead.contact} onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })} placeholder="Имя клиента" className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Компания</label>
            <input type="text" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} placeholder="Название компании" className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Телефон / ник</label>
            <input type="text" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Источник</label>
            <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Этап</label>
            <select value={newLead.stage} onChange={(e) => setNewLead({ ...newLead, stage: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Продукт</label>
            <select value={newLead.product} onChange={(e) => setNewLead({ ...newLead, product: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Проект / вакансия</label>
            <input type="text" value={newLead.project} onChange={(e) => setNewLead({ ...newLead, project: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Сумма (₽)</label>
            <input type="number" value={newLead.sum} onChange={(e) => setNewLead({ ...newLead, sum: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Следующий шаг</label>
            <input type="text" value={newLead.nextStep} onChange={(e) => setNewLead({ ...newLead, nextStep: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Комментарий</label>
            <textarea value={newLead.comment} onChange={(e) => setNewLead({ ...newLead, comment: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }}>Отмена</button>
          <button onClick={handleAdd} disabled={!newLead.contact} className="btn-primary disabled:opacity-50">
            <i className="fas fa-save mr-2"></i>Сохранить
          </button>
        </div>
      </Modal>
    </div>
  );
}
