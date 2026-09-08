import { useState } from 'react';

export default function Dashboard() {
  const [period, setPeriod] = useState('month');

  const metrics = [
    { icon: 'fas fa-user-plus', label: 'Лиды', value: '1', sub: 'из 14 плана', color: 'indigo', progress: 7 },
    { icon: 'fas fa-handshake', label: 'Продажи', value: '1', sub: 'сделок за период', color: 'cyan', progress: 17 },
    { icon: 'fas fa-percentage', label: 'Конверсия', value: '100%', sub: 'от лидов', color: 'emerald', progress: 100 },
    { icon: 'fas fa-briefcase', label: 'Активные вакансии', value: '10', sub: 'сейчас в работе', color: 'amber', progress: 60 },
    { icon: 'fas fa-ruble-sign', label: 'Потенциальная выручка', value: '860 000', sub: 'проекты + открытые лиды', color: 'violet', progress: 45 },
  ];

  const funnelSteps = [
    { name: 'Лиды', count: 1, total: 1, percent: '100%' },
    { name: 'Квалификация', count: 1, total: 0, percent: '0%' },
    { name: 'Интервью', count: 0, total: 0, percent: '0%' },
    { name: 'Оффер', count: 0, total: 0, percent: '10%' },
    { name: 'Договор', count: 1, total: 1, percent: '100%' },
  ];

  const planFactData = [
    { metric: 'Лиды', plan: '14', fact: '1', forecast: '4', deviation: '-92,9%', status: 'danger' },
    { metric: 'Продажи', plan: '6', fact: '1', forecast: '4', deviation: '-83,3%', status: 'danger' },
    { metric: 'Конверсия', plan: '39%', fact: '100%', forecast: '100%', deviation: '+156,4%', status: 'success' },
    { metric: 'Сумма продаж', plan: '411 938', fact: '50 000', forecast: '187 500', deviation: '-87,9%', status: 'danger' },
    { metric: 'Поступления', plan: '258 352', fact: '126 000', forecast: '472 500', deviation: '-51,2%', status: 'danger' },
    { metric: 'Маркетинг', plan: '5 000', fact: '0', forecast: '0', deviation: '+100%', status: 'success' },
    { metric: 'Затраты', plan: '276 987', fact: '15 000', forecast: '56 250', deviation: '+94,6%', status: 'success' },
  ];

  const risks = [
    { text: 'Лидов меньше плана: 1 из 14', level: 'danger' },
    { text: 'Зависшие вакансии 30+ дней: 5', level: 'warning' },
    { text: 'Просрочены касания: 66', level: 'warning' },
    { text: 'Гарантийные замены в работе: 3', level: 'info' },
  ];

  const stuckVacancies = [
    { client: 'ДК Дюкарева', vacancy: 'МОП', days: 94, status: 'В работе' },
    { client: 'Цивиоми', vacancy: 'подбор бухгалтера', days: 83, status: 'В работе' },
    { client: 'Цивиоми', vacancy: 'подбор ГИП', days: 80, status: 'В работе' },
    { client: 'На колесах', vacancy: 'автомеханик, мастер приемщик', days: 80, status: 'В работе' },
    { client: 'Парковки', vacancy: 'операционный директор', days: 44, status: 'В работе' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/20',
  };

  const iconColorMap: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Центр управления</h1>
          <p className="text-sm text-slate-400 mt-1">Ключевые показатели продаж, производства и денег</p>
        </div>
        <div className="flex items-center gap-2">
          {['month', 'all', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {p === 'month' ? 'Месяц' : p === 'all' ? 'Всё время' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`metric-card bg-gradient-to-br ${colorMap[m.color]} border`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColorMap[m.color]}`}>
                <i className={`${m.icon} text-sm`}></i>
              </div>
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
            <div className="progress-bar mt-3">
              <div className="progress-bar-fill" style={{ width: `${m.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-filter text-indigo-400"></i>
            Воронка: от лида до договора
          </h3>
          <div className="space-y-2">
            {funnelSteps.map((step, i) => (
              <div key={i} className="funnel-step flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-300">{i + 1}</span>
                  </div>
                  <span className="text-sm text-slate-300">{step.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{step.count}</span>
                  <span className="text-xs text-slate-500">{step.percent}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Средний срок закрытия</span>
              <span className="text-white font-medium">0 дней</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Просрочено касаний</span>
              <span className="text-amber-400 font-medium">66</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Лучший источник</span>
              <span className="text-emerald-400 font-medium">Действующий клиент</span>
            </div>
          </div>
        </div>

        {/* Plan vs Fact */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-cyan-400"></i>
            План-факт-прогноз
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="text-left pb-3 font-medium">Метрика</th>
                  <th className="text-right pb-3 font-medium">План</th>
                  <th className="text-right pb-3 font-medium">Факт</th>
                  <th className="text-right pb-3 font-medium">Прогноз</th>
                  <th className="text-right pb-3 font-medium">Откл.</th>
                  <th className="text-center pb-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {planFactData.map((row, i) => (
                  <tr key={i} className="table-row">
                    <td className="py-2.5 text-slate-300 font-medium">{row.metric}</td>
                    <td className="py-2.5 text-right text-slate-400">{row.plan}</td>
                    <td className="py-2.5 text-right text-white font-medium">{row.fact}</td>
                    <td className="py-2.5 text-right text-slate-400">{row.forecast}</td>
                    <td className={`py-2.5 text-right font-medium ${row.status === 'danger' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {row.deviation}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        row.status === 'danger' ? 'bg-red-400' : row.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-amber-400"></i>
            Зоны риска
          </h3>
          <div className="space-y-3">
            {risks.map((risk, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
                risk.level === 'danger' ? 'bg-red-500/5 border border-red-500/10' :
                risk.level === 'warning' ? 'bg-amber-500/5 border border-amber-500/10' :
                'bg-cyan-500/5 border border-cyan-500/10'
              }`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  risk.level === 'danger' ? 'bg-red-400' :
                  risk.level === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                }`}></span>
                <span className="text-sm text-slate-300">{risk.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stuck Vacancies */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-clock text-red-400"></i>
            Зависшие вакансии 30+ дней
          </h3>
          <div className="space-y-2">
            {stuckVacancies.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{v.vacancy}</p>
                  <p className="text-xs text-slate-400">{v.client}</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-danger">{v.days} дн.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-wallet text-emerald-400 text-sm"></i>
            <span className="text-xs text-slate-400">Деньги сейчас</span>
          </div>
          <p className="text-xl font-bold text-white">98 000 ₽</p>
          <p className="text-xs text-slate-500 mt-1">исходящий остаток</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-chart-line text-cyan-400 text-sm"></i>
            <span className="text-xs text-slate-400">Чистая прибыль / прогноз</span>
          </div>
          <p className="text-xl font-bold text-white">416 250 ₽</p>
          <p className="text-xs text-slate-500 mt-1">месячный прогноз</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-arrow-down text-indigo-400 text-sm"></i>
            <span className="text-xs text-slate-400">Ожидаемые поступления</span>
          </div>
          <p className="text-xl font-bold text-white">0 ₽</p>
          <p className="text-xs text-slate-500 mt-1">по финальным кандидатам</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-bell text-amber-400 text-sm"></i>
            <span className="text-xs text-slate-400">Просрочено касаний</span>
          </div>
          <p className="text-xl font-bold text-amber-400">66</p>
          <p className="text-xs text-slate-500 mt-1">спящая база</p>
        </div>
      </div>

      {/* AI Advisor */}
      <div className="glass-card p-5 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI-наставник</h3>
            <p className="text-xs text-slate-400">Разбор периода и управленческие подсказки</p>
          </div>
          <button className="btn-primary ml-auto text-xs">
            <i className="fas fa-magic mr-1"></i> Анализ
          </button>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
          <p className="text-sm text-slate-300 leading-relaxed">
            <span className="text-indigo-400 font-semibold">2026-09:</span> Главный фокус — разобрать зависшие вакансии.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <p className="text-xs text-red-400 font-medium mb-1">Риски</p>
              <p className="text-xs text-slate-400">Лидов: 1 из 14. Зависшие вакансии: 5. Просроченные касания: 66.</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-xs text-indigo-400 font-medium mb-1">Фокус</p>
              <p className="text-xs text-slate-400">Продажи: 1, сумма: 50 000. В работе: 10 вакансий. Потенциал: 860 000.</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-400 font-medium mb-1">Действия</p>
              <p className="text-xs text-slate-400">Закрыть просроченные касания. Принять решение по вакансиям 30+ дней.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
