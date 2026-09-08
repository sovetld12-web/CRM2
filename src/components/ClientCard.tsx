import { Lead, Project } from '../contexts/DataContext';

interface ClientCardProps {
  companyName: string;
  leads: Lead[];
  projects: Project[];
  onClose: () => void;
  onOpenLead: (lead: Lead) => void;
}

export default function ClientCard({ companyName, leads = [], projects = [], onClose, onOpenLead }: ClientCardProps) {
  const clientLeads = leads.filter(l => l.company === companyName);
  const clientProjects = projects.filter(p => p.client === companyName);

  const totalSum = clientLeads.reduce((acc, l) => acc + l.sum, 0);
  const totalPaid = clientLeads.reduce((acc, l) => acc + l.paid, 0);
  const activeLeads = clientLeads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage));
  const closedDeals = clientLeads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="glass-card w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto" style={{ position: 'relative', zIndex: 10000 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <i className="fas fa-building text-white text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{companyName}</h2>
              <p className="text-sm text-slate-400">Карточка клиента</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-white">{clientLeads.length}</p>
            <p className="text-xs text-slate-400 mt-1">Всего лидов</p>
          </div>
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-indigo-400">{activeLeads.length}</p>
            <p className="text-xs text-slate-400 mt-1">Активных</p>
          </div>
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-emerald-400">{closedDeals.length}</p>
            <p className="text-xs text-slate-400 mt-1">Закрыто сделок</p>
          </div>
          <div className="metric-card text-center">
            <p className="text-2xl font-bold text-cyan-400">{clientProjects.length}</p>
            <p className="text-xs text-slate-400 mt-1">Проектов</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 mb-6">
          <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
            <i className="fas fa-coins"></i>
            Финансы
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Общая сумма сделок</p>
              <p className="text-lg font-bold text-white">{totalSum.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Оплачено</p>
              <p className="text-lg font-bold text-emerald-400">{totalPaid.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
        </div>

        {/* Leads List */}
        {clientLeads.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fas fa-user-plus text-indigo-400"></i>
              Лиды ({clientLeads.length})
            </h3>
            <div className="space-y-2">
              {clientLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onOpenLead(lead)}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{lead.contact}</p>
                      <p className="text-xs text-slate-400">{lead.project || lead.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-indigo-300 font-medium">{lead.sum.toLocaleString('ru-RU')} ₽</p>
                      <span className="badge badge-info text-[10px]">{lead.stage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects List */}
        {clientProjects.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fas fa-project-diagram text-cyan-400"></i>
              Проекты ({clientProjects.length})
            </h3>
            <div className="space-y-2">
              {clientProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{project.vacancy}</p>
                      <p className="text-xs text-slate-400">{project.days} дней в работе</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-400 font-medium">{project.sum.toLocaleString('ru-RU')} ₽</p>
                      <span className="badge badge-success text-[10px]">{project.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-4 border-t border-slate-700/50">
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
