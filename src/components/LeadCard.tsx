import { useState } from 'react';
import { Lead } from '../contexts/DataContext';

interface LeadCardProps {
  lead: Lead | null;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onNew?: () => void;
}

export default function LeadCard({ lead, onClose, onSave, onNew }: LeadCardProps) {
  const [formData, setFormData] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    date: lead?.date || new Date().toISOString().split('T')[0],
    company: lead?.company || '',
    contact: lead?.contact || '',
    phone: lead?.phone || '',
    source: lead?.source || 'Профи',
    stage: lead?.stage || 'Заявка',
    product: lead?.product || 'Рекрутинг',
    project: lead?.project || '',
    sum: lead?.sum || 0,
    paid: lead?.paid || 0,
    nextStep: lead?.nextStep || '',
    nextStepDate: lead?.nextStepDate || '',
    responsible: lead?.responsible || 'Любовь',
    comment: lead?.comment || '',
  });

  const sources = [
    'Профи',
    'HH',
    'Авито',
    'Telegram',
    'Instagram',
    'Рекомендация',
    'Повторный клиент',
    'Сайт',
    'Другое'
  ];

  const stages = [
    'Новая заявка',
    'Заявка',
    'Связались',
    'Созвон',
    'Предложение',
    'Переговоры',
    'Договор',
    'Оплачено',
    'Отказ',
    'Отложено',
    'Спящая база'
  ];

  const products = [
    'Рекрутинг',
    'Консалтинг',
    'HR-сопровождение',
    'Разработка мотивации',
    'Адаптация / обучение',
    'HR-аудит',
    'Разработка HR-системы',
    'Другой продукт'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (onNew) {
      // Если нажата кнопка "Новая запись", очищаем форму
      setFormData({
        date: new Date().toISOString().split('T')[0],
        company: '',
        contact: '',
        phone: '',
        source: 'Профи',
        stage: 'Заявка',
        product: 'Рекрутинг',
        project: '',
        sum: 0,
        paid: 0,
        nextStep: '',
        nextStepDate: '',
        responsible: 'Любовь',
        comment: '',
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-[1000px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between rounded-t-[16px]">
          <h2 className="text-xl font-semibold text-white">Редактирование лида</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 text-slate-400 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Дата заявки
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Компания
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="ООО Пример"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Контакт *
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Иван Иванов"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Телефон / ник
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 999 123-45-67 или @username"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Источник *
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                required
              >
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Этап *
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Lead['stage'] })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                required
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Продукт *
              </label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                required
              >
                {products.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Сумма (₽) *
              </label>
              <input
                type="number"
                value={formData.sum}
                onChange={(e) => setFormData({ ...formData, sum: parseFloat(e.target.value) || 0 })}
                placeholder="50000"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Внесено (₽)
              </label>
              <input
                type="number"
                value={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Проект / вакансия
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Менеджер по продажам, Разработка мотивации"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Следующий шаг
              </label>
              <input
                type="text"
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                placeholder="Вывести на созвон, Отправить договор"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Дата следующего шага
              </label>
              <input
                type="date"
                value={formData.nextStepDate}
                onChange={(e) => setFormData({ ...formData, nextStepDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ответственный
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Любовь"
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Комментарий
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Для кого KPI: нужна помощь с построением логики KPI..."
              rows={4}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-primary"
              >
                Сохранить лид
              </button>
              {onNew && (
                <button
                  type="button"
                  onClick={() => {
                    onSave(formData);
                    setFormData({
                      date: new Date().toISOString().split('T')[0],
                      company: '',
                      contact: '',
                      phone: '',
                      source: 'Профи',
                      stage: 'Заявка',
                      product: 'Рекрутинг',
                      project: '',
                      sum: 0,
                      paid: 0,
                      nextStep: '',
                      nextStepDate: '',
                      responsible: 'Любовь',
                      comment: '',
                    });
                  }}
                  className="px-6 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:border-slate-600 transition-all"
                >
                  Новая запись
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
