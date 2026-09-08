import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';

export default function DataManager() {
  const { leads, tasks, moneyOperations, projects, sleepingClients } = useData();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Экспорт всех данных в JSON
  const handleExport = () => {
    const data = {
      leads,
      tasks,
      moneyOperations,
      projects,
      sleepingClients,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Данные успешно экспортированы!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Импорт данных из JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Сохраняем в localStorage
        if (data.leads) localStorage.setItem('crm_leads', JSON.stringify(data.leads));
        if (data.tasks) localStorage.setItem('crm_tasks', JSON.stringify(data.tasks));
        if (data.moneyOperations) localStorage.setItem('crm_money', JSON.stringify(data.moneyOperations));
        if (data.projects) localStorage.setItem('crm_projects', JSON.stringify(data.projects));
        if (data.sleepingClients) localStorage.setItem('crm_sleeping', JSON.stringify(data.sleepingClients));

        setMessage({ 
          type: 'success', 
          text: `Данные успешно импортированы! Лидов: ${data.leads?.length || 0}, Проектов: ${data.projects?.length || 0}` 
        });
        
        // Перезагружаем страницу для применения изменений
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        setMessage({ type: 'error', text: 'Ошибка при импорте файла. Убедитесь, что это корректный JSON.' });
        setTimeout(() => setMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    
    // Сбрасываем input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Управление данными</h1>
        <p className="text-sm text-slate-400 mt-1">Экспорт и импорт всех данных CRM</p>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`glass-card p-4 border ${
          message.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-3">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-circle text-red-400'}`}></i>
            <p className={`text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Лидов</p>
          <p className="text-2xl font-bold text-white">{leads.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Проектов</p>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Задач</p>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Финансовых операций</p>
          <p className="text-2xl font-bold text-white">{moneyOperations.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Спящая база</p>
          <p className="text-2xl font-bold text-white">{sleepingClients.length}</p>
        </div>
      </div>

      {/* Кнопки экспорта/импорта */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Экспорт */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <i className="fas fa-download text-emerald-400 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Экспорт данных</h3>
              <p className="text-xs text-slate-400">Скачать все данные в JSON формате</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Создайте резервную копию всех данных CRM. Файл будет содержать лиды, проекты, задачи, 
            финансовые операции и спящую базу.
          </p>
          <button
            onClick={handleExport}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-download"></i>
            Скачать JSON
          </button>
        </div>

        {/* Импорт */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <i className="fas fa-upload text-indigo-400 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Импорт данных</h3>
              <p className="text-xs text-slate-400">Загрузить данные из JSON файла</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Восстановите данные из ранее сохраненного файла. <span className="text-amber-400">Внимание:</span> текущие данные будут заменены.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-upload"></i>
            Загрузить JSON
          </button>
        </div>
      </div>

      {/* Информация */}
      <div className="glass-card p-6 border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-400 mt-1"></i>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Как использовать</h4>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• <strong>Экспорт:</strong> Регулярно создавайте резервные копии данных</li>
              <li>• <strong>Импорт:</strong> Загружайте данные из ранее сохраненного файла</li>
              <li>• <strong>Перенос:</strong> Используйте для переноса данных между устройствами</li>
              <li>• <strong>Формат:</strong> Все данные сохраняются в JSON формате</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
