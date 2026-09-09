import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { usePeriod } from '../contexts/PeriodContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface MetricOption {
  id: string;
  label: string;
  color: string;
  unit?: string;
}

const availableMetrics: MetricOption[] = [
  { id: 'salesSum', label: 'Сумма продаж', color: '#10b981', unit: '₽' },
  { id: 'leads', label: 'Лиды', color: '#6366f1' },
  { id: 'prepayments', label: 'Предоплаты', color: '#06b6d4', unit: '₽' },
  { id: 'postpayments', label: 'Постоплаты', color: '#8b5cf6', unit: '₽' },
  { id: 'totalIncome', label: 'Общие поступления', color: '#22c55e', unit: '₽' },
  { id: 'expenses', label: 'Расходы', color: '#ef4444', unit: '₽' },
  { id: 'deals', label: 'Сделки', color: '#f59e0b' },
  { id: 'completedProjects', label: 'Завершено проектов', color: '#ec4899' },
  { id: 'conversion', label: 'Конверсия', color: '#14b8a6', unit: '%' },
];

export default function DynamicChart() {
  const { leads, moneyOperations, projects } = useData();
  const { isInPeriod } = usePeriod();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['salesSum', 'leads']);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Генерация данных по месяцам за последние 6 месяцев
  const chartData = useMemo(() => {
    const months: string[] = [];
    const data: any[] = [];
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getMonth() + 1}.${date.getFullYear()}`;
      const monthName = date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
      months.push(monthKey);
      
      // Фильтруем данные по месяцу
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.createdAt || l.date);
        return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear();
      });
      
      const monthSales = monthLeads.filter(l => 
        l.stage === 'Договор заключен' || l.stage === 'Продажа'
      );
      
      const monthMoney = moneyOperations.filter(m => {
        const opDate = new Date(m.date);
        return opDate.getMonth() === date.getMonth() && opDate.getFullYear() === date.getFullYear();
      });
      
      const monthProjects = projects.filter(p => {
        const projDate = new Date(p.startDate);
        return projDate.getMonth() === date.getMonth() && projDate.getFullYear() === date.getFullYear();
      });
      
      const completedProjects = monthProjects.filter(p => p.status === 'Закрыт');
      
      // Расчёт предоплат и постоплат
      const prepayments = monthMoney
        .filter(m => m.type === 'income' && m.paymentType === 'Предоплата')
        .reduce((sum, m) => sum + m.sum, 0);
      
      const postpayments = monthMoney
        .filter(m => m.type === 'income' && m.paymentType === 'Постоплата')
        .reduce((sum, m) => sum + m.sum, 0);
      
      const totalIncome = monthMoney
        .filter(m => m.type === 'income')
        .reduce((sum, m) => sum + m.sum, 0);
      
      const expenses = monthMoney
        .filter(m => m.type === 'expense')
        .reduce((sum, m) => sum + m.sum, 0);
      
      const conversion = monthLeads.length > 0 
        ? (monthSales.length / monthLeads.length) * 100 
        : 0;
      
      data.push({
        month: monthName,
        monthKey,
        salesSum: monthSales.reduce((sum, l) => sum + l.sum, 0),
        leads: monthLeads.length,
        prepayments,
        postpayments,
        totalIncome,
        expenses,
        deals: monthSales.length,
        completedProjects: completedProjects.length,
        conversion: Math.round(conversion * 10) / 10,
      });
    }
    
    return data;
  }, [leads, moneyOperations, projects]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getMetricLabel = (metricId: string) => {
    return availableMetrics.find(m => m.id === metricId)?.label || metricId;
  };

  const getMetricColor = (metricId: string) => {
    return availableMetrics.find(m => m.id === metricId)?.color || '#6366f1';
  };

  const formatValue = (value: number, metricId: string) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    if (metric?.unit === '₽') {
      return `${(value / 1000).toFixed(0)}K ₽`;
    }
    if (metric?.unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  };

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <i className="fas fa-chart-line text-indigo-400"></i>
          Динамика показателей
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'line'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-chart-line mr-1"></i>Линейный
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-chart-bar mr-1"></i>Столбчатый
          </button>
        </div>
      </div>

      {/* Выбор метрик */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Выберите метрики для отображения:</p>
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedMetrics.includes(metric.id)
                  ? 'bg-opacity-20 border-opacity-30'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-500'
              }`}
              style={{
                backgroundColor: selectedMetrics.includes(metric.id) ? `${metric.color}20` : undefined,
                borderColor: selectedMetrics.includes(metric.id) ? `${metric.color}50` : undefined,
                color: selectedMetrics.includes(metric.id) ? metric.color : undefined,
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* График */}
      {selectedMetrics.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={chartData}>
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
                formatter={(value: number, name: string) => [
                  formatValue(value, name),
                  getMetricLabel(name)
                ]}
              />
              <Legend />
              {selectedMetrics.map((metricId) => (
                <Line
                  key={metricId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={getMetricColor(metricId)}
                  strokeWidth={2}
                  dot={{ fill: getMetricColor(metricId), r: 4 }}
                  name={getMetricLabel(metricId)}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
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
                formatter={(value: number, name: string) => [
                  formatValue(value, name),
                  getMetricLabel(name)
                ]}
              />
              <Legend />
              {selectedMetrics.map((metricId) => (
                <Bar
                  key={metricId}
                  dataKey={metricId}
                  fill={getMetricColor(metricId)}
                  name={getMetricLabel(metricId)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-slate-500 text-sm">
          Выберите хотя бы одну метрику для отображения графика
        </div>
      )}
    </div>
  );
}
