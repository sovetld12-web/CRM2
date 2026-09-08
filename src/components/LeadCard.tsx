import { Lead } from '../contexts/DataContext';

interface LeadCardProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}

export default function LeadCard({ lead, onClose, onUpdate, onDelete }: LeadCardProps) {
  const stages = ['Заявка', 'Диагностика', 'КП', 'Договор заключен', 'Продажа', 'Отказ', 'Клиент не отвечает', 'Спящая база'];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ position: 'relative', zIndex: 10000 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <i className="fas fa-user text-white text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{lead.contact}</h2>
              <p className="text-sm text-slate-400">{lead.company || 'Без компании'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Main Info */}
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-800/30">
            <div>
              <p className="text-xs text-slate-400 mb-1">Телефон / Ник</p>
              <p className="text-sm text-white">{lead.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Источник</p>
              <span className="badge badge-info">{lead.source}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Дата создания</p>
              <p className="text-sm text-white">{lead.date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Ответственный</p>
              <p className="text-sm text-white">{lead.responsible}</p>
            </div>
          </div>

          {/* Deal Info */}
          <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
            <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              <i className="fas fa-handshake"></i>
              Информация о сделке
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Продукт</p>
                <p className="text-sm text-white">{lead.product}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Проект / Вакансия</p>
                <p className="text-sm text-white">{lead.project || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Сумма</p>
                <p className="text-lg font-bold text-white">{lead.sum.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Оплачено</p>
                <p className="text-lg font-bold text-emerald-400">{lead.paid.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </div>

          {/* Stage */}
          <div className="p-4 rounded-lg bg-slate-800/30">
            <p className="text-xs text-slate-400 mb-2">Этап воронки</p>
            <select
              value={lead.stage}
              onChange={(e) => onUpdate(lead.id, { stage: e.target.value as Lead['stage'] })}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Next Step */}
          <div className="p-4 rounded-lg bg-slate-800/30">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fas fa-tasks text-cyan-400"></i>
              Следующий шаг
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Действие</p>
                <p className="text-sm text-white">{lead.nextStep || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Дата</p>
                <p className="text-sm text-white">{lead.nextStepDate || '—'}</p>
              </div>
            </div>
          </div>

          {/* Comment */}
          {lead.comment && (
            <div className="p-4 rounded-lg bg-slate-800/30">
              <p className="text-xs text-slate-400 mb-1">Комментарий</p>
              <p className="text-sm text-white">{lead.comment}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => {
              if (confirm('Удалить этот лид?')) {
                onDelete(lead.id);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            <i className="fas fa-trash mr-2"></i>Удалить
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
