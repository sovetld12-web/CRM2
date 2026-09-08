export default function Invoices() {
  const invoices = [
    { date: '30.03.2026', client: 'Инватика', name: 'Предоплата: МОП', type: 'Рекрутинг', status: 'Оплачено', sum: '24 000', paid: '30.03.2026' },
    { date: '01.01.2026', client: 'Росинтех', name: 'Предоплата: Инженер технолог', type: 'Рекрутинг', status: 'Оплачено', sum: '30 000', paid: '01.01.2026' },
    { date: '20.04.2026', client: 'Иван', name: 'Предоплата: линейный персонал', type: 'Рекрутинг', status: 'Оплачено', sum: '10 000', paid: '20.04.2026' },
    { date: '27.04.2026', client: 'ДК Дюкарева', name: 'Предоплата: МОП', type: 'Рекрутинг', status: 'Оплачено', sum: '22 500', paid: '27.04.2026' },
    { date: '10.04.2026', client: 'ДК Дюкарева', name: 'Предоплата: Главный бухгалтер', type: 'Рекрутинг', status: 'Оплачено', sum: '30 000', paid: '10.04.2026' },
    { date: '02.04.2026', client: 'Луна флора', name: 'оплата', type: 'Абонентка', status: 'Оплачено', sum: '35 000', paid: '02.04.2026' },
    { date: '09.04.2026', client: 'Мос хаус', name: 'постоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '56 000', paid: '09.04.2026' },
    { date: '24.04.2026', client: 'Форт', name: 'предоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '13 000', paid: '24.04.2026' },
    { date: '02.03.2026', client: 'Нью вей', name: 'предоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '30 000', paid: '—' },
    { date: '11.03.2026', client: 'Асендо', name: 'постоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '35 000', paid: '—' },
    { date: '16.03.2026', client: 'Мос хаус', name: 'предоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '24 000', paid: '—' },
    { date: '18.03.2026', client: 'Премьер Тиссью', name: 'постоплата', type: 'Рекрутинг', status: 'Оплачено', sum: '56 000', paid: '—' },
  ];

  const totalSum = invoices.reduce((acc, inv) => acc + parseInt(inv.sum.replace(/\s/g, '')), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Счета и оплаты</h1>
          <p className="text-sm text-slate-400 mt-1">Выставленные счета и статусы оплат</p>
        </div>
        <button className="btn-primary"><i className="fas fa-plus mr-2"></i>Новый счет</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-white">{invoices.length}</p>
          <p className="text-xs text-slate-400 mt-1">Всего счетов</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-emerald-400">{(totalSum / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-1">Общая сумма ₽</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-indigo-400">{invoices.length}</p>
          <p className="text-xs text-slate-400 mt-1">Оплачено</p>
        </div>
        <div className="metric-card text-center">
          <p className="text-2xl font-bold text-amber-400">0</p>
          <p className="text-xs text-slate-400 mt-1">Просрочено</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 border-b border-slate-700/50">
              <th className="text-left pb-3 font-medium">Дата</th>
              <th className="text-left pb-3 font-medium">Клиент</th>
              <th className="text-left pb-3 font-medium">Наименование</th>
              <th className="text-left pb-3 font-medium">Тип</th>
              <th className="text-center pb-3 font-medium">Статус</th>
              <th className="text-right pb-3 font-medium">Сумма</th>
              <th className="text-left pb-3 font-medium">Оплата</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="table-row">
                <td className="py-3 text-slate-400 text-xs">{inv.date}</td>
                <td className="py-3 text-white font-medium">{inv.client}</td>
                <td className="py-3 text-slate-300">{inv.name}</td>
                <td className="py-3">
                  <span className="badge badge-info">{inv.type}</span>
                </td>
                <td className="py-3 text-center">
                  <span className="badge badge-success">{inv.status}</span>
                </td>
                <td className="py-3 text-right text-white font-medium">{inv.sum} ₽</td>
                <td className="py-3 text-slate-400 text-xs">{inv.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
