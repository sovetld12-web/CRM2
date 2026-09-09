import { useState } from 'react';

interface Channel {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  leads: number;
  deals: number;
  revenue: number;
  avgDeal: number;
}

export default function Marketing() {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'avito', name: 'Авито', icon: 'fas fa-store', color: 'from-green-500 to-emerald-600', budget: 9800, leads: 28, deals: 3, revenue: 155000, avgDeal: 51667 },
    { id: 'profi', name: 'Профи', icon: 'fas fa-user-tie', color: 'from-blue-500 to-indigo-600', budget: 25000, leads: 42, deals: 5, revenue: 280000, avgDeal: 56000 },
    { id: 'anomaly', name: 'Аномалия', icon: 'fas fa-bolt', color: 'from-purple-500 to-violet-600', budget: 5000, leads: 8, deals: 1, revenue: 50000, avgDeal: 50000 },
    { id: 'hh', name: 'HeadHunter', icon: 'fas fa-search', color: 'from-red-500 to-rose-600', budget: 13000, leads: 0, deals: 0, revenue: 0, avgDeal: 0 },
    { id: 'referral', name: 'Рекомендации', icon: 'fas fa-handshake', color: 'from-amber-500 to-orange-600', budget: 0, leads: 12, deals: 2, revenue: 120000, avgDeal: 60000 },
    { id: 'existing', name: 'Действующие клиенты', icon: 'fas fa-star', color: 'from-cyan-500 to-teal-600', budget: 0, leads: 5, deals: 1, revenue: 50000, avgDeal: 50000 },
    { id: 'cold', name: 'Холодный лид', icon: 'fas fa-snowflake', color: 'from-slate-500 to-gray-600', budget: 0, leads: 3, deals: 0, revenue: 0, avgDeal: 0 },
  ]);

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: '', budget: 0, leads: 0, deals: 0, revenue: 0 });

  // Общие расчёты
  const totalBudget = channels.reduce((sum, ch) => sum + ch.budget, 0);
  const totalLeads = channels.reduce((sum, ch) => sum + ch.leads, 0);
  const totalDeals = channels.reduce((sum, ch) => sum + ch.deals, 0);
  const totalRevenue = channels.reduce((sum, ch) => sum + ch.revenue, 0);

  // CPL (Cost Per Lead) — стоимость лида
  const avgCPL = totalLeads > 0 ? totalBudget / totalLeads : 0;

  // ROMI (Return on Marketing Investment) — окупаемость рекламы
  const romi = totalBudget > 0 ? ((totalRevenue - totalBudget) / totalBudget) * 100 : 0;

  // LTV (Lifetime Value) — средний доход с клиента за всё время
  const avgLTV = totalDeals > 0 ? totalRevenue / totalDeals : 0;

  // CAC (Customer Acquisition Cost) — стоимость привлечения клиента
  const cac = totalDeals > 0 ? totalBudget / totalDeals : 0;

  // LTV/CAC ratio
  const ltvCacRatio = cac > 0 ? avgLTV / cac : 0;

  // Конверсия лид → сделка
  const leadConversion = totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0;

  const formatMoney = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toLocaleString('ru-RU');
  };

  const addChannel = () => {
    if (!newChannel.name) return;
    setChannels([...channels, {
      id: `custom_${Date.now()}`,
      name: newChannel.name,
      icon: 'fas fa-ad',
      color: 'from-pink-500 to-rose-600',
      budget: newChannel.budget,
      leads: newChannel.leads,
      deals: newChannel.deals,
      revenue: newChannel.revenue,
      avgDeal: newChannel.deals > 0 ? newChannel.revenue / newChannel.deals : 0,
    }]);
    setNewChannel({ name: '', budget: 0, leads: 0, deals: 0, revenue: 0 });
    setShowAddChannel(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Маркетинг</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Стоимость лида, окупаемость рекламы и LTV клиентов</p>
        </div>
        <button onClick={() => setShowAddChannel(!showAddChannel)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить канал
        </button>
      </div>

      {/* Add Channel Form */}
      {showAddChannel && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Новый канал привлечения</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Название канала"
              value={newChannel.name}
              onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Бюджет ₽"
              value={newChannel.budget || ''}
              onChange={e => setNewChannel({ ...newChannel, budget: Number(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Лидов"
              value={newChannel.leads || ''}
              onChange={e => setNewChannel({ ...newChannel, leads: Number(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Сделок"
              value={newChannel.deals || ''}
              onChange={e => setNewChannel({ ...newChannel, deals: Number(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Выручка ₽"
              value={newChannel.revenue || ''}
              onChange={e => setNewChannel({ ...newChannel, revenue: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addChannel} className="btn-primary">Сохранить</button>
            <button onClick={() => setShowAddChannel(false)} className="btn-secondary">Отмена</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="metric-card text-center">
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatMoney(totalBudget)}</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Бюджет</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-xl font-bold text-indigo-400">{totalLeads}</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Лидов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-xl font-bold text-cyan-400">{avgCPL > 0 ? Math.round(avgCPL).toLocaleString('ru-RU') : '—'}</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>CPL (₽/лид)</p>
        </div>
        <div className="metric-card text-center">
          <p className={`text-xl font-bold ${romi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {romi > 0 ? '+' : ''}{romi.toFixed(0)}%
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>ROMI</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-xl font-bold text-amber-400">{formatMoney(Math.round(avgLTV))}</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>LTV</p>
        </div>
        <div className="metric-card text-center">
          <p className={`text-xl font-bold ${ltvCacRatio >= 3 ? 'text-emerald-400' : ltvCacRatio >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
            {ltvCacRatio > 0 ? `${ltvCacRatio.toFixed(1)}x` : '—'}
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>LTV/CAC</p>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Economics */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-calculator text-indigo-400"></i>
            Юнит-экономика
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <i className="fas fa-user-plus text-indigo-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>CPL</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Стоимость лида</p>
                </div>
              </div>
              <p className="text-lg font-bold text-indigo-400">{avgCPL > 0 ? `${Math.round(avgCPL).toLocaleString('ru-RU')} ₽` : '—'}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <i className="fas fa-user-check text-cyan-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>CAC</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Стоимость клиента</p>
                </div>
              </div>
              <p className="text-lg font-bold text-cyan-400">{cac > 0 ? `${Math.round(cac).toLocaleString('ru-RU')} ₽` : '—'}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <i className="fas fa-gem text-amber-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>LTV</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Пожизненная ценность</p>
                </div>
              </div>
              <p className="text-lg font-bold text-amber-400">{avgLTV > 0 ? `${Math.round(avgLTV).toLocaleString('ru-RU')} ₽` : '—'}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i className="fas fa-chart-line text-emerald-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>ROMI</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Окупаемость рекламы</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${romi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {romi > 0 ? '+' : ''}{romi.toFixed(0)}%
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <i className="fas fa-percentage text-violet-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Конверсия</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Лид → Сделка</p>
                </div>
              </div>
              <p className="text-lg font-bold text-violet-400">{leadConversion.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-chart-pie text-cyan-400"></i>
            Анализ окупаемости
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Вложено в маркетинг</span>
                <span className="text-sm font-bold text-red-400">-{totalBudget.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #ef4444, #f97316)' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Получено выручки</span>
                <span className="text-sm font-bold text-emerald-400">+{totalRevenue.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: totalBudget > 0 ? `${Math.min((totalRevenue / totalBudget) * 50, 100)}%` : '0%' }}></div>
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-input)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Чистая прибыль от маркетинга</span>
                <span className={`text-sm font-bold ${totalRevenue - totalBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalRevenue - totalBudget >= 0 ? '+' : ''}{(totalRevenue - totalBudget).toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{
                  width: totalRevenue > 0 ? `${Math.min(Math.abs((totalRevenue - totalBudget) / totalRevenue) * 100, 100)}%` : '0%',
                  background: totalRevenue - totalBudget >= 0 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #ef4444, #f97316)'
                }}></div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="mt-4 p-3 rounded-lg border" style={{
              background: romi >= 100 ? 'rgba(16, 185, 129, 0.05)' : romi >= 0 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(239, 68, 68, 0.05)',
              borderColor: romi >= 100 ? 'rgba(16, 185, 129, 0.2)' : romi >= 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
            }}>
              <div className="flex items-start gap-2">
                <i className={`fas ${romi >= 100 ? 'fa-check-circle text-emerald-400' : romi >= 0 ? 'fa-exclamation-circle text-amber-400' : 'fa-times-circle text-red-400'} mt-0.5`}></i>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {romi >= 100 ? 'Отличная окупаемость!' : romi >= 0 ? 'Маркетинг окупается' : 'Маркетинг не окупается'}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {romi >= 100
                      ? `Каждый ₽ в маркетинге приносит ${((totalRevenue / totalBudget)).toFixed(1)} ₽ выручки. Масштабируйте эффективные каналы.`
                      : romi >= 0
                        ? 'Выручка покрывает расходы на маркетинг. Ищите точки роста конверсии.'
                        : 'Расходы превышают выручку. Пересмотрите каналы и конверсию.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channels Table */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <i className="fas fa-layer-group text-violet-400"></i>
          Каналы привлечения
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
                <th className="text-left pb-3 font-medium">Канал</th>
                <th className="text-right pb-3 font-medium">Бюджет</th>
                <th className="text-right pb-3 font-medium">Лидов</th>
                <th className="text-right pb-3 font-medium">CPL</th>
                <th className="text-right pb-3 font-medium">Сделок</th>
                <th className="text-right pb-3 font-medium">CAC</th>
                <th className="text-right pb-3 font-medium">Выручка</th>
                <th className="text-right pb-3 font-medium">ROMI</th>
                <th className="text-center pb-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch) => {
                const cpl = ch.leads > 0 ? ch.budget / ch.leads : 0;
                const channelCac = ch.deals > 0 ? ch.budget / ch.deals : 0;
                const channelRomi = ch.budget > 0 ? ((ch.revenue - ch.budget) / ch.budget) * 100 : 0;
                const channelLtv = ch.deals > 0 ? ch.revenue / ch.deals : 0;

                return (
                  <tr key={ch.id} className="table-row">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${ch.color} flex items-center justify-center`}>
                          <i className={`${ch.icon} text-white text-[10px]`}></i>
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{ch.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {ch.budget > 0 ? `${ch.budget.toLocaleString('ru-RU')} ₽` : '—'}
                    </td>
                    <td className="py-3 text-right text-xs" style={{ color: 'var(--text-primary)' }}>{ch.leads}</td>
                    <td className="py-3 text-right text-xs text-indigo-400">
                      {cpl > 0 ? `${Math.round(cpl).toLocaleString('ru-RU')} ₽` : '—'}
                    </td>
                    <td className="py-3 text-right text-xs" style={{ color: 'var(--text-primary)' }}>{ch.deals}</td>
                    <td className="py-3 text-right text-xs text-cyan-400">
                      {channelCac > 0 ? `${Math.round(channelCac).toLocaleString('ru-RU')} ₽` : '—'}
                    </td>
                    <td className="py-3 text-right text-xs text-emerald-400 font-medium">
                      {ch.revenue > 0 ? `${ch.revenue.toLocaleString('ru-RU')} ₽` : '—'}
                    </td>
                    <td className={`py-3 text-right text-xs font-medium ${channelRomi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ch.budget > 0 ? `${channelRomi > 0 ? '+' : ''}${channelRomi.toFixed(0)}%` : '∞'}
                    </td>
                    <td className="py-3 text-center">
                      {channelRomi >= 100 ? (
                        <span className="badge badge-success">Отлично</span>
                      ) : channelRomi >= 0 ? (
                        <span className="badge badge-warning">Окупается</span>
                      ) : ch.budget > 0 ? (
                        <span className="badge badge-danger">Убыток</span>
                      ) : (
                        <span className="badge badge-info">Бесплатный</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t font-medium" style={{ borderColor: 'var(--border-color)' }}>
                <td className="py-3 text-sm" style={{ color: 'var(--text-primary)' }}>Итого</td>
                <td className="py-3 text-right text-sm text-red-400">{totalBudget.toLocaleString('ru-RU')} ₽</td>
                <td className="py-3 text-right text-sm" style={{ color: 'var(--text-primary)' }}>{totalLeads}</td>
                <td className="py-3 text-right text-sm text-indigo-400">{avgCPL > 0 ? `${Math.round(avgCPL).toLocaleString('ru-RU')} ₽` : '—'}</td>
                <td className="py-3 text-right text-sm" style={{ color: 'var(--text-primary)' }}>{totalDeals}</td>
                <td className="py-3 text-right text-sm text-cyan-400">{cac > 0 ? `${Math.round(cac).toLocaleString('ru-RU')} ₽` : '—'}</td>
                <td className="py-3 text-right text-sm text-emerald-400">{totalRevenue.toLocaleString('ru-RU')} ₽</td>
                <td className={`py-3 text-right text-sm font-bold ${romi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {romi > 0 ? '+' : ''}{romi.toFixed(0)}%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* LTV by Client */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <i className="fas fa-users text-amber-400"></i>
          LTV по клиентам (повторные продажи)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Промнастил', orders: 3, totalSpent: 168000, period: '8 мес.', ltv: 168000 },
            { name: 'ООО "Восход"', orders: 2, totalSpent: 60000, period: '5 мес.', ltv: 60000 },
            { name: 'Нью Вей', orders: 2, totalSpent: 60000, period: '4 мес.', ltv: 60000 },
            { name: 'Стройград', orders: 1, totalSpent: 62500, period: '3 мес.', ltv: 62500 },
            { name: 'Цивиоми', orders: 2, totalSpent: 175000, period: '6 мес.', ltv: 175000 },
            { name: 'Ланторо', orders: 1, totalSpent: 50000, period: '2 мес.', ltv: 50000 },
          ].map((client, i) => (
            <div key={i} className="channel-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{client.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc' }}>
                  {client.orders} заказа
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Общая сумма</p>
                  <p className="text-sm font-bold text-emerald-400">{client.totalSpent.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Период</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{client.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-5 border-emerald-500/20">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <i className="fas fa-lightbulb text-amber-400"></i>
          Рекомендации
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <i className="fas fa-check text-emerald-400 text-xs mt-1"></i>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Профи</strong> — лучший канал по ROMI. Увеличьте бюджет на 30-50%.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fas fa-check text-emerald-400 text-xs mt-1"></i>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Рекомендации</strong> — бесплатный канал с высоким LTV. Внедрите реферальную программу.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fas fa-exclamation text-amber-400 text-xs mt-1"></i>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>HeadHunter</strong> — не приносит лидов напрямую. Используйте только для закрытия вакансий.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fas fa-arrow-up text-cyan-400 text-xs mt-1"></i>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Цель:</strong> LTV/CAC ≥ 3x. Сейчас {ltvCacRatio.toFixed(1)}x. {ltvCacRatio >= 3 ? 'Норма!' : 'Работайте над конверсией и повторными продажами.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
