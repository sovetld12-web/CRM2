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

  // Конвертация из старого формата CRM в новый
  const convertFromOldFormat = (oldData: any) => {
    const converted: any = {};

    // Конвертируем лиды
    if (oldData.data?.leads) {
      converted.leads = oldData.data.leads.map((lead: any) => ({
        id: lead.id || `lead_${Date.now()}_${Math.random()}`,
        date: lead.date || lead.leadCreatedAt || new Date().toISOString().split('T')[0],
        company: lead.company || '',
        contact: lead.contact || '',
        phone: lead.contactHandle || lead.phone || '',
        source: lead.source || 'Другое',
        stage: lead.stage || 'Заявка',
        product: lead.product || 'Рекрутинг',
        project: lead.project || '',
        sum: lead.amount || lead.sum || 0,
        paid: lead.paid || 0,
        nextStep: lead.nextStep || '',
        nextStepDate: lead.nextDate || lead.nextStepDate || '',
        responsible: lead.owner || lead.responsible || 'Любовь',
        comment: lead.comment || lead.note || '',
        createdAt: lead.leadCreatedAt || lead.createdAt || lead.date,
      }));
    }

    // Конвертируем спящую базу
    if (oldData.data?.sleepingLeads) {
      converted.sleepingClients = oldData.data.sleepingLeads.map((lead: any) => ({
        id: lead.id || `sleep_${Date.now()}_${Math.random()}`,
        client: lead.company || lead.contact || '',
        contact: lead.contact || '',
        phone: lead.contactHandle || lead.phone || '',
        source: lead.source || 'Завершенный проект',
        product: lead.product || '',
        project: lead.project || '',
        ltv: lead.amount || lead.sum || 0,
        nextStep: lead.nextStep || '',
        nextStepDate: lead.nextDate || lead.nextStepDate || '',
        lastContactDate: lead.lastTouchDate || lead.updatedAt || new Date().toISOString().split('T')[0],
        comment: lead.comment || lead.note || '',
        createdAt: lead.leadCreatedAt || lead.createdAt || lead.date,
      }));
    }

    // Конвертируем заказы (проекты)
    if (oldData.data?.orders) {
      converted.projects = oldData.data.orders.map((order: any) => ({
        id: order.id || `proj_${Date.now()}_${Math.random()}`,
        client: order.company || order.client || '',
        vacancy: order.vacancy || order.project || '',
        sum: order.amount || order.sum || 0,
        days: 0,
        status: order.status || 'В работе',
        startDate: order.startDate || order.date || new Date().toISOString().split('T')[0],
        contact: order.contact || '',
        phone: order.phone || '',
        paid: order.paid || 0,
        comment: order.comment || order.note || '',
      }));
    }

    // Конвертируем банковские транзакции
    if (oldData.data?.bankTransactions) {
      converted.moneyOperations = oldData.data.bankTransactions.map((tx: any) => ({
        id: tx.id || `tx_${Date.now()}_${Math.random()}`,
        date: tx.date || new Date().toISOString().split('T')[0],
        type: tx.type || 'income',
        counterparty: tx.counterparty || '',
        category: tx.category || 'Прочее',
        paymentType: tx.paymentType || '',
        sum: tx.sum || tx.amount || 0,
        description: tx.description || tx.comment || '',
      }));
    }

    // Конвертируем задачи
    if (oldData.data?.tasks) {
      converted.tasks = oldData.data.tasks.map((task: any) => ({
        id: task.id || `task_${Date.now()}_${Math.random()}`,
        title: task.title || task.name || '',
        priority: task.priority || 'normal',
        source: task.source || 'crm',
        dueDate: task.dueDate || task.date || '',
        done: task.done || false,
        createdAt: task.createdAt || new Date().toISOString(),
      }));
    }

    return converted;
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
        const rawData = JSON.parse(e.target?.result as string);
        
        console.log('📥 Начинаем импорт файла:', file.name);
        console.log('📊 Структура данных:', Object.keys(rawData));
        
        let importData: any = {};
        
        // Проверяем, это полный бэкап из старой CRM
        if (rawData.data && typeof rawData.data === 'object') {
          console.log('✅ Обнаружен формат: полный бэкап CRM');
          importData = convertFromOldFormat(rawData);
        } else if (rawData.leads || rawData.projects || rawData.moneyOperations || rawData.tasks || rawData.sleepingClients) {
          // Это отдельный файл с данными в новом формате
          importData = rawData;
          console.log('✅ Обнаружен формат: отдельные данные (новый формат)');
        } else if (Array.isArray(rawData)) {
          // Это массив - нужно определить что это
          if (rawData.length > 0) {
            const sample = rawData[0];
            if (sample.contact || sample.company || sample.stage) {
              importData.leads = rawData;
              console.log('✅ Обнаружен формат: массив лидов');
            } else if (sample.vacancy || sample.client) {
              importData.projects = rawData;
              console.log('✅ Обнаружен формат: массив проектов');
            } else if (sample.type || sample.counterparty) {
              importData.moneyOperations = rawData;
              console.log('✅ Обнаружен формат: массив финансовых операций');
            } else if (sample.title || sample.description) {
              importData.tasks = rawData;
              console.log('✅ Обнаружен формат: массив задач');
            } else if (sample.ltv || sample.lastContactDate) {
              importData.sleepingClients = rawData;
              console.log('✅ Обнаружен формат: массив спящей базы');
            }
          }
        } else {
          console.warn('⚠️ Не удалось определить тип данных');
        }
        
        console.log('📦 Импортируем:', Object.keys(importData));
        
        // Сохраняем в localStorage
        if (importData.leads) {
          localStorage.setItem('crm_leads', JSON.stringify(importData.leads));
          console.log(`✅ Сохранено лидов: ${importData.leads.length}`);
        }
        if (importData.projects) {
          localStorage.setItem('crm_projects', JSON.stringify(importData.projects));
          console.log(`✅ Сохранено проектов: ${importData.projects.length}`);
        }
        if (importData.moneyOperations) {
          localStorage.setItem('crm_money', JSON.stringify(importData.moneyOperations));
          console.log(`✅ Сохранено финансовых операций: ${importData.moneyOperations.length}`);
        }
        if (importData.tasks) {
          localStorage.setItem('crm_tasks', JSON.stringify(importData.tasks));
          console.log(`✅ Сохранено задач: ${importData.tasks.length}`);
        }
        if (importData.sleepingClients) {
          localStorage.setItem('crm_sleeping', JSON.stringify(importData.sleepingClients));
          console.log(`✅ Сохранено спящей базы: ${importData.sleepingClients.length}`);
        }
        
        const counts = {
          leads: importData.leads?.length || 0,
          projects: importData.projects?.length || 0,
          tasks: importData.tasks?.length || 0,
          money: importData.moneyOperations?.length || 0,
          sleeping: importData.sleepingClients?.length || 0,
        };
        
        setMessage({ 
          type: 'success', 
          text: `✅ Данные успешно импортированы!\n\nЛидов: ${counts.leads}\nПроектов: ${counts.projects}\nЗадач: ${counts.tasks}\nФинансовых операций: ${counts.money}\nСпящая база: ${counts.sleeping}\n\nСтраница перезагрузится через 3 секунды...` 
        });
        
        // Перезагружаем страницу для применения изменений
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        console.error('❌ Ошибка импорта:', error);
        setMessage({ 
          type: 'error', 
          text: `❌ Ошибка при импорте файла.\n\nУбедитесь, что это корректный JSON файл.\n\nОшибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
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

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Загрузка данных</h1>
        <p className="text-sm text-slate-400 mt-1">Импорт и экспорт данных CRM</p>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`glass-card p-4 border ${
          message.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-start gap-3">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-circle text-red-400'} mt-0.5`}></i>
            <p className={`text-sm whitespace-pre-line ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
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

      {/* Drag & Drop зона */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`glass-card p-12 text-center transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700/50'
        }`}
      >
        <i className={`fas fa-cloud-upload-alt text-5xl mb-4 ${isDragging ? 'text-indigo-400' : 'text-slate-600'}`}></i>
        <p className="text-lg font-medium text-white mb-2">
          {isDragging ? 'Отпустите файл здесь' : 'Перетащите JSON файл сюда'}
        </p>
        <p className="text-sm text-slate-400">
          или используйте кнопку "Загрузить JSON" выше
        </p>
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
