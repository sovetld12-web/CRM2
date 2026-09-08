export default function Production() {
  const vacancies = [
    { startDate: '30.04.2026', client: 'ДК Дюкарева', vacancy: 'МОП', firstCandidate: '05.05.2026', offer: '22.05.2026', days: 94, norm: 30, sum: '75 000', margin: '75 000', status: 'overdue' },
    { startDate: '15.05.2026', client: 'Цивиоми', vacancy: 'подбор бухгалтера', firstCandidate: '19.05.2026', offer: '—', days: 83, norm: 30, sum: '75 000', margin: '75 000', status: 'overdue' },
    { startDate: '20.05.2026', client: 'Цивиоми', vacancy: 'подбор ГИП', firstCandidate: '26.05.2026', offer: '—', days: 80, norm: 30, sum: '100 000', margin: '100 000', status: 'overdue' },
    { startDate: '20.05.2026', client: 'На колесах', vacancy: 'автомеханик, мастер приемщик', firstCandidate: '01.06.2026', offer: '—', days: 80, norm: 30, sum: '120 000', margin: '120 000', status: 'overdue' },
    { startDate: '09.07.2026', client: 'Парковки', vacancy: 'операционный директор', firstCandidate: '27.07.2026', offer: '—', days: 44, norm: 30, sum: '120 000', margin: '120 000', status: 'overdue' },
    { startDate: '18.08.2026', client: 'Промнастил', vacancy: 'бухгалтер', firstCandidate: '—', offer: '—', days: 16, norm: 30, sum: '80 000', margin: '80 000', status: 'normal' },
    { startDate: '04.08.2026', client: 'Алена', vacancy: 'ведение на абонентке', firstCandidate: '—', offer: '—', days: 26, norm: 30, sum: '120 000', margin: '120 000', status: 'normal' },
    { startDate: '07.08.2026', client: 'Не поседы', vacancy: 'учитель начальных классов', firstCandidate: '—', offer: '—', days: 23, norm: 30, sum: '30 000', margin: '30 000', status: 'normal' },
    { startDate: '30.08.2026', client: 'Иван', vacancy: 'ведение компании HR', firstCandidate: '—', offer: '—', days: 7, norm: 30, sum: '120 000', margin: '120 000', status: 'normal' },
    { startDate: '26.08.2026', client: 'Дмитрий', vacancy: 'МОП', firstCandidate: '—', offer: '—', days: 10, norm: 30, sum: '80 000', margin: '80 000', status: 'normal' },
  ];

  const totalSum = vacancies.reduce((acc, v) => acc + parseInt(v.sum.replace(/\s/g, '')), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Производство</h1>
          <p className="text-sm text-slate-400 mt-1">Активные вакансии и проекты в работе</p>
        </div>
        <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Новый заказ</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">10</p>
          <p className="text-xs text-slate-400 mt-1">Активных вакансий</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">5</p>
          <p className="text-xs text-slate-400 mt-1">Просрочено 30+ дней</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{(totalSum / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Общая сумма</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">0</p>
          <p className="text-xs text-slate-400 mt-1">Закрыто за месяц</p>
        </div>
      </div>

      {/* Vacancies Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Клиент</th>
              <th className="text-left pb-3 font-medium">Вакансия</th>
              <th className="text-center pb-3 font-medium">1-й кандидат</th>
              <th className="text-center pb-3 font-medium">Дней</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-right pb-3 font-medium">Маржа</th>
              <th className="text-center pb-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((v, i) => (
              <tr key={i} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{v.startDate}</td>
                <td className="py-3 text-white font-medium">{v.client}</td>
                <td className="py-3 text-slate-300">{v.vacancy}</td>
                <td className="py-3 text-center text-slate-400 text-xs">{v.firstCandidate}</td>
                <td className="py-3 text-center">
                  <span className={`badge ${v.days > 30 ? 'badge-danger' : 'badge-success'}`}>
                    {v.days} дн.
                  </span>
                </td>
                <td className="py-3 text-right text-white font-medium">{v.sum} ₽</td>
                <td className="py-3 text-right text-emerald-400">{v.margin} ₽</td>
                <td className="py-3 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${v.status === 'overdue' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warranty Replacements */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-exchange-alt text-amber-400"></i>
          Гарантийные замены
        </h3>
        <div className="space-y-2">
          {[
            { date: '12.05.2026', company: 'САМОРИ', vacancy: 'МОП', reason: 'Уволился', status: 'Нужно заменить' },
            { date: '01.05.2026', company: 'ФОРТ', vacancy: 'инженер ПТО', reason: 'Уволился', status: 'Нужно заменить' },
            { date: '21.05.2026', company: 'Нью вей', vacancy: 'МОП ВЭД', reason: 'Уволился', status: 'Нужно заменить' },
          ].map((w, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{w.date}</span>
                <span className="text-sm text-white font-medium">{w.company}</span>
                <span className="text-xs text-slate-400">/ {w.vacancy}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{w.reason}</span>
                <span className="badge badge-danger">{w.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
