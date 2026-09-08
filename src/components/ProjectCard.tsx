import { useState } from 'react';
import { Project } from '../contexts/DataContext';

interface ProjectCardProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
}

export default function ProjectCard({ project, onClose, onSave }: ProjectCardProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    client: project?.client || '',
    vacancy: project?.vacancy || '',
    sum: project?.sum || 0,
    days: project?.days || 0,
    status: project?.status || 'В работе',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    sourceLeadId: project?.sourceLeadId,
    endDate: project?.endDate,
    responsible: project?.responsible || 'Любовь',
    contact: project?.contact || '',
    phone: project?.phone || '',
    firstCandidateDate: project?.firstCandidateDate || '',
    offerDate: project?.offerDate || '',
    workStartDate: project?.workStartDate || '',
    paid: project?.paid || 0,
    directCosts: project?.directCosts || 0,
    expectedPaymentDate: project?.expectedPaymentDate || '',
    paymentProbability: project?.paymentProbability || 100,
    closingNorm: project?.closingNorm || 30,
    comment: project?.comment || '',
    pauseReason: project?.pauseReason,
    pauseDate: project?.pauseDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-[16px]">
          <h2 className="text-xl font-semibold text-gray-900">Карточка проекта</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Дата старта
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Клиент *
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="ООО Пример"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Проект / вакансия *
              </label>
              <input
                type="text"
                value={formData.vacancy}
                onChange={(e) => setFormData({ ...formData, vacancy: e.target.value })}
                placeholder="Менеджер по продажам, Разработка мотивации"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Дата направления 1-го кандидата
              </label>
              <input
                type="date"
                value={formData.firstCandidateDate}
                onChange={(e) => setFormData({ ...formData, firstCandidateDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Дата оффера
              </label>
              <input
                type="date"
                value={formData.offerDate}
                onChange={(e) => setFormData({ ...formData, offerDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Дата выхода на работу
              </label>
              <input
                type="date"
                value={formData.workStartDate}
                onChange={(e) => setFormData({ ...formData, workStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Сумма проекта (₽) *
              </label>
              <input
                type="number"
                value={formData.sum}
                onChange={(e) => setFormData({ ...formData, sum: parseFloat(e.target.value) || 0 })}
                placeholder="100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Прямые затраты (₽)
              </label>
              <input
                type="number"
                value={formData.directCosts}
                onChange={(e) => setFormData({ ...formData, directCosts: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Ожидаемая дата оплаты
              </label>
              <input
                type="date"
                value={formData.expectedPaymentDate}
                onChange={(e) => setFormData({ ...formData, expectedPaymentDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Вероятность оплаты, %
              </label>
              <input
                type="number"
                value={formData.paymentProbability}
                onChange={(e) => setFormData({ ...formData, paymentProbability: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Норматив закрытия, дней
              </label>
              <input
                type="number"
                value={formData.closingNorm}
                onChange={(e) => setFormData({ ...formData, closingNorm: parseFloat(e.target.value) || 30 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Контакт
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Иван Иванов"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Телефон / ник
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 999 123-45-67"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Внесено (₽)
              </label>
              <input
                type="number"
                value={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Ответственный
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Любовь"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Комментарий
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Создано автоматически из лида: Ксения. Первый кандидат направлен 05.05..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Сохранить проект
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
