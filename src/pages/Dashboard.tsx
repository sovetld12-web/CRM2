import { useData } from '../contexts/DataContext';
import { usePeriod } from '../contexts/PeriodContext';
import Accordion from '../components/Accordion';
import MonthlyPlan from '../components/MonthlyPlan';
import PlanFactForecast from '../components/PlanFactForecast';
import History from '../components/History';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Dashboard() {
  const { leads, moneyOperations, projects, tasks } = useData();
  const { selectedMonth, selectedYear, isInPeriod } = usePeriod();

  // Фильтрация данных по выбранному периоду
  const filteredLeads = leads.filter(l => isInPeriod(l.createdAt || l.date));
  const filteredMoney = moneyOperations.filter(m => isInPeriod(m.date));
  const filteredProjects = projects;

  // Расчёт метрик
  const totalLeads = filteredLeads.length;
  const activeLeads = filteredLeads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage)).length;
  const totalSales = filteredLeads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');
  const conversionRate = totalLeads > 0 ? ((totalSales.length / totalLeads) * 100).toFixed(1) : '0';
  const activeProjects = filteredProjects.filter(p => p.status === 'В работе' || p.status === 'active').length;
  const potentialRevenue = filteredLeads
    .filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage))
    .reduce((acc, l) => acc + l.sum, 0);

  // Финансы
  const totalIncome = filteredMoney
    .filter(m => m.type === 'income')
    .reduce((acc, m) => acc + m.sum, 0);
  const totalExpense = filteredMoney
    .filter(m => m.type === 'expense')
    .reduce((acc, m) => acc + m.sum, 0);
  const netMovement = totalIncome - totalExpense;

  // Воронка продаж
  const funnelData = [
    { name: 'Заявка', value: filteredLeads.filter(l => l.stage === 'Заявка').length, color: '#6366f1' },
    { name: 'Диагностика', value: filteredLeads.filter(l => l.stage === 'Диагностика').length, color: '#8b5cf6' },
    { name: 'КП', value: filteredLeads.filter(l => l.stage === 'КП').length, color: '#06b6d4' },
    { name: 'Договор', value: filteredLeads.filter(l => l.stage === 'Договор заключен').length, color: '#10b981' },
    { name: 'Продажа', value: filteredLeads.filter(l => l.stage === 'Продажа').length, color: '#059669' },
  ];

  // Источники лидов
  const sourceData = [
    { name: 'Профи', value: filteredLeads.filter(l => l.source === 'Профи').length, color: '#6366f1' },
    { name: 'Авито', value: filteredLeads.filter(l => l.source === 'Авито').length, color: '#06b6d4' },
    { name: 'hh.ru', value: filteredLeads.filter(l => l.source === 'hh.ru').length, color: '#ef4444' },
    { name: 'Рекомендация', value: filteredLeads.filter(l => l.source === 'Рекомендация').length, color: '#f59e0b' },
    { name: 'Другое', value: filteredLeads.filter(l => !['Профи', 'Авито', 'hh.ru', 'Рекомендация'].includes(l.source)).length, color: '#8b5cf6' },
  ].filter(s => s.value > 0);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-white">Центр управления</h1>
        <p className="text-sm text-slate-400 mt-1">
          Ключевые показатели за {monthNames[selectedMonth]} {selectedYear}
        </p>
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
          <p className="text-2xl font-bold text-white">{totalSales.length}</p>
          <p className="text-xs text-slate-400 mt-1">На {(totalSales.reduce((a, l) => a + l.sum, 0) / 1000).toFixed(0)}K ₽</p>
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
            <span className="text-xs text-slate-400">Поступления</span>
            <i className="fas fa-wallet text-emerald-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{(totalIncome / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Чистое: {(netMovement / 1000).toFixed(0)}K ₽</p>
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

      {/* AI-наставник */}
      <div className="glass-card p-5 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI-наставник</h3>
            <p className="text-xs text-slate-400">Анализ показателей и рекомендации</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
            <p className="text-xs text-indigo-300 mb-1">Главный фокус</p>
            <p className="text-sm text-white font-medium">
              {parseFloat(conversionRate) < 10 ? 'Увеличить конверсию лидов' : 'Масштабировать продажи'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-300 mb-1">Главный риск</p>
            <p className="text-sm text-white font-medium">
              {filteredLeads.filter(l => l.stage === 'Заявка' && !l.nextStepDate).length > 0 
                ? `${filteredLeads.filter(l => l.stage === 'Заявка' && !l.nextStepDate).length} лидов без следующего шага`
                : 'Критических рисков нет'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs text-emerald-300 mb-1">Рекомендации</p>
            <ul className="text-xs text-white space-y-1">
              <li className="flex items-center gap-1">
                <i className="fas fa-check text-emerald-400 text-[10px]"></i>
                Провести разбор зависших лидов
              </li>
              <li className="flex items-center gap-1">
                <i className="fas fa-check text-emerald-400 text-[10px]"></i>
                Активировать спящую базу
              </li>
              <li className="flex items-center gap-1">
                <i className="fas fa-check text-emerald-400 text-[10px]"></i>
                Усилить работу с рекомендациями
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accordion: План на месяц */}
      <Accordion id="monthly-plan" title="План на месяц" subtitle="Плановые показатели и факт" defaultOpen={true}>
        <MonthlyPlan />
      </Accordion>

      {/* Accordion: Подробный план-факт-прогноз */}
      <Accordion id="plan-fact-forecast" title="Подробный план-факт-прогноз" subtitle="Метрики, отклонения и статус" defaultOpen={false}>
        <PlanFactForecast />
      </Accordion>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Воронка продаж */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-filter text-cyan-400"></i>
            Воронка продаж
          </h3>
          <div className="space-y-3">
            {funnelData.map((stage, i) => {
              const maxValue = Math.max(...funnelData.map(s => s.value), 1);
              const width = (stage.value / maxValue) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{stage.name}</span>
                    <span className="text-xs font-bold text-white">{stage.value}</span>
                  </div>
                  <div className="h-8 rounded-lg overflow-hidden" style={{ background: `${stage.color}20` }}>
                    <div
                      className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(width, 5)}%`, background: stage.color }}
                    >
                      {stage.value > 0 && (
                        <span className="text-xs font-bold text-white">{stage.value}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Источники лидов */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-violet-400"></i>
            Источники лидов
          </h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-500 text-sm">
              Нет данных
            </div>
          )}
        </div>
      </div>

      {/* Accordion: История показателей */}
      <Accordion id="history" title="История показателей по месяцам" subtitle="Динамика в таблице" defaultOpen={false}>
        <History />
      </Accordion>

      {/* Accordion: Дорожная карта (заглушка) */}
      <Accordion id="roadmap" title="Дорожная карта" subtitle="Цели, этапы и контроль выполнения" defaultOpen={false}>
        <div className="text-center py-8">
          <i className="fas fa-road text-4xl text-slate-600 mb-3"></i>
          <p className="text-sm text-slate-400 mb-2">Функция в разработке</p>
          <p className="text-xs text-slate-500">
            В будущем здесь будут отображаться цели и задачи дорожной карты развития бизнеса.
          </p>
        </div>
      </Accordion>
    </div>
  );
}
