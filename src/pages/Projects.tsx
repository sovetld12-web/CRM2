import { useState } from 'react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(0);

  const projects = [
    { client: 'Алена', vacancy: 'ведение на абонентке', sum: '120 000', days: 26, candidates: 0, sent: 0, hired: 0 },
    { client: 'ДК Дюкарева', vacancy: 'МОП', sum: '75 000', days: 94, candidates: 0, sent: 0, hired: 0 },
    { client: 'Дмитрий', vacancy: 'МОП', sum: '80 000', days: 10, candidates: 0, sent: 0, hired: 0 },
    { client: 'Иван', vacancy: 'ведение компании HR', sum: '120 000', days: 7, candidates: 0, sent: 0, hired: 0 },
    { client: 'На колесах', vacancy: 'автомеханик, мастер приемщик', sum: '120 000', days: 80, candidates: 0, sent: 0, hired: 0 },
    { client: 'Не поседы', vacancy: 'учитель начальных классов', sum: '30 000', days: 23, candidates: 0, sent: 0, hired: 0 },
    { client: 'Парковки', vacancy: 'операционный директор', sum: '120 000', days: 44, candidates: 0, sent: 0, hired: 0 },
    { client: 'Промнастил', vacancy: 'бухгалтер', sum: '80 000', days: 16, candidates: 0, sent: 0, hired: 0 },
    { client: 'Цивиоми', vacancy: 'подбор бухгалтера', sum: '75 000', days: 83, candidates: 0, sent: 0, hired: 0 },
    { client: 'Цивиоми', vacancy: 'подбор ГИП', sum: '100 000', days: 80, candidates: 0, sent: 0, hired: 0 },
  ];

  const candidateStages = [
    { name: 'Резюме загружено', count: 0, icon: 'fas fa-file-alt', color: 'text-slate-400' },
    { name: 'Первичное собеседование', count: 0, icon: 'fas fa-phone', color: 'text-indigo-400' },
    { name: 'Направлен заказчику', count: 0, icon: 'fas fa-paper-plane', color: 'text-cyan-400' },
    { name: 'Тестовое задание', count: 0, icon: 'fas fa-clipboard-check', color: 'text-amber-400' },
    { name: 'Собеседование с заказчиком', count: 0, icon: 'fas fa-users', color: 'text-violet-400' },
    { name: 'Оффер', count: 0, icon: 'fas fa-handshake', color: 'text-emerald-400' },
    { name: 'Вышел на работу', count: 0, icon: 'fas fa-check-circle', color: 'text-green-400' },
    { name: 'Отказ', count: 0, icon: 'fas fa-times-circle', color: 'text-red-400' },
  ];

  const selected = projects[selectedProject];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Работа по проектам</h1>
          <p className="text-sm text-slate-400 mt-1">Кандидаты и касания по активным проектам</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <i className="fas fa-upload mr-1"></i>Загрузить резюме
          </button>
          <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Новый кандидат</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">10</p>
          <p className="text-xs text-slate-400 mt-1">Актуальных проектов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">0</p>
          <p className="text-xs text-slate-400 mt-1">Кандидатов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">0</p>
          <p className="text-xs text-slate-400 mt-1">С кандидатами</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-amber-400">860K</p>
          <p className="text-xs text-slate-400 mt-1">Потенциал ₽</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="glass-card p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-white mb-3">Проекты</h3>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {projects.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedProject(i)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
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
                  <div className="text-right">
                    <p className="text-xs text-indigo-300 font-medium">{p.sum} ₽</p>
                    <p className="text-[10px] text-slate-500">{p.days} дн.</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selected.client} · {selected.vacancy}</h3>
                <p className="text-xs text-slate-400 mt-1">Сумма {selected.sum} · в работе {selected.days} раб. дн. · {selected.candidates} кандидат</p>
              </div>
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
          <div className="glass-card p-4 border-amber-500/20">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-amber-400"></i>
              <div>
                <p className="text-sm font-medium text-amber-300">Риск проекта</p>
                <p className="text-xs text-slate-400 mt-0.5">По проекту пока нет кандидатов. Нужно загрузить резюме или внести кандидатов вручную.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
