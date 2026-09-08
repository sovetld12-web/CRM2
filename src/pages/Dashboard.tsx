import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { leads, moneyOperations, projects, tasks } = useData();
  const [period, setPeriod] = useState<'month' | 'year' | 'all'>('all');
  const [showDetail, setShowDetail] = useState<string | null>(null);

  // ========== РАСЧЁТ МЕТИРИК ==========
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage)).length;
  const totalSales = leads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');
  const conversionRate = totalLeads > 0 ? ((totalSales.length / totalLeads) * 100).toFixed(1) : '0';
  const activeProjects = projects.filter(p => p.status === 'В работе' || p.status === 'active').length;
  const potentialRevenue = leads
    .filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage))
    .reduce((acc, l) => acc + l.sum, 0);

  // Финансы
  const totalIncome = moneyOperations
    .filter(m => m.type === 'income')
    .reduce((acc, m) => acc + m.sum, 0);
  const totalExpense = moneyOperations
    .filter(m => m.type === 'expense')
    .reduce((acc, m) => acc + m.sum, 0);
  const netMovement = totalIncome - totalExpense;
  const profit = totalIncome - totalExpense;

  // Воронка продаж
  const funnelData = [
    { name: 'Заявка', value: leads.filter(l => l.stage === 'Заявка').length, color: '#6366f1' },
    { name: 'Диагностика', value: leads.filter(l => l.stage === 'Диагностика').length, color: '#8b5cf6' },
    { name: 'КП', value: leads.filter(l => l.stage === 'КП').length, color: '#06b6d4' },
    { name: 'Договор', value: leads.filter(l => l.stage === 'Договор заключен').length, color: '#10b981' },
    { name: 'Продажа', value: leads.filter(l => l.stage === 'Продажа').length, color: '#059669' },
  ];

  // Источники лидов
  const sourceData = [
    { name: 'Профи', value: leads.filter(l => l.source === 'Профи').length, color: '#6366f1' },
    { name: 'Авито', value: leads.filter(l => l.source === 'Авито').length, color: '#06b6d4' },
    { name: 'hh.ru', value: leads.filter(l => l.source === 'hh.ru').length, color: '#ef4444' },
    { name: 'Рекомендация', value: leads.filter(l => l.source === 'Рекомендация').length, color: '#f59e0b' },
    { name: 'Другое', value: leads.filter(l => !['Профи', 'Авито', 'hh.ru', 'Рекомендация'].includes(l.source)).length, color: '#8b5cf6' },
  ].filter(s => s.value > 0);

  // Динамика по месяцам (имитация)
  const monthlyData = [
    { month: 'Мар', лиды: 12, продажи: 2, выручка: 150000 },
    { month: 'Апр', лиды: 18, продажи: 3, выручка: 280000 },
    { month: 'Май', лиды: 15, продажи: 2, выручка: 195000 },
    { month: 'Июн', лиды: 22, продажи: 4, выручка: 420000 },
    { month: 'Июл', лиды: 28, продажи: 5, выручка: 510000 },
    { month: 'Авг', лиды: 35, продажи: 6, выручка: 680000 },
    { month: 'Сен', лиды: totalLeads, продажи: totalSales.length, выручка: totalSales.reduce((a, l) => a + l.sum, 0) },
  ];

  // План-факт
  const planRevenue = 1000000; // План на месяц
  const factRevenue = totalSales.reduce((acc, l) => acc + l.sum, 0);
  const planExecution = planRevenue > 0 ? (factRevenue / planRevenue) * 100 : 0;

  // Риски
  const risks = [
    { type: 'warning', text: `${leads.filter(l => l.stage === 'Заявка' && !l.nextStepDate).length} лидов без следующего шага`, icon: 'fas fa-exclamation-triangle' },
    { type: 'danger', text: `${projects.filter(p => p.days > 30 && (p.status === 'В работе' || p.status === 'active')).length} проектов просрочено (>30 дней)`, icon: 'fas fa-clock' },
    { type: 'info', text: `${tasks.filter(t => !t.done && t.priority === 'critical').length} критических задач`, icon: 'fas fa-tasks' },
  ].filter(r => !r.text.startsWith('0'));

  // AI-наставник (локальный анализ)
  const aiAnalysis = {
    focus: parseFloat(conversionRate) < 10 ? 'Увеличить конверсию лидов' : 'Масштабировать продажи',
    risks: risks.length > 0 ? risks[0].text : 'Критических рисков нет',
    actions: [
      'Провести разбор зависших лидов',
      'Активировать спящую базу',
      'Усилить работу с рекомендациями',
    ],
  };

  // Ожидаемые поступления
  const expectedPayments = leads
    .filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа')
    .reduce((acc, l) => acc + (l.sum - l.paid), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Центр управления</h1>
          <p className="text-sm text-slate-400 mt-1">Ключевые показатели продаж, производства и денег</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          >
            <option value="month">Этот месяц</option>
            <option value="year">Этот год</option>
            <option value="all">Всё время</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          className="metric-card cursor-pointer hover:border-indigo-500/30 transition-all"
          onDoubleClick={() => setShowDetail('leads')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Лиды</span>
            <i className="fas fa-user-plus text-indigo-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{totalLeads}</p>
          <p className="text-xs text-slate-400 mt-1">Активных: {activeLeads}</p>
        </div>

        <div
          className="metric-card cursor-pointer hover:border-emerald-500/30 transition-all"
          onDoubleClick={() => setShowDetail('sales')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Продажи</span>
            <i className="fas fa-handshake text-emerald-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{totalSales.length}</p>
          <p className="text-xs text-slate-400 mt-1">На {(totalSales.reduce((a, l) => a + l.sum, 0) / 1000).toFixed(0)}K ₽</p>
        </div>

        <div
          className="metric-card cursor-pointer hover:border-cyan-500/30 transition-all"
          onDoubleClick={() => setShowDetail('conversion')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Конверсия</span>
            <i className="fas fa-percentage text-cyan-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Лид → Продажа</p>
        </div>

        <div
          className="metric-card cursor-pointer hover:border-amber-500/30 transition-all"
          onDoubleClick={() => setShowDetail('projects')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Проекты</span>
            <i className="fas fa-briefcase text-amber-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{activeProjects}</p>
          <p className="text-xs text-slate-400 mt-1">В работе</p>
        </div>

        <div
          className="metric-card cursor-pointer hover:border-violet-500/30 transition-all"
          onDoubleClick={() => setShowDetail('potential')}
        >
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
            <p className="text-sm text-white font-medium">{aiAnalysis.focus}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-300 mb-1">Главный риск</p>
            <p className="text-sm text-white font-medium">{aiAnalysis.risks}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs text-emerald-300 mb-1">Рекомендации</p>
            <ul className="text-xs text-white space-y-1">
              {aiAnalysis.actions.map((action, i) => (
                <li key={i} className="flex items-center gap-1">
                  <i className="fas fa-check text-emerald-400 text-[10px]"></i>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* План-факт */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-bullseye text-indigo-400"></i>
          План-факт
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">План на период</p>
            <p className="text-lg font-bold text-white">{(planRevenue / 1000).toFixed(0)}K ₽</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Факт</p>
            <p className="text-lg font-bold text-emerald-400">{(factRevenue / 1000).toFixed(0)}K ₽</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Выполнение</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 progress-bar">
                <div className="progress-bar-fill" style={{ width: `${Math.min(planExecution, 100)}%` }}></div>
              </div>
              <span className={`text-sm font-bold ${planExecution >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {planExecution.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Динамика выручки */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-chart-area text-emerald-400"></i>
            Динамика выручки
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="выручка" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Лиды и сделки */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-indigo-400"></i>
            Лиды и сделки по месяцам
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="лиды" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="продажи" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Воронка и источники */}
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

      {/* Финансовый обзор */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-wallet text-emerald-400"></i>
          Финансовый обзор
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs text-slate-400 mb-1">Поступления</p>
            <p className="text-lg font-bold text-emerald-400">+{(totalIncome / 1000).toFixed(0)}K ₽</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-xs text-slate-400 mb-1">Расходы</p>
            <p className="text-lg font-bold text-red-400">-{(totalExpense / 1000).toFixed(0)}K ₽</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
            <p className="text-xs text-slate-400 mb-1">Чистое движение</p>
            <p className={`text-lg font-bold ${netMovement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {netMovement >= 0 ? '+' : ''}{(netMovement / 1000).toFixed(0)}K ₽
            </p>
          </div>
          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
            <p className="text-xs text-slate-400 mb-1">Ожидаемые поступления</p>
            <p className="text-lg font-bold text-violet-400">{(expectedPayments / 1000).toFixed(0)}K ₽</p>
          </div>
        </div>
      </div>

      {/* Риски и задачи */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Риски */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-amber-400"></i>
            Риски и предупреждения
          </h3>
          {risks.length > 0 ? (
            <div className="space-y-2">
              {risks.map((risk, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    risk.type === 'danger'
                      ? 'bg-red-500/5 border-red-500/20'
                      : risk.type === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className={`${risk.icon} ${
                      risk.type === 'danger' ? 'text-red-400' : risk.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`}></i>
                    <p className="text-sm text-white">{risk.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Критических рисков нет ✓</p>
          )}
        </div>

        {/* Последние действия */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-history text-cyan-400"></i>
            Последние действия
          </h3>
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-all">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-plus text-indigo-400 text-xs"></i>
                  <div>
                    <p className="text-sm text-white">{lead.contact}</p>
                    <p className="text-xs text-slate-400">{lead.company || lead.product}</p>
                  </div>
                </div>
                <span className="badge badge-info text-[10px]">{lead.stage}</span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Нет действий</p>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна детализации */}
      {showDetail === 'leads' && (
        <Modal isOpen={true} onClose={() => setShowDetail(null)} title="Детализация: Лиды">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-2">Формула расчёта</p>
              <p className="text-sm text-white">Всего лидов = все лиды в системе</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Распределение по этапам</p>
              <div className="space-y-1">
                {funnelData.map((stage, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{stage.name}</span>
                    <span className="text-sm font-bold text-white">{stage.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showDetail === 'sales' && (
        <Modal isOpen={true} onClose={() => setShowDetail(null)} title="Детализация: Продажи">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-2">Формула расчёта</p>
              <p className="text-sm text-white">Продажи = лиды на этапах "Договор заключен" + "Продажа"</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Список продаж</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {totalSales.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                    <span className="text-sm text-white">{lead.contact} — {lead.company}</span>
                    <span className="text-sm font-bold text-emerald-400">{lead.sum.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showDetail === 'conversion' && (
        <Modal isOpen={true} onClose={() => setShowDetail(null)} title="Детализация: Конверсия">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-2">Формула расчёта</p>
              <p className="text-sm text-white">Конверсия = (Продажи / Всего лидов) × 100%</p>
              <p className="text-sm text-white mt-1">= ({totalSales.length} / {totalLeads}) × 100% = {conversionRate}%</p>
            </div>
          </div>
        </Modal>
      )}

      {showDetail === 'projects' && (
        <Modal isOpen={true} onClose={() => setShowDetail(null)} title="Детализация: Проекты">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-2">Активные проекты</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {projects.filter(p => p.status === 'В работе' || p.status === 'active').map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                    <div>
                      <p className="text-sm text-white">{project.vacancy}</p>
                      <p className="text-xs text-slate-400">{project.client}</p>
                    </div>
                    <span className="text-sm font-bold text-amber-400">{project.sum.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showDetail === 'potential' && (
        <Modal isOpen={true} onClose={() => setShowDetail(null)} title="Детализация: Потенциал">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-2">Формула расчёта</p>
              <p className="text-sm text-white">Потенциал = сумма всех активных лидов (исключая Отказ, Спящая база)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Разбивка по лидам</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {leads.filter(l => !['Отказ', 'Спящая база', 'Клиент не отвечает'].includes(l.stage)).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                    <div>
                      <p className="text-sm text-white">{lead.contact}</p>
                      <p className="text-xs text-slate-400">{lead.company || lead.product}</p>
                    </div>
                    <span className="text-sm font-bold text-violet-400">{lead.sum.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
