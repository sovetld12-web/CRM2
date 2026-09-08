import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';

export default function DataManager() {
  const { leads, tasks, moneyOperations, projects, sleepingClients } = useData();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setImportLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

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

  // Умное определение типа данных
  const detectDataType = (data: any): string => {
    if (Array.isArray(data)) {
      if (data.length === 0) return 'empty';
      const sample = data[0];
      
      // Определяем по характерным полям
      if (sample.contact || sample.company || sample.stage || sample.source) {
        return 'leads';
      }
      if (sample.vacancy || sample.client || sample.closingNorm || sample.firstCandidateDate) {
        return 'projects';
      }
      if (sample.type || sample.counterparty || sample.category || (sample.sum && !sample.contact)) {
        return 'money';
      }
      if (sample.ltv || sample.lastContactDate || sample.daysWithoutContact) {
        return 'sleeping';
      }
      if (sample.title || sample.priority || sample.dueDate !== undefined) {
        return 'tasks';
      }
    }
    
    if (typeof data === 'object' && !Array.isArray(data)) {
      // Проверяем структуру с ключами
      if (data.leads || data.projects || data.moneyOperations || data.tasks || data.sleepingClients) {
        return 'full-backup';
      }
    }
    
    return 'unknown';
  };

  // Конвертация лидов из старого формата
  const convertLeads = (data: any[]): any[] => {
    return data.map((lead, index) => {
      try {
        return {
          id: lead.id || `imported-${Date.now()}-${index}`,
          date: lead.date || lead.createdAt || lead.created_at || new Date().toISOString().split('T')[0],
          company: lead.company || lead.client || lead.organization || '',
          contact: lead.contact || lead.name || lead.contactName || '',
          phone: lead.phone || lead.tel || lead.phoneNumber || '',
          source: lead.source || lead.leadSource || 'Не указан',
          stage: lead.stage || lead.status || lead.leadStage || 'Заявка',
          product: lead.product || lead.service || lead.productType || 'Рекрутинг',
          project: lead.project || lead.vacancy || lead.projectName || '',
          sum: parseFloat(lead.sum || lead.amount || lead.budget || '0'),
          paid: parseFloat(lead.paid || lead.paidAmount || '0'),
          nextStep: lead.nextStep || lead.nextAction || '',
          nextStepDate: lead.nextStepDate || lead.nextActionDate || '',
          responsible: lead.responsible || lead.assignee || 'Любовь',
          comment: lead.comment || lead.notes || lead.description || '',
          createdAt: lead.createdAt || lead.created_at || new Date().toISOString(),
        };
      } catch (err) {
        addLog(`❌ Ошибка конвертации лида #${index}: ${err}`);
        return null;
      }
    }).filter(Boolean);
  };

  // Конвертация проектов из старого формата
  const convertProjects = (data: any[]): any[] => {
    return data.map((project, index) => {
      try {
        return {
          id: project.id || `imported-${Date.now()}-${index}`,
          client: project.client || project.company || project.customer || '',
          vacancy: project.vacancy || project.project || project.projectName || '',
          sum: parseFloat(project.sum || project.amount || project.budget || '0'),
          days: parseInt(project.days || project.daysInWork || '0'),
          status: project.status || project.state || 'В работе',
          startDate: project.startDate || project.start_date || project.date || new Date().toISOString().split('T')[0],
          contact: project.contact || '',
          phone: project.phone || '',
          firstCandidateDate: project.firstCandidateDate || project.firstCandidate || '',
          offerDate: project.offerDate || project.offer || '',
          workStartDate: project.workStartDate || project.workStart || '',
          paid: parseFloat(project.paid || project.paidAmount || '0'),
          directCosts: parseFloat(project.directCosts || project.costs || '0'),
          expectedPaymentDate: project.expectedPaymentDate || project.expectedPayment || '',
          paymentProbability: parseInt(project.paymentProbability || project.probability || '100'),
          closingNorm: parseInt(project.closingNorm || project.norm || '30'),
          comment: project.comment || project.notes || '',
          responsible: project.responsible || project.assignee || 'Любовь',
          sourceLeadId: project.sourceLeadId || '',
          endDate: project.endDate || project.end_date || '',
        };
      } catch (err) {
        addLog(`❌ Ошибка конвертации проекта #${index}: ${err}`);
        return null;
      }
    }).filter(Boolean);
  };

  // Конвертация финансовых операций
  const convertMoney = (data: any[]): any[] => {
    return data.map((op, index) => {
      try {
        return {
          id: op.id || `imported-${Date.now()}-${index}`,
          date: op.date || op.operationDate || new Date().toISOString().split('T')[0],
          type: op.type === 'income' || op.type === 'Поступление' || op.amount > 0 ? 'income' : 'expense',
          counterparty: op.counterparty || op.client || op.company || '',
          category: op.category || op.operationType || 'Прочее',
          paymentType: op.paymentType || op.paymentKind || '',
          sum: Math.abs(parseFloat(op.sum || op.amount || '0')),
          description: op.description || op.comment || op.notes || '',
        };
      } catch (err) {
        addLog(`❌ Ошибка конвертации операции #${index}: ${err}`);
        return null;
      }
    }).filter(Boolean);
  };

  // Конвертация спящей базы
  const convertSleeping = (data: any[]): any[] => {
    return data.map((client, index) => {
      try {
        return {
          id: client.id || `imported-${Date.now()}-${index}`,
          client: client.client || client.company || client.name || '',
          contact: client.contact || client.contactName || '',
          phone: client.phone || client.tel || '',
          source: client.source || 'Завершенный проект',
          product: client.product || client.service || '',
          project: client.project || client.lastProject || '',
          ltv: parseFloat(client.ltv || client.totalValue || '0'),
          nextStep: client.nextStep || client.nextAction || '',
          nextStepDate: client.nextStepDate || client.nextActionDate || '',
          lastContactDate: client.lastContactDate || client.lastContact || new Date().toISOString().split('T')[0],
          comment: client.comment || client.notes || '',
          createdAt: client.createdAt || new Date().toISOString(),
        };
      } catch (err) {
        addLog(`❌ Ошибка конвертации клиента #${index}: ${err}`);
        return null;
      }
    }).filter(Boolean);
  };

  // Конвертация задач
  const convertTasks = (data: any[]): any[] => {
    return data.map((task, index) => {
      try {
        return {
          id: task.id || `imported-${Date.now()}-${index}`,
          title: task.title || task.name || task.description || '',
          priority: task.priority || 'normal',
          source: task.source || 'manual',
          dueDate: task.dueDate || task.deadline || new Date().toISOString().split('T')[0],
          done: task.done || task.completed || false,
          createdAt: task.createdAt || new Date().toISOString(),
        };
      } catch (err) {
        addLog(`❌ Ошибка конвертации задачи #${index}: ${err}`);
        return null;
      }
    }).filter(Boolean);
  };

  // Импорт данных из JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setImportLog([]);
    addLog(`📂 Загрузка файла: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rawData = e.target?.result as string;
        addLog(`✅ Файл прочитан, размер: ${rawData.length} символов`);
        
        const data = JSON.parse(rawData);
        addLog(`✅ JSON распарсен успешно`);
        
        const dataType = detectDataType(data);
        addLog(`🔍 Определен тип данных: ${dataType}`);
        
        let counts = {
          leads: 0,
          projects: 0,
          tasks: 0,
          money: 0,
          sleeping: 0,
        };

        if (dataType === 'full-backup') {
          // Полный бэкап
          addLog(`📦 Импорт полного бэкапа`);
          if (data.leads) {
            const converted = convertLeads(data.leads);
            localStorage.setItem('crm_leads', JSON.stringify(converted));
            counts.leads = converted.length;
            addLog(`✅ Лидов: ${counts.leads}`);
          }
          if (data.projects) {
            const converted = convertProjects(data.projects);
            localStorage.setItem('crm_projects', JSON.stringify(converted));
            counts.projects = converted.length;
            addLog(`✅ Проектов: ${counts.projects}`);
          }
          if (data.moneyOperations) {
            const converted = convertMoney(data.moneyOperations);
            localStorage.setItem('crm_money', JSON.stringify(converted));
            counts.money = converted.length;
            addLog(`✅ Финансовых операций: ${counts.money}`);
          }
          if (data.sleepingClients) {
            const converted = convertSleeping(data.sleepingClients);
            localStorage.setItem('crm_sleeping', JSON.stringify(converted));
            counts.sleeping = converted.length;
            addLog(`✅ Спящая база: ${counts.sleeping}`);
          }
          if (data.tasks) {
            const converted = convertTasks(data.tasks);
            localStorage.setItem('crm_tasks', JSON.stringify(converted));
            counts.tasks = converted.length;
            addLog(`✅ Задач: ${counts.tasks}`);
          }
        } else if (dataType === 'leads') {
          addLog(`👥 Импорт лидов`);
          const converted = convertLeads(data);
          localStorage.setItem('crm_leads', JSON.stringify(converted));
          counts.leads = converted.length;
          addLog(`✅ Лидов: ${counts.leads}`);
        } else if (dataType === 'projects') {
          addLog(`📊 Импорт проектов`);
          const converted = convertProjects(data);
          localStorage.setItem('crm_projects', JSON.stringify(converted));
          counts.projects = converted.length;
          addLog(`✅ Проектов: ${counts.projects}`);
        } else if (dataType === 'money') {
          addLog(`💰 Импорт финансовых операций`);
          const converted = convertMoney(data);
          localStorage.setItem('crm_money', JSON.stringify(converted));
          counts.money = converted.length;
          addLog(`✅ Финансовых операций: ${counts.money}`);
        } else if (dataType === 'sleeping') {
          addLog(`😴 Импорт спящей базы`);
          const converted = convertSleeping(data);
          localStorage.setItem('crm_sleeping', JSON.stringify(converted));
          counts.sleeping = converted.length;
          addLog(`✅ Спящая база: ${counts.sleeping}`);
        } else if (dataType === 'tasks') {
          addLog(`✓ Импорт задач`);
          const converted = convertTasks(data);
          localStorage.setItem('crm_tasks', JSON.stringify(converted));
          counts.tasks = converted.length;
          addLog(`✅ Задач: ${counts.tasks}`);
        } else {
          addLog(`❌ Не удалось определить тип данных`);
          addLog(`📋 Структура данных: ${JSON.stringify(data).substring(0, 200)}...`);
          setMessage({
            type: 'error',
            text: `❌ Не удалось определить тип данных\n\nОткройте консоль браузера (F12) для просмотра лога импорта.\n\nПопробуйте загрузить файлы по отдельности:\n- leads.json\n- projects.json\n- money.json\n- sleeping.json`
          });
          return;
        }

        const totalImported = counts.leads + counts.projects + counts.tasks + counts.money + counts.sleeping;
        
        if (totalImported === 0) {
          addLog(`⚠️ Не удалось импортировать ни одной записи`);
          setMessage({
            type: 'error',
            text: `⚠️ Данные не импортированы\n\nПроверьте формат файла. Откройте консоль (F12) для просмотра деталей.`
          });
        } else {
          addLog(`🎉 Импорт завершен успешно!`);
          setMessage({ 
            type: 'success', 
            text: `✅ Данные успешно импортированы!\n\nЛидов: ${counts.leads}\nПроектов: ${counts.projects}\nЗадач: ${counts.tasks}\nФинансовых операций: ${counts.money}\nСпящая база: ${counts.sleeping}\n\nСтраница перезагрузится через 3 секунды...` 
          });
          setTimeout(() => window.location.reload(), 3000);
        }
      } catch (error) {
        addLog(`❌ Критическая ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        setMessage({ 
          type: 'error', 
          text: `❌ Ошибка при импорте файла\n\n${error instanceof Error ? error.message : 'Неизвестная ошибка'}\n\nОткройте консоль браузера (F12) для просмотра полного лога.` 
        });
      }
    };
    reader.readAsText(file);
    
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
          Универсальный загрузчик: поддерживает разные форматы JSON из старой CRM
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

      {/* Лог импорта */}
      {importLog.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <i className="fas fa-terminal text-cyan-400"></i>
            Лог импорта
          </h3>
          <div className="bg-slate-900/50 rounded-lg p-3 max-h-60 overflow-y-auto font-mono text-xs">
            {importLog.map((log, i) => (
              <div key={i} className="text-slate-300 mb-1">{log}</div>
            ))}
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
            Поддерживаются форматы JSON из старой CRM (лиды, проекты, финансы, задачи, спящая база)
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
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Поддерживаемые форматы</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Полный бэкап:</strong> JSON с ключами leads, projects, moneyOperations, tasks, sleepingClients</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Отдельные файлы:</strong> Массив лидов, проектов, операций и т.д.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Автоопределение:</strong> Система автоматически определяет тип данных по полям</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-emerald-400 mt-1 text-xs"></i>
                <span><strong>Конвертация:</strong> Поддержка разных названий полей из старой CRM</span>
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
