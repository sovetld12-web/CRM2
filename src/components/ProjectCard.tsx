interface Vacancy {
  id: string;
  startDate: string;
  client: string;
  vacancy: string;
  firstCandidate: string;
  offer: string;
  days: number;
  norm: number;
  sum: number;
  margin: number;
  status: 'overdue' | 'normal' | 'closed';
}

interface ProjectCardProps {
  vacancy: Vacancy;
  onClose: () => void;
  onCloseVacancy: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ vacancy, onClose, onCloseVacancy, onDelete }: ProjectCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <i className="fas fa-briefcase text-white text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{vacancy.vacancy}</h2>
              <p className="text-sm text-slate-400">{vacancy.client}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`badge text-sm px-4 py-1 ${
            vacancy.status === 'overdue' ? 'badge-danger' :
            vacancy.status === 'closed' ? 'badge-success' : 'badge-info'
          }`}>
            {vacancy.status === 'overdue' ? '⚠️ Просрочено' : vacancy.status === 'closed' ? '✅ Закрыто' : '🔄 В работе'}
          </span>
        </div>

        {/* Main Info */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="p-4 rounded-lg bg-slate-800/30">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <i className="fas fa-clock text-indigo-400"></i>
              Таймлайн
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Дата старта</p>
                <p className="text-sm text-white">{vacancy.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Дней в работе</p>
                <p className={`text-sm font-bold ${vacancy.days > vacancy.norm ? 'text-red-400' : 'text-emerald-400'}`}>
                  {vacancy.days} / {vacancy.norm}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Первый кандидат</p>
                <p className="text-sm text-white">{vacancy.firstCandidate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Оффер</p>
                <p className="text-sm text-white">{vacancy.offer}</p>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
            <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              <i className="fas fa-coins"></i>
              Финансы
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Сумма проекта</p>
                <p className="text-lg font-bold text-white">{vacancy.sum.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Маржа</p>
                <p className="text-lg font-bold text-emerald-400">{vacancy.margin.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </div>

          {/* Risk Alert */}
          {vacancy.status === 'overdue' && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h3 className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                Зона риска
              </h3>
              <p className="text-sm text-slate-300">
                Вакансия в работе более {vacancy.norm} рабочих дней. 
                Рекомендуется провести разбор: причина стопора, следующий кандидат, нужна ли замена стратегии поиска.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-700/50">
          {vacancy.status !== 'closed' && (
            <button
              onClick={() => {
                onCloseVacancy();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <i className="fas fa-check mr-2"></i>Закрыть вакансию
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Удалить эту вакансию?')) {
                onDelete();
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
