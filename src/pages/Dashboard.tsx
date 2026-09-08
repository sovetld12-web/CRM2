import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal, { DetailRow, DetailSection } from '../components/Modal';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';

export default function Dashboard() {
  const { leads, money, projects, tasks } = useData();
  const [detailModal, setDetailModal] = useState<string | null>(null);

  // ============ РАСЧЁТЫ ============
  const activeLeads = leads.filter(l => !['Отказ', 'Продажа'].includes(l.stage));
  const totalLeads = leads.length;
  const salesCount = leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').length;
  const conversionRate = totalLeads > 0 ? Math.round((salesCount / totalLeads) * 100) : 0;
  const activeProjects = projects.length;
  const potentialRevenue = projects.reduce((acc, p) => acc + p.sum, 0) + activeLeads.reduce((acc, l) => acc + l.sum, 0);

  const income = money.filter(m => m.type === 'income').reduce((acc, m) => acc + m.sum, 0);
  const expenses = money.filter(m => m.type === 'expense').reduce((acc, m) => acc + m.sum, 0);
  const netMoney = income - expenses;

  const openTasks = tasks.filter(t => !t.done).length;
  const criticalTasks = tasks.filter(t => !t.done && t.priority === 'critical').length;

  // Данные для графиков
  const monthlyData = [
    { month: 'Янв', leads: 0, sales: 0, revenue: 0 },
    { month: 'Фев', leads: 6, sales: 0, revenue: 0 },
    { month: 'Мар', leads: 12, sales: 5, revenue: 360000 },
    { month: 'Апр', leads: 12, sales: 5, revenue: 312000 },
    { month: 'Май', leads: 20, sales: 11, revenue: 721000 },
    { month: 'Июн', leads: 16, sales: 8, revenue: 607500 },
    { month: 'Июл', leads: 12, sales: 7, revenue: 655000 },
    { month: 'Авг', leads: 37, sales: 9, revenue: 640000 },
    { month: 'Сен', leads: 1, sales: 1, revenue: 50000 },
  ];

  const funnelData = [
    { name: 'Заявка', value: 4, color: '#6366f1' },
    { name: 'Диагностика', value: 2, color: '#06b6d4' },
    { name: 'КП', value: 1, color: '#f59e0b' },
    { name: 'Договор', value: 0, color: '#10b981' },
    { name: 'Продажа', value: 0, color: '#8b5cf6' },
  ];

  const sourceData = [
    { name: 'Профи', value: 5, color: '#3b82f6' },
    { name: 'Авито', value: 0, color: '#10b981' },
    { name: 'Аномалия', value: 1, color: '#8b5cf6' },
    { name: 'Действующий клиент', value: 1, color: '#f59e0b' },
  ];

  const moneyStructure = [
    { name: 'Поступления', value: income, color: '#10b981' },
    { name: 'Расходы', value: expenses, color: '#ef4444' },
  ];

  // ============ РЕНДЕР ============
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Центр управления</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Ключевые показатели. Двойной клик по карточке — детали расчёта
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            <option>Месяц</option>
            <option>Год</option>
            <option>Все время</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard
          icon="Л"
          label="Лиды"
          value={totalLeads.toString()}
          hint="из 14 плана"
          color="indigo"
          onDoubleClick={() => setDetailModal('leads')}
        />
        <KPICard
          icon="₽"
          label="Продажи"
          value={salesCount.toString()}
          hint="сделок за период"
          color="emerald"
          onDoubleClick={() => setDetailModal('sales')}
        />
        <KPICard
          icon="%"
          label="Конверсия"
          value={`${conversionRate}%`}
          hint="от лидов"
          color="cyan"
          onDoubleClick={() => setDetailModal('conversion')}
        />
        <KPICard
          icon="П"
          label="Активные вакансии"
          value={activeProjects.toString()}
          hint="сейчас в работе"
          color="amber"
          onDoubleClick={() => setDetailModal('projects')}
        />
        <KPICard
          icon="₽"
          label="Потенциал"
          value={`${(potentialRevenue / 1000).toFixed(0)}K`}
          hint="проекты + лиды"
          color="violet"
          onDoubleClick={() => setDetailModal('potential')}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Динамика продаж */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <i className="fas fa-chart-area text-indigo-400 mr-2"></i>
              Динамика продаж
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>9 месяцев</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Воронка */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-filter text-cyan-400 mr-2"></i>
            Воронка продаж
          </h3>
          <div className="space-y-2">
            {funnelData.map((step, i) => {
              const maxValue = Math.max(...funnelData.map(s => s.value), 1);
              const width = Math.max((step.value / maxValue) * 100, 10);
              return (
                <div key={i} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.name}</span>
                    <span className="text-xs font-semibold" style={{ color: step.color }}>{step.value}</span>
                  </div>
                  <div className="h-6 rounded-md overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                    <div
                      className="h-full rounded-md transition-all duration-500"
                      style={{ width: `${width}%`, background: step.color, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Лиды по источникам */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-chart-pie text-amber-400 mr-2"></i>
            Источники лидов
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {sourceData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Динамика лидов и сделок */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-chart-bar text-emerald-400 mr-2"></i>
            Лиды и сделки по месяцам
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} name="Лиды" />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="Сделки" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Money + Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Финансы */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-wallet text-emerald-400 mr-2"></i>
            Финансы
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className="text-lg font-bold text-emerald-400">{(income / 1000).toFixed(0)}K</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Поступления</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className="text-lg font-bold text-red-400">{(expenses / 1000).toFixed(0)}K</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Расходы</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className={`text-lg font-bold ${netMoney >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {(netMoney / 1000).toFixed(0)}K
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Чистое</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={[{ name: 'Поступления', value: income }, { name: 'Расходы', value: expenses }]}>
              <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Задачи */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-tasks text-amber-400 mr-2"></i>
            Задачи
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className="text-lg font-bold text-white">{openTasks}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Открыто</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className="text-lg font-bold text-red-400">{criticalTasks}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Критично</p>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <p className="text-lg font-bold text-emerald-400">{tasks.filter(t => t.done).length}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Готово</p>
            </div>
          </div>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {tasks.filter(t => !t.done).slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                <span className={`w-2 h-2 rounded-full ${task.priority === 'critical' ? 'bg-red-400' : task.priority === 'important' ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
                <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{task.title}</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      {detailModal === 'leads' && (
        <Modal isOpen={true} onClose={() => setDetailModal(null)} title="Детализация: Лиды" size="md">
          <DetailSection title="Как считается" icon="fas fa-calculator">
            <DetailRow label="Всего лидов в базе" value={totalLeads} />
            <DetailRow label="В работе (активные)" value={activeLeads.length} hint="Без учёта отказов и продаж" />
            <DetailRow label="Потеряно" value={leads.filter(l => l.stage === 'Отказ').length} />
            <DetailRow label="Закрыто в продажу" value={salesCount} />
          </DetailSection>
          <DetailSection title="Распределение по этапам" icon="fas fa-filter">
            {['Заявка', 'Диагностика', 'КП', 'Договор заключен', 'Продажа', 'Отказ'].map(stage => {
              const count = leads.filter(l => l.stage === stage).length;
              return <DetailRow key={stage} label={stage} value={count} />;
            })}
          </DetailSection>
          <DetailSection title="Распределение по источникам" icon="fas fa-bullseye">
            {['Профи', 'Авито', 'Аномалия', 'Действующий клиент', 'Рекомендация', 'Холодный лид'].map(src => {
              const count = leads.filter(l => l.source === src).length;
              return <DetailRow key={src} label={src} value={count} />;
            })}
          </DetailSection>
        </Modal>
      )}

      {detailModal === 'sales' && (
        <Modal isOpen={true} onClose={() => setDetailModal(null)} title="Детализация: Продажи" size="md">
          <DetailSection title="Как считается" icon="fas fa-calculator">
            <DetailRow label="Всего продаж" value={salesCount} hint="Лиды в статусе 'Продажа' или 'Договор заключен'" />
            <DetailRow label="Сумма продаж" value={`${leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').reduce((a, l) => a + l.sum, 0).toLocaleString('ru-RU')} ₽`} />
            <DetailRow label="Средний чек" value={`${salesCount > 0 ? Math.round(leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').reduce((a, l) => a + l.sum, 0) / salesCount).toLocaleString('ru-RU') : 0} ₽`} />
          </DetailSection>
          <DetailSection title="Список продаж" icon="fas fa-list">
            {leads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').map(lead => (
              <DetailRow key={lead.id} label={`${lead.contact} · ${lead.project}`} value={`${lead.sum.toLocaleString('ru-RU')} ₽`} />
            ))}
            {salesCount === 0 && <p className="text-xs text-slate-500">Продаж пока нет</p>}
          </DetailSection>
        </Modal>
      )}

      {detailModal === 'conversion' && (
        <Modal isOpen={true} onClose={() => setDetailModal(null)} title="Детализация: Конверсия" size="md">
          <DetailSection title="Формула расчёта" icon="fas fa-calculator">
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Конверсия = (Продажи / Всего лидов) × 100%
            </p>
            <DetailRow label="Продажи" value={salesCount} />
            <DetailRow label="Всего лидов" value={totalLeads} />
            <DetailRow label="Конверсия" value={`${conversionRate}%`} color="text-emerald-400" />
          </DetailSection>
          <DetailSection title="Конверсия по источникам" icon="fas fa-bullseye">
            {['Профи', 'Авито', 'Аномалия', 'Действующий клиент'].map(src => {
              const srcLeads = leads.filter(l => l.source === src);
              const srcSales = srcLeads.filter(l => l.stage === 'Продажа' || l.stage === 'Договор заключен').length;
              const srcConv = srcLeads.length > 0 ? Math.round((srcSales / srcLeads.length) * 100) : 0;
              return <DetailRow key={src} label={`${src} (${srcLeads.length} лидов)`} value={`${srcConv}%`} />;
            })}
          </DetailSection>
        </Modal>
      )}

      {detailModal === 'projects' && (
        <Modal isOpen={true} onClose={() => setDetailModal(null)} title="Детализация: Активные проекты" size="lg">
          <DetailSection title="Как считается" icon="fas fa-calculator">
            <DetailRow label="Активных проектов" value={activeProjects} hint="Статус 'В работе'" />
            <DetailRow label="Средний срок в работе" value={`${activeProjects > 0 ? Math.round(projects.reduce((a, p) => a + p.days, 0) / activeProjects) : 0} дн.`} />
            <DetailRow label="Просрочено (30+ дней)" value={projects.filter(p => p.days > 30).length} color="text-red-400" />
          </DetailSection>
          <DetailSection title="Список проектов" icon="fas fa-briefcase">
            {projects.map(p => (
              <DetailRow key={p.id} label={`${p.client} · ${p.vacancy}`} value={`${p.days} дн. · ${(p.sum / 1000).toFixed(0)}K ₽`} />
            ))}
          </DetailSection>
        </Modal>
      )}

      {detailModal === 'potential' && (
        <Modal isOpen={true} onClose={() => setDetailModal(null)} title="Детализация: Потенциальная выручка" size="md">
          <DetailSection title="Формула расчёта" icon="fas fa-calculator">
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Потенциал = Сумма активных проектов + Сумма лидов в работе
            </p>
            <DetailRow label="Активные проекты" value={`${projects.reduce((a, p) => a + p.sum, 0).toLocaleString('ru-RU')} ₽`} />
            <DetailRow label="Лиды в работе" value={`${activeLeads.reduce((a, l) => a + l.sum, 0).toLocaleString('ru-RU')} ₽`} />
            <DetailRow label="ИТОГО потенциал" value={`${potentialRevenue.toLocaleString('ru-RU')} ₽`} color="text-emerald-400" />
          </DetailSection>
        </Modal>
      )}
    </div>
  );
}

// ============ KPI CARD ============
function KPICard({ icon, label, value, hint, color, onDoubleClick }: {
  icon: string;
  label: string;
  value: string;
  hint: string;
  color: string;
  onDoubleClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
  };

  return (
    <div
      className={`metric-card glass-card-hover cursor-pointer bg-gradient-to-br ${colorClasses[color]} border relative group`}
      onDoubleClick={onDoubleClick}
      title="Двойной клик — детали расчёта"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg font-bold">{icon}</span>
        <i className="fas fa-info-circle text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}></i>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{hint}</p>
    </div>
  );
}
