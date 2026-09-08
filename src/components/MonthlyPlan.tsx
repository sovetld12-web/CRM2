import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { usePeriod } from '../contexts/PeriodContext';

interface MonthlyPlanData {
  leads: number;
  sales: number;
  conversion: number;
  salesSum: number;
  income: number;
  margin: number;
  expenses: number;
  fot: number;
  marketing: number;
  accesses: number;
  source: 'average' | 'roadmap' | 'manual';
}

const emptyPlan: MonthlyPlanData = {
  leads: 0,
  sales: 0,
  conversion: 0,
  salesSum: 0,
  income: 0,
  margin: 0,
  expenses: 0,
  fot: 0,
  marketing: 0,
  accesses: 0,
  source: 'manual',
};

export default function MonthlyPlan() {
  const { leads, moneyOperations, projects } = useData();
  const { selectedMonth, selectedYear } = usePeriod();
  const [plan, setPlan] = useState<MonthlyPlanData>(emptyPlan);
  const [averagePeriod, setAveragePeriod] = useState<3 | 6 | 12>(3);
  const [isEditing, setIsEditing] = useState(false);

  const planKey = `plan_${selectedYear}_${selectedMonth}`;

  // Загрузка сохранённого плана
  useEffect(() => {
    const saved = localStorage.getItem(planKey);
    if (saved) {
      setPlan(JSON.parse(saved));
    } else {
      setPlan(emptyPlan);
    }
  }, [planKey, selectedMonth, selectedYear]);

  // Расчёт факта за выбранный месяц
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

  // Расчёт среднего за предыдущие месяцы
  const calculateAverage = () => {
    const historicalData: MonthlyPlanData[] = [];

    for (let i = 1; i <= averagePeriod; i++) {
      let month = selectedMonth - i;
      let year = selectedYear;
      
      if (month < 0) {
        month += 12;
        year -= 1;
      }

      const monthLeads = leads.filter(l => {
        const date = new Date(l.createdAt || l.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });

      const monthSales = monthLeads.filter(l => l.stage === 'Договор заключен' || l.stage === 'Продажа');
      
      const monthIncome = moneyOperations
        .filter(m => {
          const date = new Date(m.date);
          return date.getMonth() === month && date.getFullYear() === year && m.type === 'income';
        })
        .reduce((acc, m) => acc + m.sum, 0);

      const monthExpenses = moneyOperations
        .filter(m => {
          const date = new Date(m.date);
          return date.getMonth() === month && date.getFullYear() === year && m.type === 'expense';
        })
        .reduce((acc, m) => acc + m.sum, 0);

      const salesSum = monthSales.reduce((acc, l) => acc + l.sum, 0);
      const conversion = monthLeads.length > 0 ? (monthSales.length / monthLeads.length) * 100 : 0;
      const margin = salesSum > 0 ? ((salesSum - monthExpenses) / salesSum) * 100 : 0;

      historicalData.push({
        leads: monthLeads.length,
        sales: monthSales.length,
        conversion,
        salesSum,
        income: monthIncome,
        margin,
        expenses: monthExpenses,
        fot: 0,
        marketing: 0,
        accesses: 0,
        source: 'average',
      });
    }

    if (historicalData.length === 0) {
      alert('Нет данных за предыдущие месяцы для расчёта среднего');
      return;
    }

    const avgLeads = Math.round(historicalData.reduce((acc, d) => acc + d.leads, 0) / historicalData.length);
    const avgSales = Math.round(historicalData.reduce((acc, d) => acc + d.sales, 0) / historicalData.length);
    const avgSalesSum = Math.round(historicalData.reduce((acc, d) => acc + d.salesSum, 0) / historicalData.length);
    const avgIncome = Math.round(historicalData.reduce((acc, d) => acc + d.income, 0) / historicalData.length);
    const avgExpenses = Math.round(historicalData.reduce((acc, d) => acc + d.expenses, 0) / historicalData.length);
    
    // Конверсия рассчитывается из средних лидов и продаж
    const avgConversion = avgLeads > 0 ? (avgSales / avgLeads) * 100 : 0;
    // Маржа рассчитывается из выручки и затрат
    const avgMargin = avgSalesSum > 0 ? ((avgSalesSum - avgExpenses) / avgSalesSum) * 100 : 0;

    setPlan({
      leads: avgLeads,
      sales: avgSales,
      conversion: Math.round(avgConversion * 10) / 10,
      salesSum: avgSalesSum,
      income: avgIncome,
      margin: Math.round(avgMargin * 10) / 10,
      expenses: avgExpenses,
      fot: 0,
      marketing: 0,
      accesses: 0,
      source: 'average',
    });

    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem(planKey, JSON.stringify(plan));
    setIsEditing(false);
    alert('План сохранён!');
  };

  const fact = calculateFact();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <div className="space-y-4">
      {/* Заголовок с кнопками */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">
            План на {monthNames[selectedMonth]} {selectedYear}
          </h4>
          {plan.source !== 'manual' && plan.leads > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Источник плана: {plan.source === 'average' ? `Среднее за ${averagePeriod} мес.` : 'Дорожная карта'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={averagePeriod}
            onChange={(e) => setAveragePeriod(Number(e.target.value) as 3 | 6 | 12)}
            className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
          >
            <option value={3}>Среднее за 3 мес.</option>
            <option value={6}>Среднее за 6 мес.</option>
            <option value={12}>Среднее за 12 мес.</option>
          </select>
          <button
            onClick={calculateAverage}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            <i className="fas fa-calculator mr-1"></i>
            Подставить среднее
          </button>
        </div>
      </div>

      {/* Таблица плана */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-2 font-medium">Показатель</th>
              <th className="text-right pb-2 font-medium">План</th>
              <th className="text-right pb-2 font-medium">Факт</th>
              <th className="text-right pb-2 font-medium">Выполнение</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Лиды</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={plan.leads}
                    onChange={(e) => setPlan({ ...plan, leads: parseInt(e.target.value) || 0 })}
                    className="w-20 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.leads}</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.leads}</td>
              <td className="py-2 text-right text-slate-400">
                {plan.leads > 0 ? `${Math.round((fact.leads / plan.leads) * 100)}%` : '—'}
              </td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Продажи</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={plan.sales}
                    onChange={(e) => setPlan({ ...plan, sales: parseInt(e.target.value) || 0 })}
                    className="w-20 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.sales}</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.sales}</td>
              <td className="py-2 text-right text-slate-400">
                {plan.sales > 0 ? `${Math.round((fact.sales / plan.sales) * 100)}%` : '—'}
              </td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Конверсия, %</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={plan.conversion}
                    onChange={(e) => setPlan({ ...plan, conversion: parseFloat(e.target.value) || 0 })}
                    className="w-20 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.conversion.toFixed(1)}%</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.conversion.toFixed(1)}%</td>
              <td className="py-2 text-right text-slate-400">—</td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Сумма продаж</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={plan.salesSum}
                    onChange={(e) => setPlan({ ...plan, salesSum: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.salesSum.toLocaleString('ru-RU')} ₽</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.salesSum.toLocaleString('ru-RU')} ₽</td>
              <td className="py-2 text-right text-slate-400">
                {plan.salesSum > 0 ? `${Math.round((fact.salesSum / plan.salesSum) * 100)}%` : '—'}
              </td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Поступления денег</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={plan.income}
                    onChange={(e) => setPlan({ ...plan, income: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.income.toLocaleString('ru-RU')} ₽</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.income.toLocaleString('ru-RU')} ₽</td>
              <td className="py-2 text-right text-slate-400">
                {plan.income > 0 ? `${Math.round((fact.income / plan.income) * 100)}%` : '—'}
              </td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Маржа, %</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={plan.margin}
                    onChange={(e) => setPlan({ ...plan, margin: parseFloat(e.target.value) || 0 })}
                    className="w-20 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.margin.toFixed(1)}%</span>
                )}
              </td>
              <td className="py-2 text-right text-emerald-400 font-medium">{fact.margin.toFixed(1)}%</td>
              <td className="py-2 text-right text-slate-400">—</td>
            </tr>
            <tr className="border-b border-slate-700/30">
              <td className="py-2 text-slate-300">Затраты</td>
              <td className="py-2 text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={plan.expenses}
                    onChange={(e) => setPlan({ ...plan, expenses: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-slate-900/50 border border-slate-700/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <span className="text-white font-medium">{plan.expenses.toLocaleString('ru-RU')} ₽</span>
                )}
              </td>
              <td className="py-2 text-right text-red-400 font-medium">{fact.expenses.toLocaleString('ru-RU')} ₽</td>
              <td className="py-2 text-right text-slate-400">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Кнопка сохранения */}
      {isEditing && (
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              setIsEditing(false);
              const saved = localStorage.getItem(planKey);
              if (saved) {
                setPlan(JSON.parse(saved));
              } else {
                setPlan(emptyPlan);
              }
            }}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-sm hover:border-slate-600 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <i className="fas fa-check mr-2"></i>
            Сохранить план
          </button>
        </div>
      )}

      {!isEditing && plan.leads > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-xs hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-edit mr-1"></i>
            Редактировать план
          </button>
        </div>
      )}
    </div>
  );
}
