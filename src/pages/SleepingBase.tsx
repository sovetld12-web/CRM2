import { useState } from 'react';
import { useData, SleepingClient, Lead } from '../contexts/DataContext';

export default function SleepingBase() {
  const { sleepingClients, leads, projects, addSleepingClient, updateSleepingClient, deleteSleepingClient, addLead, addProject } = useData();
  const [selectedClient, setSelectedClient] = useState<SleepingClient | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [filters, setFilters] = useState({
    client: '',
    phone: '',
    source: '',
    product: '',
    project: '',
    nextStep: '',
    daysWithoutContact: '',
  });

  const calculateDaysWithoutContact = (lastContactDate: string) => {
    const last = new Date(lastContactDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - last.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredClients = sleepingClients.filter(c => {
    if (filters.client && !c.client.toLowerCase().includes(filters.client.toLowerCase())) return false;
    if (filters.phone && !c.phone.toLowerCase().includes(filters.phone.toLowerCase())) return false;
    if (filters.source && c.source !== filters.source) return false;
    if (filters.product && c.product !== filters.product) return false;
    if (filters.project && !c.project.toLowerCase().includes(filters.project.toLowerCase())) return false;
    if (filters.nextStep && !c.nextStep.toLowerCase().includes(filters.nextStep.toLowerCase())) return false;
    if (filters.daysWithoutContact) {
      const days = calculateDaysWithoutContact(c.lastContactDate);
      const filterDays = parseInt(filters.daysWithoutContact);
      if (days < filterDays) return false;
    }
    return true;
  });

  const handleSaveClient = (clientData: Omit<SleepingClient, 'id' | 'createdAt'>) => {
    if (selectedClient?.id) {
      updateSleepingClient(selectedClient.id, clientData);
    } else {
      addSleepingClient(clientData);
    }
    setShowCard(false);
    setSelectedClient(null);
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setShowCard(true);
  };

  const handleEditClient = (client: SleepingClient) => {
    setSelectedClient(client);
    setShowCard(true);
  };

  const handleMoveToLeads = (client: SleepingClient) => {
    const newLead: Omit<Lead, 'id' | 'createdAt'> = {
      date: new Date().toISOString().split('T')[0],
      company: client.client,
      contact: client.contact,
      phone: client.phone,
      source: client.source,
      stage: 'Заявка',
      product: client.product,
      project: '',
      sum: 0,
      paid: 0,
      nextStep: '',
      nextStepDate: '',
      responsible: 'Любовь',
      comment: `Повторный лид из спящей базы. Предыдущий проект: ${client.project}`,
    };
    addLead(newLead);
    alert('Клиент перенесен в лиды');
  };

  const handleMoveToProduction = (client: SleepingClient) => {
    const newProject = {
      client: client.client,
      vacancy: client.project,
      sum: 0,
      days: 0,
      status: 'В работе',
      startDate: new Date().toISOString().split('T')[0],
      contact: client.contact,
      phone: client.phone,
      responsible: 'Любовь',
      comment: `Проект из спящей базы. Предыдущий проект: ${client.project}`,
    };
    addProject(newProject);
    alert('Клиент перенесен в производство');
  };

  const handleDeleteClient = (client: SleepingClient) => {
    if (confirm(`Удалить клиента "${client.client}" из спящей базы?`)) {
      deleteSleepingClient(client.id);
    }
  };

  const getDaysColor = (days: number) => {
    if (days <= 30) return 'text-emerald-400';
    if (days <= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Спящая база</h1>
          <p className="text-sm text-slate-400 mt-1">Клиенты без активных сделок для повторных касаний</p>
        </div>
        <button onClick={handleNewClient} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Добавить клиента
        </button>
      </div>

      {/* Info Block */}
      <div className="glass-card p-4 border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
          <div>
            <p className="text-sm text-blue-300 font-medium mb-1">Информация</p>
            <p className="text-xs text-slate-400">
              Здесь хранятся клиенты и контакты без активной сделки, с которыми нужно работать повторно.
              LTV рассчитывается автоматически на основе всех завершенных проектов клиента.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{sleepingClients.length}</p>
          <p className="text-xs text-slate-400 mt-1">Всего клиентов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{sleepingClients.filter(c => calculateDaysWithoutContact(c.lastContactDate) <= 30).length}</p>
          <p className="text-xs text-slate-400 mt-1">До 30 дней</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-amber-400">{sleepingClients.filter(c => calculateDaysWithoutContact(c.lastContactDate) > 30 && calculateDaysWithoutContact(c.lastContactDate) <= 60).length}</p>
          <p className="text-xs text-slate-400 mt-1">31-60 дней</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-red-400">{sleepingClients.filter(c => calculateDaysWithoutContact(c.lastContactDate) > 60).length}</p>
          <p className="text-xs text-slate-400 mt-1">Более 60 дней</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Клиент..."
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Телефон / ник..."
            value={filters.phone}
            onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">Все источники</option>
            <option value="Профи">Профи</option>
            <option value="HH">HH</option>
            <option value="Авито">Авито</option>
            <option value="Рекомендация">Рекомендация</option>
            <option value="Повторный клиент">Повторный клиент</option>
          </select>
          <input
            type="number"
            placeholder="Без касания, дней от..."
            value={filters.daysWithoutContact}
            onChange={(e) => setFilters({ ...filters, daysWithoutContact: e.target.value })}
            className="px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left p-3 font-medium">Дата</th>
              <th className="text-left p-3 font-medium">Клиент</th>
              <th className="text-left p-3 font-medium">Телефон / ник</th>
              <th className="text-left p-3 font-medium">Источник</th>
              <th className="text-left p-3 font-medium">Продукт</th>
              <th className="text-left p-3 font-medium">Проект</th>
              <th className="text-right p-3 font-medium">LTV</th>
              <th className="text-left p-3 font-medium">Следующий шаг</th>
              <th className="text-left p-3 font-medium">Дата след. шага</th>
              <th className="text-center p-3 font-medium">Дней без касания</th>
              <th className="text-left p-3 font-medium">Комментарий</th>
              <th className="text-center p-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const daysWithoutContact = calculateDaysWithoutContact(client.lastContactDate);

              return (
                <tr key={client.id} className="table-row border-b border-slate-700/30">
                  <td className="p-3 text-slate-400 text-xs">{client.createdAt.split('T')[0]}</td>
                  <td className="p-3 text-white font-medium">{client.client}</td>
                  <td className="p-3 text-slate-300 text-xs">{client.phone || '—'}</td>
                  <td className="p-3">
                    <span className="badge badge-info">{client.source}</span>
                  </td>
                  <td className="p-3 text-slate-300 text-xs">{client.product}</td>
                  <td className="p-3 text-slate-300 text-xs">{client.project}</td>
                  <td className="p-3 text-right text-emerald-400 font-medium">{client.ltv.toLocaleString('ru-RU')} ₽</td>
                  <td className="p-3 text-slate-300 text-xs">{client.nextStep || '—'}</td>
                  <td className="p-3 text-slate-400 text-xs">{client.nextStepDate || '—'}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${getDaysColor(daysWithoutContact)}`}>
                      {daysWithoutContact}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-xs max-w-[200px] truncate" title={client.comment}>
                    {client.comment || '—'}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMoveToLeads(client)}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                        title="В лиды"
                      >
                        <i className="fas fa-user-plus"></i>
                      </button>
                      <button
                        onClick={() => handleMoveToProduction(client)}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                        title="В производство"
                      >
                        <i className="fas fa-briefcase"></i>
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-xs text-slate-400 hover:text-slate-300"
                        title="Редактировать"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client)}
                        className="text-xs text-red-400 hover:text-red-300"
                        title="Удалить"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <i className="fas fa-inbox text-4xl mb-3 opacity-30"></i>
            <p>Нет клиентов в спящей базе</p>
          </div>
        )}
      </div>

      {/* Client Card Modal */}
      {showCard && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-[16px]">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedClient ? 'Редактирование клиента' : 'Новый клиент'}
              </h2>
              <button
                onClick={() => {
                  setShowCard(false);
                  setSelectedClient(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const clientData: Omit<SleepingClient, 'id' | 'createdAt'> = {
                  client: formData.get('client') as string,
                  contact: formData.get('contact') as string,
                  phone: formData.get('phone') as string,
                  source: formData.get('source') as string,
                  product: formData.get('product') as string,
                  project: formData.get('project') as string,
                  ltv: parseFloat(formData.get('ltv') as string) || 0,
                  nextStep: formData.get('nextStep') as string,
                  nextStepDate: formData.get('nextStepDate') as string,
                  lastContactDate: formData.get('lastContactDate') as string || new Date().toISOString().split('T')[0],
                  comment: formData.get('comment') as string,
                };
                handleSaveClient(clientData);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Клиент *</label>
                  <input
                    type="text"
                    name="client"
                    defaultValue={selectedClient?.client || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Контакт *</label>
                  <input
                    type="text"
                    name="contact"
                    defaultValue={selectedClient?.contact || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Телефон / ник</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedClient?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Источник *</label>
                  <select
                    name="source"
                    defaultValue={selectedClient?.source || 'Профи'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Профи">Профи</option>
                    <option value="HH">HH</option>
                    <option value="Авито">Авито</option>
                    <option value="Рекомендация">Рекомендация</option>
                    <option value="Повторный клиент">Повторный клиент</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Продукт *</label>
                  <input
                    type="text"
                    name="product"
                    defaultValue={selectedClient?.product || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Проект *</label>
                  <input
                    type="text"
                    name="project"
                    defaultValue={selectedClient?.project || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">LTV (₽)</label>
                <input
                  type="number"
                  name="ltv"
                  defaultValue={selectedClient?.ltv || 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Следующий шаг</label>
                  <input
                    type="text"
                    name="nextStep"
                    defaultValue={selectedClient?.nextStep || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Дата следующего шага</label>
                  <input
                    type="date"
                    name="nextStepDate"
                    defaultValue={selectedClient?.nextStepDate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Дата последнего контакта</label>
                <input
                  type="date"
                  name="lastContactDate"
                  defaultValue={selectedClient?.lastContactDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Комментарий</label>
                <textarea
                  name="comment"
                  defaultValue={selectedClient?.comment || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCard(false);
                    setSelectedClient(null);
                  }}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
