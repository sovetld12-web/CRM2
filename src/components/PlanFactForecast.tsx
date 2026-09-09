import { useData } from '../contexts/DataContext';
import { usePeriod } from '../contexts/PeriodContext';

export default function PlanFactForecast() {
  const { leads, moneyOperations, projects } = useData();
  const { selectedMonth, selectedYear } = usePeriod();

  const planKey = `plan_${selectedYear}_${selectedMonth}`;
  const savedPlan = localStorage.getItem(planKey);
  const plan = savedPlan ? JSON.parse(savedPlan) : null;

  // Расчёт факта
  const calculateFact = () => {
    const monthLeads = leads.filter(l => {
      const date = new Date(l.createdAt || l.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const monthSales = monthLeads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');
    
    const monthIncome = moneyOperations
      .filter(m => {
        const date = new Date(m.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear && m.type === 'income';
      })
      .reduce((acc, m) => acc + m.sum, 0);

    const monthExpenses = moneyOperations
      .filter(m => {
        const date = new Date(m.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear && m.type === 'expense';
      })
      .reduce((acc, m) => acc + m.sum, 0);

    const salesSum = monthSales.reduce((acc, l) => acc + l.sum, 0);
    const conversion = monthLeads.length > 0 ? (monthSales.length / monthLeads.length) * 100 : 0;
    const margin = salesSum > 0 ? ((salesSum - monthExpenses) / salesSum) * 100 : 0;

    return {
      leads: monthLeads.length,
      sales: monthSales.length,
      conversion,
      salesSum,
      income: monthIncome,
      margin,
      expenses: monthExpenses,
    };
  };

  // Расчёт прогноза (линейная экстраполяция)
  const calculateForecast = (fact: number, plan: number) => {
    const today = new Date();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const currentDay = today.getDate();
    
    if (currentDay === 0) return plan;
    
    // Линейная экстраполяция
    const forecast = (fact / currentDay) * daysInMonth;
    return Math.round(forecast);
  };

  // Определение статуса
  const getStatus = (forecast: number, plan: number) => {
    if (!plan || plan === 0) return { color: 'text-slate-400', icon: '⚪', label: 'Нет плана' };
    
    const percent = (forecast / plan) * 100;
    
    if (percent >= 90) return { color: 'text-emerald-400', icon: '🟢', label: 'По плану' };
    if (percent >= 70) return { color: 'text-amber-400', icon: '🟡', label: 'Риск' };
    return { color: 'text-red-400', icon: '🔴', label: 'Отставание' };
  };

  const fact = calculateFact();
  
  const metrics = [
    { name: 'Лиды', fact: fact.leads, plan: plan?.leads || 0, format: (v: number) => v.toString() },
    { name: 'Продажи', fact: fact.sales, plan: plan?.sales || 0, format: (v: number) => v.toString() },
    { name: 'Конверсия', fact: fact.conversion, plan: plan?.conversion || 0, format: (v: number) => `${v.toFixed(1)}%` },
    { name: 'Сумма продаж', fact: fact.salesSum, plan: plan?.salesSum || 0, format: (v: number) => `${v.toLocaleString('ru-RU')} ₽` },
    { name: 'Поступления', fact: fact.income, plan: plan?.income || 0, format: (v: number) => `${v.toLocaleString('ru-RU')} ₽` },
    { name: 'Маржа', fact: fact.margin, plan: plan?.margin || 0, format: (v: number) => `${v.toFixed(1)}%` },
    { name: 'Затраты', fact: fact.expenses, plan: plan?.expenses || 0, format: (v: number) => `${v.toLocaleString('ru-RU')} ₽` },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-700/50">
            <th className="text-left pb-2 font-medium">Метрика</th>
            <th className="text-right pb-2 font-medium">План</th>
            <th className="text-right pb-2 font-medium">Факт</th>
            <th className="text-right pb-2 font-medium">Прогноз</th>
            <th className="text-right pb-2 font-medium">Отклонение</th>
            <th className="text-center pb-2 font-medium">Статус</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, i) => {
            const forecast = calculateForecast(metric.fact, metric.plan);
            const status = getStatus(forecast, metric.plan);
            const deviation = metric.plan > 0 ? ((forecast - metric.plan) / metric.plan) * 100 : 0;

            return (
              <tr key={i} className="border-b border-slate-700/30">
                <td className="py-2 text-slate-300">{metric.name}</td>
                <td className="py-2 text-right text-white font-medium">
                  {metric.plan > 0 ? metric.format(metric.plan) : '—'}
                </td>
                <td className="py-2 text-right text-emerald-400 font-medium">
                  {metric.format(metric.fact)}
                </td>
                <td className="py-2 text-right text-cyan-400 font-medium">
                  {metric.plan > 0 ? metric.format(forecast) : '—'}
                </td>
                <td className={`py-2 text-right font-medium ${deviation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.plan > 0 ? `${deviation >= 0 ? '+' : ''}${deviation.toFixed(0)}%` : '—'}
                </td>
                <td className="py-2 text-center">
                  <span className={status.color} title={status.label}>
                    {status.icon}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!plan && (
        <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-300">
            <i className="fas fa-info-circle mr-1"></i>
            План на этот месяц не установлен. Используйте кнопку "Подставить среднее" в блоке "План на месяц".
          </p>
        </div>
      )}
    </div>
  );
}
