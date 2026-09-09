import { useState, useRef } from 'react';

interface ClientRequisites {
  companyName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  address: string;
  bankAccount: string;
  bankName: string;
  bik: string;
  corrAccount: string;
  director: string;
  phone: string;
  email: string;
}

interface Document {
  id: string;
  type: 'contract' | 'act';
  client: ClientRequisites;
  number: string;
  date: string;
  service: string;
  amount: number;
  status: 'draft' | 'sent' | 'signed' | 'paid';
  contractFile?: string;
  contractNumber?: string;
  contractDate?: string;
  project?: string;
}

const emptyClient: ClientRequisites = {
  companyName: '',
  inn: '',
  kpp: '',
  ogrn: '',
  address: '',
  bankAccount: '',
  bankName: '',
  bik: '',
  corrAccount: '',
  director: '',
  phone: '',
  email: '',
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'registry'>('create');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [savedClients, setSavedClients] = useState<ClientRequisites[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    client: { ...emptyClient },
    number: '',
    date: new Date().toISOString().split('T')[0],
    service: '',
    amount: 0,
    project: '',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleClientChange = (field: keyof ClientRequisites, value: string) => {
    setFormData({
      ...formData,
      client: { ...formData.client, [field]: value },
    });
  };

  const handleSaveClient = () => {
    if (formData.client.companyName && formData.client.inn) {
      const exists = savedClients.find(c => c.inn === formData.client.inn);
      if (!exists) {
        setSavedClients([...savedClients, formData.client]);
      }
    }
  };

  const handleSelectClient = (client: ClientRequisites) => {
    setFormData({ ...formData, client });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contract: Document = {
      id: Date.now().toString(),
      type: 'contract',
      client: formData.client,
      number: formData.number,
      date: formData.date,
      service: formData.service,
      amount: formData.amount,
      status: 'draft',
      contractFile: uploadedFile?.name,
      project: formData.project,
    };

    const act: Document = {
      id: (Date.now() + 1).toString(),
      type: 'act',
      client: formData.client,
      number: `АВ-${formData.number}`,
      date: formData.date,
      service: formData.service,
      amount: formData.amount,
      status: 'draft',
      contractNumber: formData.number,
      contractDate: formData.date,
      project: formData.project,
    };

    setDocuments([contract, act, ...documents]);
    handleSaveClient();
    setShowForm(false);
    setUploadedFile(null);
    setFormData({
      client: { ...emptyClient },
      number: '',
      date: new Date().toISOString().split('T')[0],
      service: '',
      amount: 0,
      project: '',
    });
  };

  const updateStatus = (id: string, status: Document['status']) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, status } : d));
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const stats = {
    contracts: documents.filter(d => d.type === 'contract').length,
    acts: documents.filter(d => d.type === 'act').length,
    totalAmount: documents
      .filter(d => d.type === 'contract')
      .reduce((sum, d) => sum + d.amount, 0),
    signed: documents.filter(d => d.status === 'signed' || d.status === 'paid').length,
  };

  const statusLabels = {
    draft: 'Черновик',
    sent: 'Отправлен',
    signed: 'Подписан',
    paid: 'Оплачен',
  };

  const statusColors = {
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    sent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    signed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paid: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Документы</h1>
          <p className="text-sm text-slate-400 mt-1">Договоры и акты выполненных работ</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
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
          <p className="text-2xl font-bold text-cyan-400">{stats.acts}</p>
          <p className="text-xs text-slate-400 mt-1">Актов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{(stats.totalAmount / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Общая сумма ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.signed}</p>
          <p className="text-xs text-slate-400 mt-1">Подписано</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
            activeTab === 'create'
              ? 'bg-indigo-500/10 text-indigo-300 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="fas fa-plus-circle mr-1"></i>Создать
        </button>
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
            activeTab === 'registry'
              ? 'bg-indigo-500/10 text-indigo-300 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="fas fa-list mr-1"></i>Реестр ({documents.length})
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="glass-card p-5">
          <div className="text-center py-8">
            <i className="fas fa-file-contract text-4xl text-indigo-400/30 mb-4"></i>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Создание договора</h3>
            <p className="text-sm text-slate-500 mb-4">
              Загрузите договор или заполните форму вручную. На основе договора автоматически создаётся акт выполненных работ.
            </p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <i className="fas fa-plus mr-2"></i>Создать договор
            </button>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="glass-card p-4 overflow-x-auto">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-folder-open text-3xl text-slate-600 mb-3"></i>
              <p className="text-sm text-slate-400">Реестр пуст. Создайте первый договор.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="text-left pb-3 font-medium">Тип</th>
                  <th className="text-left pb-3 font-medium">Номер</th>
                  <th className="text-left pb-3 font-medium">Дата</th>
                  <th className="text-left pb-3 font-medium">Клиент</th>
                  <th className="text-left pb-3 font-medium">Услуга</th>
                  <th className="text-right pb-3 font-medium">Сумма</th>
                  <th className="text-center pb-3 font-medium">Статус</th>
                  <th className="text-center pb-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} className="table-row">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <i className={`fas ${doc.type === 'contract' ? 'fa-file-contract text-indigo-400' : 'fa-file-invoice text-cyan-400'}`}></i>
                        <span className="text-xs text-slate-300">
                          {doc.type === 'contract' ? 'Договор' : 'Акт'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-white font-medium">{doc.number}</td>
                    <td className="py-3 text-slate-400 text-xs">{doc.date}</td>
                    <td className="py-3 text-slate-300">{doc.client.companyName || '—'}</td>
                    <td className="py-3 text-slate-400">{doc.service}</td>
                    <td className="py-3 text-right text-white font-medium">{doc.amount.toLocaleString('ru-RU')} ₽</td>
                    <td className="py-3 text-center">
                      <select
                        value={doc.status}
                        onChange={(e) => updateStatus(doc.id, e.target.value as Document['status'])}
                        className={`text-xs px-2 py-1 rounded border ${statusColors[doc.status]} bg-transparent cursor-pointer`}
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key} className="bg-slate-800">{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Document Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Создать договор</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-all text-slate-400"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Загрузить договор (DOCX, PDF)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700/50 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/30 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pdf,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedFile ? (
                    <div>
                      <i className="fas fa-file-alt text-2xl text-indigo-400 mb-2"></i>
                      <p className="text-sm text-white">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {(uploadedFile.size / 1024).toFixed(1)} КБ
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-2xl text-slate-500 mb-2"></i>
                      <p className="text-sm text-slate-400">Нажмите для загрузки файла</p>
                      <p className="text-xs text-slate-500 mt-1">DOCX, PDF, DOC</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Clients */}
              {savedClients.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Сохранённые клиенты</label>
                  <div className="flex flex-wrap gap-2">
                    {savedClients.map((client, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectClient(client)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-indigo-500/30 transition-all"
                      >
                        {client.companyName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Requisites */}
              <div className="border border-slate-700/50 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <i className="fas fa-building text-indigo-400"></i>
                  Реквизиты клиента
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Наименование *</label>
                    <input
                      type="text"
                      value={formData.client.companyName}
                      onChange={(e) => handleClientChange('companyName', e.target.value)}
                      placeholder='ООО "Компания"'
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">ИНН *</label>
                    <input
                      type="text"
                      value={formData.client.inn}
                      onChange={(e) => handleClientChange('inn', e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">КПП</label>
                    <input
                      type="text"
                      value={formData.client.kpp}
                      onChange={(e) => handleClientChange('kpp', e.target.value)}
                      placeholder="123456789"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">ОГРН</label>
                    <input
                      type="text"
                      value={formData.client.ogrn}
                      onChange={(e) => handleClientChange('ogrn', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Директор</label>
                    <input
                      type="text"
                      value={formData.client.director}
                      onChange={(e) => handleClientChange('director', e.target.value)}
                      placeholder="Иванов И.И."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Юридический адрес</label>
                    <input
                      type="text"
                      value={formData.client.address}
                      onChange={(e) => handleClientChange('address', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Телефон</label>
                    <input
                      type="text"
                      value={formData.client.phone}
                      onChange={(e) => handleClientChange('phone', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formData.client.email}
                      onChange={(e) => handleClientChange('email', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Расчётный счёт</label>
                    <input
                      type="text"
                      value={formData.client.bankAccount}
                      onChange={(e) => handleClientChange('bankAccount', e.target.value)}
                      placeholder="40702810..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Банк</label>
                    <input
                      type="text"
                      value={formData.client.bankName}
                      onChange={(e) => handleClientChange('bankName', e.target.value)}
                      placeholder="АО «Альфа-Банк»"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">БИК</label>
                    <input
                      type="text"
                      value={formData.client.bik}
                      onChange={(e) => handleClientChange('bik', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Кор. счёт</label>
                    <input
                      type="text"
                      value={formData.client.corrAccount}
                      onChange={(e) => handleClientChange('corrAccount', e.target.value)}
                      placeholder="30101810..."
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="border border-slate-700/50 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <i className="fas fa-file-signature text-cyan-400"></i>
                  Данные договора
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Номер договора *</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      placeholder="КР-2026-001"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Дата договора *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Услуга *</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                      required
                    >
                      <option value="">Выберите услугу</option>
                      <option value="Подбор персонала">Подбор персонала</option>
                      <option value="Консалтинг">Консалтинг</option>
                      <option value="Абонентское обслуживание">Абонентское обслуживание</option>
                      <option value="Разработка KPI">Разработка KPI</option>
                      <option value="Адаптация">Адаптация</option>
                      <option value="Обучение">Обучение</option>
                      <option value="HR-аудит">HR-аудит</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Сумма (₽) *</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      placeholder="100000"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Проект (связь с CRM)</label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder="Название проекта из CRM"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {formData.number && formData.client.companyName && (
                <div className="border border-indigo-500/20 rounded-xl p-4 bg-indigo-500/5">
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3">Предпросмотр</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Договор №{formData.number}</span>
                      <span className="text-white">{formData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Клиент</span>
                      <span className="text-white">{formData.client.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Услуга</span>
                      <span className="text-white">{formData.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Сумма</span>
                      <span className="text-white font-bold">{formData.amount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="border-t border-indigo-500/20 pt-2 mt-2">
                      <p className="text-xs text-indigo-300">
                        <i className="fas fa-info-circle mr-1"></i>
                        На основе договора будет автоматически создан акт выполненных работ АВ-{formData.number}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-check mr-2"></i>Создать договор и акт
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
