import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';

export default function DataManager() {
  const { leads, tasks, moneyOperations, projects, sleepingClients } = useData();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

    setMessage({ type: 'success', text: '✅ Данные успешно экспортированы!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Импорт данных из JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
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

        const counts = {
          leads: data.leads?.length || 0,
          projects: data.projects?.length || 0,
          tasks: data.tasks?.length || 0,
          money: data.moneyOperations?.length || 0,
          sleeping: data.sleepingClients?.length || 0,
        };

        setMessage({ 
          type: 'success', 
          text: `✅ Данные успешно импортированы!\n\nЛидов: ${counts.leads}\nПроектов: ${counts.projects}\nЗадач: ${counts.tasks}\nФинансовых операций: ${counts.money}\nСпящая база: ${counts.sleeping}\n\nСтраница перезагрузится через 2 секунды...` 
        });
        
        // Перезагружаем страницу для применения изменений
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: `❌ Ошибка при импорте файла.\n\nУбедитесь, что это корректный JSON файл, экспортированный из CRM.\n\nОшибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
        });
        setTimeout(() => setMessage(null), 10000);
      }
    };
    reader.readAsText(file);
    
    // Сбрасываем input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <i className="fas fa-database text-white text-xl"></i>
          </div>
          Загрузка и управление данными
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Экспортируйте все данные CRM или импортируйте из ранее сохранённого файла
        </p>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`glass-card p-4 border ${
          message.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-start gap-3">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle text-emerald-400 text-lg' : 'fa-exclamation-circle text-red-400 text-lg'} mt-0.5`}></i>
            <p className={`text-sm whitespace-pre-line ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Большая зона загрузки */}
      <div className="glass-card p-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-slate-600 hover:border-emerald-500/50 hover:bg-emerald-500/5'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <i className="fas fa-cloud-upload-alt text-4xl text-emerald-400"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Перетащите файл сюда или нажмите для выбора
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Поддерживается формат JSON, экспортированный из CRM
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-upload"></i>
            Выбрать файл JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Кнопка экспорта */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <i className="fas fa-download text-2xl text-blue-400"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Экспорт данных</h3>
              <p className="text-sm text-slate-400 mt-1">
                Создайте резервную копию всех данных CRM в формате JSON
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            Скачать JSON
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-chart-bar text-indigo-400"></i>
          Текущая статистика данных
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-1">Лидов</p>
            <p className="text-2xl font-bold text-white">{leads.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-1">Проектов</p>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-1">Задач</p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-1">Финансовых операций</p>
            <p className="text-2xl font-bold text-white">{moneyOperations.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-1">Спящая база</p>
            <p className="text-2xl font-bold text-white">{sleepingClients.length}</p>
          </div>
        </div>
      </div>

      {/* Информация */}
      <div className="glass-card p-6 border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-400 mt-1 text-lg"></i>
          <div>
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Как использовать</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Экспорт:</strong> Нажмите "Скачать JSON" для создания резервной копии всех данных</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Импорт:</strong> Перетащите файл или нажмите "Выбрать файл JSON" для восстановления данных</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Перенос:</strong> Используйте для переноса данных между устройствами</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-exclamation-triangle text-amber-400 mt-1 text-xs"></i>
                <span><strong>Внимание:</strong> При импорте текущие данные будут полностью заменены</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
