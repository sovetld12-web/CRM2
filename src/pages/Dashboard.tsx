import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { leads, moneyOperations, projects } = useData();

  // Расчет метрик
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage)).length;
  const totalSales = leads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа').length;
  const conversionRate = totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : '0';
  const activeProjects = projects.filter(p => p.status === 'В работе').length;
  
  const totalIncome = moneyOperations
    .filter((m: any) => m.type === 'income')
    .reduce((acc: number, m: any) => acc + m.sum, 0);
  
  const totalExpense = moneyOperations
    .filter((m: any) => m.type === 'expense')
    .reduce((acc: number, m: any) => acc + m.sum, 0);

  const potentialRevenue = leads
    .filter((l: any) => l.stage !== 'Отказ' && l.stage !== 'Спящая база')
    .reduce((acc: number, l: any) => acc + l.sum, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Центр управления</h1>
        <p className="text-sm text-slate-400 mt-1">Ключевые показатели продаж, производства и денег</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Лиды</span>
            <i className="fas fa-user-plus text-indigo-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{totalLeads}</p>
          <p className="text-xs text-slate-400 mt-1">Активных: {activeLeads}</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Продажи</span>
            <i className="fas fa-handshake text-emerald-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{totalSales}</p>
          <p className="text-xs text-slate-400 mt-1">Закрытых сделок</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Конверсия</span>
            <i className="fas fa-percentage text-cyan-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Лид → Продажа</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Проекты</span>
            <i className="fas fa-briefcase text-amber-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{activeProjects}</p>
          <p className="text-xs text-slate-400 mt-1">В работе</p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Потенциал</span>
            <i className="fas fa-chart-line text-violet-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{(potentialRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">₽ в активных лидах</p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-wallet text-emerald-400"></i>
            Финансы
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Поступления</span>
              <span className="text-lg font-bold text-emerald-400">+{(totalIncome / 1000).toFixed(0)}K ₽</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Расходы</span>
              <span className="text-lg font-bold text-red-400">-{(totalExpense / 1000).toFixed(0)}K ₽</span>
            </div>
            <div className="pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Чистое движение</span>
                <span className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalIncome - totalExpense >= 0 ? '+' : ''}{((totalIncome - totalExpense) / 1000).toFixed(0)}K ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-tasks text-indigo-400"></i>
            Воронка продаж
          </h3>
          <div className="space-y-2">
            {['Заявка', 'Диагностика', 'КП', 'Договор заключен', 'Продажа'].map((stage) => {
              const count = leads.filter(l => l.stage === stage).length;
              const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{stage}</span>
                    <span className="text-xs text-slate-300">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-clock text-cyan-400"></i>
          Последние действия
        </h3>
        <div className="space-y-2">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <i className="fas fa-user text-indigo-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{lead.contact}</p>
                  <p className="text-xs text-slate-400">{lead.company || lead.project}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="badge badge-info">{lead.stage}</span>
                <p className="text-xs text-slate-500 mt-1">{lead.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
