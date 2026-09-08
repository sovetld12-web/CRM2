import { useState } from 'react';

interface Document {
  id: string;
  type: 'contract' | 'prepayment' | 'postpayment' | 'application' | 'subscription';
  client: string;
  number: string;
  date: string;
  service: string;
  amount: number;
  prepayment: number;
  status: 'draft' | 'sent' | 'signed' | 'paid';
  project?: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'registry'>('create');

  const [formData, setFormData] = useState({
    client: '',
    number: '',
    date: new Date().toISOString().split('T')[0],
    service: '',
    amount: 0,
    prepayment: 30,
    project: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Создаём договор
    const contract: Document = {
      id: Date.now().toString(),
      type: 'contract',
      client: formData.client,
      number: formData.number,
      date: formData.date,
      service: formData.service,
      amount: formData.amount,
      prepayment: formData.prepayment,
      status: 'draft',
      project: formData.project,
    };

    // Создаём акт предоплаты
    const prepaymentAct: Document = {
      id: (Date.now() + 1).toString(),
      type: 'prepayment',
      client: formData.client,
      number: `${formData.number}-П`,
      date: formData.date,
      service: formData.service,
      amount: (formData.amount * formData.prepayment) / 100,
      prepayment: formData.prepayment,
      status: 'draft',
      project: formData.project,
    };

    // Создаём акт постоплаты
    const postpaymentAct: Document = {
      id: (Date.now() + 2).toString(),
      type: 'postpayment',
      client: formData.client,
      number: `${formData.number}-О`,
      date: formData.date,
      service: formData.service,
      amount: (formData.amount * (100 - formData.prepayment)) / 100,
      prepayment: formData.prepayment,
      status: 'draft',
      project: formData.project,
    };

    setDocuments([contract, prepaymentAct, postpaymentAct, ...documents]);
    setShowForm(false);
    setFormData({
      client: '',
      number: '',
      date: new Date().toISOString().split('T')[0],
      service: '',
      amount: 0,
      prepayment: 30,
      project: '',
    });
  };

  const stats = {
    contracts: documents.filter((d) => d.type === 'contract').length,
    prepayments: documents.filter((d) => d.type === 'prepayment').length,
    postpayments: documents.filter((d) => d.type === 'postpayment').length,
    totalAmount: documents
      .filter((d) => d.type === 'contract')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  const typeLabels = {
    contract: 'Договор',
    prepayment: 'Акт предоплаты',
    postpayment: 'Акт постоплаты',
    application: 'Заявка',
    subscription: 'Абонентский счёт',
  };

  const typeIcons = {
    contract: 'fas fa-file-contract',
    prepayment: 'fas fa-file-invoice-dollar',
    postpayment: 'fas fa-file-invoice',
    application: 'fas fa-file-alt',
    subscription: 'fas fa-file-signature',
  };

  const statusLabels = {
    draft: 'Черновик',
    sent: 'Отправлен',
    signed: 'Подписан',
    paid: 'Оплачен',
  };

  const statusColors = {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    sent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    signed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-file-contract text-indigo-400"></i>
            Документы
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Генерация договоров, актов и ведение реестра
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Создать договор
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{stats.contracts}</p>
          <p className="text-xs text-slate-400 mt-1">Договоров</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{stats.prepayments}</p>
          <p className="text-xs text-slate-400 mt-1">Актов предоплаты</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-cyan-400">{stats.postpayments}</p>
          <p className="text-xs text-slate-400 mt-1">Актов постоплаты</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {(stats.totalAmount / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-400 mt-1">Общая сумма ₽</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'create'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <i className="fas fa-plus-circle mr-2"></i>Создать
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'registry'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <i className="fas fa-list mr-2"></i>Реестр
        </button>
      </div>

      {/* Create Form */}
      {activeTab === 'create' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Новый договор</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Заказчик *</label>
                <input
                  type="text"
                  required
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder='ООО "Компания"'
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Номер договора *</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="001/2026"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Дата *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Услуга *</label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="">Выберите услугу</option>
                  <option value="Подбор персонала">Подбор персонала</option>
                  <option value="Консалтинг">Консалтинг</option>
                  <option value="Абонентское обслуживание">Абонентское обслуживание</option>
                  <option value="Разработка KPI">Разработка KPI</option>
                  <option value="Адаптация сотрудников">Адаптация сотрудников</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Стоимость (₽) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Предоплата (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.prepayment}
                  onChange={(e) => setFormData({ ...formData, prepayment: Number(e.target.value) })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Проект (опционально)</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  placeholder="Цивиоми / подбор ГИП"
                />
              </div>
            </div>

            {/* Preview */}
            {formData.client && formData.amount > 0 && (
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Предпросмотр</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Заказчик:</span>{' '}
                    <span className="text-white">{formData.client}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Номер:</span>{' '}
                    <span className="text-white">{formData.number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Услуга:</span>{' '}
                    <span className="text-white">{formData.service}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Сумма:</span>{' '}
                    <span className="text-white">{formData.amount.toLocaleString()} ₽</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Предоплата:</span>{' '}
                    <span className="text-white">
                      {((formData.amount * formData.prepayment) / 100).toLocaleString()} ₽
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Постоплата:</span>{' '}
                    <span className="text-white">
                      {((formData.amount * (100 - formData.prepayment)) / 100).toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                <i className="fas fa-check mr-2"></i>Создать комплект
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registry */}
      {activeTab === 'registry' && (
        <div className="glass-card p-4 overflow-x-auto">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-file-contract text-4xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">Реестр пуст</p>
              <p className="text-xs text-slate-500 mt-1">
                Создайте первый договор, чтобы начать работу
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="text-left pb-3 font-medium">Тип</th>
                  <th className="text-left pb-3 font-medium">№</th>
                  <th className="text-left pb-3 font-medium">Дата</th>
                  <th className="text-left pb-3 font-medium">Заказчик</th>
                  <th className="text-left pb-3 font-medium">Услуга</th>
                  <th className="text-right pb-3 font-medium">Сумма</th>
                  <th className="text-center pb-3 font-medium">Статус</th>
                  <th className="text-center pb-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="table-row">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <i className={`${typeIcons[doc.type]} text-indigo-400`}></i>
                        <span className="text-slate-300 text-xs">{typeLabels[doc.type]}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white font-medium">{doc.number}</td>
                    <td className="py-3 text-slate-400 text-xs">
                      {new Date(doc.date).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 text-slate-300">{doc.client}</td>
                    <td className="py-3 text-slate-400 text-xs">{doc.service}</td>
                    <td className="py-3 text-right text-white font-medium">
                      {doc.amount.toLocaleString()} ₽
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`badge ${statusColors[doc.status]}`}
                      >
                        {statusLabels[doc.status]}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button className="text-indigo-400 hover:text-indigo-300 text-xs">
                        <i className="fas fa-download"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
