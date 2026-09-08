import { useState } from 'react';

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

export default function Production() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([
    { id: '1', startDate: '30.04.2026', client: 'ДК Дюкарева', vacancy: 'МОП', firstCandidate: '05.05.2026', offer: '22.05.2026', days: 94, norm: 30, sum: 75000, margin: 75000, status: 'overdue' },
    { id: '2', startDate: '15.05.2026', client: 'Цивиоми', vacancy: 'подбор бухгалтера', firstCandidate: '19.05.2026', offer: '—', days: 83, norm: 30, sum: 75000, margin: 75000, status: 'overdue' },
    { id: '3', startDate: '20.05.2026', client: 'Цивиоми', vacancy: 'подбор ГИП', firstCandidate: '26.05.2026', offer: '—', days: 80, norm: 30, sum: 100000, margin: 100000, status: 'overdue' },
    { id: '4', startDate: '20.05.2026', client: 'На колесах', vacancy: 'автомеханик', firstCandidate: '01.06.2026', offer: '—', days: 80, norm: 30, sum: 120000, margin: 120000, status: 'overdue' },
    { id: '5', startDate: '09.07.2026', client: 'Парковки', vacancy: 'операционный директор', firstCandidate: '27.07.2026', offer: '—', days: 44, norm: 30, sum: 120000, margin: 120000, status: 'overdue' },
    { id: '6', startDate: '18.08.2026', client: 'Промнастил', vacancy: 'бухгалтер', firstCandidate: '—', offer: '—', days: 16, norm: 30, sum: 80000, margin: 80000, status: 'normal' },
    { id: '7', startDate: '04.08.2026', client: 'Алена', vacancy: 'ведение на абонентке', firstCandidate: '—', offer: '—', days: 26, norm: 30, sum: 120000, margin: 120000, status: 'normal' },
    { id: '8', startDate: '07.08.2026', client: 'Не поседы', vacancy: 'учитель', firstCandidate: '—', offer: '—', days: 23, norm: 30, sum: 30000, margin: 30000, status: 'normal' },
    { id: '9', startDate: '30.08.2026', client: 'Иван', vacancy: 'ведение компании HR', firstCandidate: '—', offer: '—', days: 7, norm: 30, sum: 120000, margin: 120000, status: 'normal' },
    { id: '10', startDate: '26.08.2026', client: 'Дмитрий', vacancy: 'МОП', firstCandidate: '—', offer: '—', days: 10, norm: 30, sum: 80000, margin: 80000, status: 'normal' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    vacancy: '',
    sum: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVacancy: Vacancy = {
      id: Date.now().toString(),
      startDate: new Date().toLocaleDateString('ru-RU'),
      client: formData.client,
      vacancy: formData.vacancy,
      firstCandidate: '—',
      offer: '—',
      days: 0,
      norm: 30,
      sum: formData.sum,
      margin: formData.sum,
      status: 'normal',
    };
    setVacancies([newVacancy, ...vacancies]);
    setShowForm(false);
    setFormData({ client: '', vacancy: '', sum: 0 });
  };

  const closeVacancy = (id: string) => {
    setVacancies(vacancies.map(v => v.id === id ? { ...v, status: 'closed' as const } : v));
  };

  const deleteVacancy = (id: string) => {
    setVacancies(vacancies.filter(v => v.id !== id));
  };

  const activeCount = vacancies.filter(v => v.status !== 'closed').length;
  const overdueCount = vacancies.filter(v => v.status === 'overdue').length;
  const totalSum = vacancies.filter(v => v.status !== 'closed').reduce((acc, v) => acc + v.sum, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Производство</h1>
          <p className="text-sm text-slate-400 mt-1">Активные вакансии и проекты в работе</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus mr-2"></i>Новый заказ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-xs text-slate-400 mt-1">Активных вакансий</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          <p className="text-xs text-slate-400 mt-1">Просрочено 30+ дней</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{(totalSum / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Потенциал ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{vacancies.filter(v => v.status === 'closed').length}</p>
          <p className="text-xs text-slate-400 mt-1">Закрыто</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата старта</th>
              <th className="text-left pb-3 font-medium">Клиент</th>
              <th className="text-left pb-3 font-medium">Вакансия</th>
              <th className="text-center pb-3 font-medium">Дней</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-center pb-3 font-medium">Статус</th>
              <th className="text-center pb-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((v) => (
              <tr key={v.id} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{v.startDate}</td>
                <td className="py-3 text-white font-medium">{v.client}</td>
                <td className="py-3 text-slate-300">{v.vacancy}</td>
                <td className="py-3 text-center">
                  <span className={`text-xs font-medium ${v.days > v.norm ? 'text-red-400' : 'text-emerald-400'}`}>
                    {v.days} / {v.norm}
                  </span>
                </td>
                <td className="py-3 text-right text-white font-medium">{v.sum.toLocaleString('ru-RU')} ₽</td>
                <td className="py-3 text-center">
                  <span className={`badge ${
                    v.status === 'overdue' ? 'badge-danger' :
                    v.status === 'closed' ? 'badge-success' : 'badge-info'
                  }`}>
                    {v.status === 'overdue' ? 'Просрочено' : v.status === 'closed' ? 'Закрыто' : 'В работе'}
                  </span>
                </td>
                <td className="py-3 text-center space-x-2">
                  {v.status !== 'closed' && (
                    <button
                      onClick={() => closeVacancy(v.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                      title="Закрыть вакансию"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button
                    onClick={() => deleteVacancy(v.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                    title="Удалить"
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
              <h2 className="text-xl font-bold text-white">Новый заказ</h2>
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
                  placeholder="Название вакансии"
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
                  <i className="fas fa-plus mr-2"></i>Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
