import { useData } from '../contexts/DataContext';

export default function History() {
  const { leads, moneyOperations } = useData();

  // Генерация истории за последние 12 месяцев
  const generateHistory = () => {
    const history = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      let month = now.getMonth() - i;
      let year = now.getFullYear();
      
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

      const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];

      history.push({
        month: `${monthNames[month]} ${year}`,
        leads: monthLeads.length,
        sales: monthSales.length,
        conversion: conversion.toFixed(1),
        salesSum: salesSum.toLocaleString('ru-RU'),
        income: monthIncome.toLocaleString('ru-RU'),
        expenses: monthExpenses.toLocaleString('ru-RU'),
      });
    }

    return history;
  };

  const history = generateHistory();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-700/50">
            <th className="text-left pb-2 font-medium">Месяц</th>
            <th className="text-right pb-2 font-medium">Лиды</th>
            <th className="text-right pb-2 font-medium">Сделки</th>
            <th className="text-right pb-2 font-medium">Конверсия</th>
            <th className="text-right pb-2 font-medium">Сумма продаж</th>
            <th className="text-right pb-2 font-medium">Поступления</th>
            <th className="text-right pb-2 font-medium">Затраты</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row, i) => (
            <tr key={i} className="border-b border-slate-700/30">
              <td className="py-2 text-white font-medium">{row.month}</td>
              <td className="py-2 text-right text-slate-300">{row.leads}</td>
              <td className="py-2 text-right text-slate-300">{row.sales}</td>
              <td className="py-2 text-right text-slate-300">{row.conversion}%</td>
              <td className="py-2 text-right text-emerald-400">{row.salesSum} ₽</td>
              <td className="py-2 text-right text-cyan-400">{row.income} ₽</td>
              <td className="py-2 text-right text-red-400">{row.expenses} ₽</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
