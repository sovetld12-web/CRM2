import { useState } from 'react';

interface Project {
  id: string;
  client: string;
  vacancy: string;
  sum: number;
  days: number;
  candidates: number;
  sent: number;
  hired: number;
  status: 'active' | 'closed';
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', client: 'Алена', vacancy: 'ведение на абонентке', sum: 120000, days: 26, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '2', client: 'ДК Дюкарева', vacancy: 'МОП', sum: 75000, days: 94, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '3', client: 'Дмитрий', vacancy: 'МОП', sum: 80000, days: 10, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '4', client: 'Иван', vacancy: 'ведение компании HR', sum: 120000, days: 7, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '5', client: 'На колесах', vacancy: 'автомеханик', sum: 120000, days: 80, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '6', client: 'Не поседы', vacancy: 'учитель', sum: 30000, days: 23, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '7', client: 'Парковки', vacancy: 'операционный директор', sum: 120000, days: 44, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '8', client: 'Промнастил', vacancy: 'бухгалтер', sum: 80000, days: 16, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '9', client: 'Цивиоми', vacancy: 'подбор бухгалтера', sum: 75000, days: 83, candidates: 0, sent: 0, hired: 0, status: 'active' },
    { id: '10', client: 'Цивиоми', vacancy: 'подбор ГИП', sum: 100000, days: 80, candidates: 0, sent: 0, hired: 0, status: 'active' },
  ]);

  const [selectedProject, setSelectedProject] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ client: '', vacancy: '', sum: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      client: formData.client,
      vacancy: formData.vacancy,
      sum: formData.sum,
      days: 0,
      candidates: 0,
      sent: 0,
      hired: 0,
      status: 'active',
    };
    setProjects([newProject, ...projects]);
    setShowForm(false);
    setFormData({ client: '', vacancy: '', sum: 0 });
  };

  const closeProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: 'closed' as const } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const totalPotential = activeProjects.reduce((acc, p) => acc + p.sum, 0);
  const selected = projects[selectedProject] || projects[0];

  const candidateStages = [
    { name: 'Резюме', count: selected?.candidates || 0, icon: 'fas fa-file-alt', color: 'text-slate-400' },
    { name: 'Интервью', count: selected?.sent || 0, icon: 'fas fa-phone', color: 'text-indigo-400' },
    { name: 'Клиенту', count: 0, icon: 'fas fa-paper-plane', color: 'text-cyan-400' },
    { name: 'Оффер', count: 0, icon: 'fas fa-handshake', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Проекты</h1>
          <p className="text-sm text-slate-400 mt-1">Работа по проектам и кандидатам</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus mr-2"></i>Новый проект
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{activeProjects.length}</p>
          <p className="text-xs text-slate-400 mt-1">Активных проектов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">
            {activeProjects.reduce((acc, p) => acc + p.candidates, 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Кандидатов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {activeProjects.reduce((acc, p) => acc + p.sent, 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Отправлено</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-amber-400">{(totalPotential / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Потенциал ₽</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="glass-card p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white mb-3">Проекты</h3>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {projects.map((p, i) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(i)}
                className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer ${
                  selectedProject === i
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : 'hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{p.client}</p>
                    <p className="text-xs text-slate-400">{p.vacancy}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="text-xs text-indigo-300 font-medium">{p.sum.toLocaleString('ru-RU')} ₽</p>
                      <p className="text-[10px] text-slate-500">{p.days} дн.</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                      className="text-xs text-red-400/50 hover:text-red-400"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Project Details */}
        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selected.client} · {selected.vacancy}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Сумма {selected.sum.toLocaleString('ru-RU')} ₽ · в работе {selected.days} дн. · {selected.candidates} кандидат(ов)
                    </p>
                  </div>
                  {selected.status === 'active' && (
                    <button
                      onClick={() => closeProject(selected.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                    >
                      <i className="fas fa-check mr-1"></i>Закрыть
                    </button>
                  )}
                </div>

                {/* Candidate Funnel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {candidateStages.map((stage, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 text-center">
                      <i className={`${stage.icon} ${stage.color} text-lg mb-1`}></i>
                      <p className="text-lg font-bold text-white">{stage.count}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{stage.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Alert */}
              {selected.days > 30 && selected.candidates === 0 && (
                <div className="glass-card p-4 border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-exclamation-triangle text-amber-400"></i>
                    <div>
                      <p className="text-sm font-medium text-amber-300">Риск проекта</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        По проекту {selected.days} дней без кандидатов. Нужно усилить поиск или пересмотреть профиль.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Новый проект</h2>
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
                <label className="text-xs text-slate-400 mb-1 block">Вакансия *</label>
                <input
                  type="text"
                  value={formData.vacancy}
                  onChange={(e) => setFormData({ ...formData, vacancy: e.target.value })}
                  placeholder="Название позиции"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Сумма (₽) *</label>
                <input
                  type="number"
                  value={formData.sum || ''}
                  onChange={(e) => setFormData({ ...formData, sum: Number(e.target.value) })}
                  placeholder="100000"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50">
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-plus mr-2"></i>Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
