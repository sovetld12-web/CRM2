import { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';

export default function Import() {
  const { addLead, addMoneyOperation, addProject, addSleepingClient } = useData();
  const [importType, setImportType] = useState<'leads' | 'money' | 'projects' | 'sleeping' | 'auto'>('auto');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      
      // Автоматическое определение типа данных
      if (importType === 'auto') {
        try {
          const data = JSON.parse(content);
          
          // Проверяем формат полного бэкапа CRM
          if (data.data && typeof data.data === 'object') {
            console.log('✅ Обнаружен формат: полный бэкап CRM');
            console.log('📦 Доступные данные:', Object.keys(data.data));
            // Не устанавливаем importType, так как это полный бэкап
            // Он будет обработан отдельно в handleImport
            return;
          }
          
          const sample = Array.isArray(data) ? data[0] : data;
          
          if (sample.contact || sample.company || sample.stage) {
            setImportType('leads');
          } else if (sample.type || sample.counterparty) {
            setImportType('money');
          } else if (sample.vacancy || sample.client) {
            setImportType('projects');
          } else if (sample.ltv || sample.lastContactDate) {
            setImportType('sleeping');
          }
        } catch {
          // Если не JSON, предполагаем CSV
          const firstLine = content.split('\n')[0];
          if (firstLine.includes('Контакт') || firstLine.includes('contact')) {
            setImportType('leads');
          } else if (firstLine.includes('Тип') || firstLine.includes('type')) {
            setImportType('money');
          } else if (firstLine.includes('Вакансия') || firstLine.includes('vacancy')) {
            setImportType('projects');
          }
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const parseCSV = (csv: string): any[] => {
    const lines = csv.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Поддержка разных разделителей
    const delimiter = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }

    return data;
  };

  const parseData = (content: string): any[] => {
    try {
      // Пробуем JSON
      const jsonData = JSON.parse(content);
      return Array.isArray(jsonData) ? jsonData : [jsonData];
    } catch {
      // Если не JSON, парсим как CSV
      return parseCSV(content);
    }
  };

  const handleImport = () => {
    if (!fileContent) {
      alert('Загрузите файл');
      return;
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(fileContent);
    } catch {
      alert('Не удалось распарсить JSON. Проверьте формат файла.');
      return;
    }

    console.log('📥 Начинаем импорт файла:', fileName);
    console.log('📊 Структура данных:', Object.keys(parsedData));

    // Проверяем формат полного бэкапа CRM
    if (parsedData.data && typeof parsedData.data === 'object') {
      console.log('✅ Обнаружен формат: полный бэкап CRM');
      console.log('📦 Доступные данные:', Object.keys(parsedData.data));
      
      const errors: string[] = [];
      let successCount = 0;
      
      // Импортируем лиды
      if (parsedData.data.leads && Array.isArray(parsedData.data.leads)) {
        console.log(`📥 Импортируем лидов: ${parsedData.data.leads.length}`);
        parsedData.data.leads.forEach((lead: any, index: number) => {
          try {
            addLead({
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
            });
            successCount++;
          } catch (err) {
            errors.push(`Лид ${index + 1}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }
      
      // Импортируем спящую базу
      if (parsedData.data.sleepingLeads && Array.isArray(parsedData.data.sleepingLeads)) {
        console.log(`📥 Импортируем спящую базу: ${parsedData.data.sleepingLeads.length}`);
        parsedData.data.sleepingLeads.forEach((lead: any, index: number) => {
          try {
            addSleepingClient({
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
            });
            successCount++;
          } catch (err) {
            errors.push(`Спящая база ${index + 1}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }
      
      // Импортируем проекты (заказы)
      if (parsedData.data.orders && Array.isArray(parsedData.data.orders)) {
        console.log(`📥 Импортируем проектов: ${parsedData.data.orders.length}`);
        parsedData.data.orders.forEach((order: any, index: number) => {
          try {
            addProject({
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
            });
            successCount++;
          } catch (err) {
            errors.push(`Проект ${index + 1}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }
      
      // Импортируем финансовые операции
      if (parsedData.data.bankTransactions && Array.isArray(parsedData.data.bankTransactions)) {
        console.log(`📥 Импортируем финансовых операций: ${parsedData.data.bankTransactions.length}`);
        parsedData.data.bankTransactions.forEach((tx: any, index: number) => {
          try {
            addMoneyOperation({
              date: tx.date || new Date().toISOString().split('T')[0],
              type: tx.type || 'income',
              counterparty: tx.counterparty || '',
              category: tx.category || 'Прочее',
              paymentType: tx.paymentType || '',
              sum: tx.sum || tx.amount || 0,
              description: tx.description || tx.comment || '',
            });
            successCount++;
          } catch (err) {
            errors.push(`Транзакция ${index + 1}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }
      
      console.log(`✅ Импорт завершен. Успешно: ${successCount}, Ошибок: ${errors.length}`);
      
      if (successCount > 0) {
        alert(`✅ Успешно импортировано: ${successCount} записей\n\nЛидов: ${parsedData.data.leads?.length || 0}\nСпящая база: ${parsedData.data.sleepingLeads?.length || 0}\nПроектов: ${parsedData.data.orders?.length || 0}\nТранзакций: ${parsedData.data.bankTransactions?.length || 0}\n\nСтраница перезагрузится через 2 секунды...`);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert(`❌ Не удалось импортировать данные.\n\nОшибки:\n${errors.join('\n')}`);
      }
      
      return;
    }

    // Обработка отдельных файлов (не полный бэкап)
    const data = parseData(fileContent);
    
    if (data.length === 0) {
      alert('Не удалось распарсить данные. Проверьте формат файла.');
      return;
    }

    console.log('Распарсенные данные:', data);
    console.log('Тип импорта:', importType);
    
    const errors: string[] = [];
    let successCount = 0;

    try {
      if (importType === 'leads') {
        data.forEach((row, index) => {
          try {
            addLead({
              date: row['Дата'] || row['date'] || row['createdAt'] || new Date().toLocaleDateString('ru-RU'),
              company: row['Компания'] || row['company'] || '',
              contact: row['Контакт'] || row['contact'] || '',
              phone: row['Телефон'] || row['phone'] || '',
              source: row['Источник'] || row['source'] || 'Другое',
              stage: row['Этап'] || row['stage'] || 'Заявка',
              product: row['Продукт'] || row['product'] || 'Рекрутинг',
              project: row['Проект'] || row['project'] || '',
              sum: parseFloat(row['Сумма'] || row['sum'] || '0'),
              paid: parseFloat(row['Оплачено'] || row['paid'] || '0'),
              nextStep: row['Следующий шаг'] || row['nextStep'] || '',
              nextStepDate: row['Дата след. шага'] || row['nextStepDate'] || '',
              responsible: row['Ответственный'] || row['responsible'] || 'Любовь',
              comment: row['Комментарий'] || row['comment'] || '',
            });
            successCount++;
          } catch (err) {
            errors.push(`Строка ${index + 2}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      } else if (importType === 'money') {
        data.forEach((row, index) => {
          try {
            addMoneyOperation({
              date: row['Дата'] || row['date'] || new Date().toLocaleDateString('ru-RU'),
              type: row['Тип'] === 'Поступление' || row['type'] === 'income' ? 'income' : 'expense',
              counterparty: row['Контрагент'] || row['counterparty'] || '',
              category: row['Категория'] || row['category'] || 'Прочее',
              paymentType: row['Вид оплаты'] || row['paymentType'] || '',
              sum: parseFloat(row['Сумма'] || row['sum'] || '0'),
              description: row['Описание'] || row['description'] || '',
            });
            successCount++;
          } catch (err) {
            errors.push(`Строка ${index + 2}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      } else if (importType === 'projects') {
        data.forEach((row, index) => {
          try {
            addProject({
              client: row['Клиент'] || row['client'] || '',
              vacancy: row['Вакансия'] || row['vacancy'] || '',
              sum: parseFloat(row['Сумма'] || row['sum'] || '0'),
              days: parseInt(row['Дней'] || row['days'] || '0'),
              status: row['Статус'] || row['status'] || 'В работе',
              startDate: row['Дата начала'] || row['startDate'] || new Date().toISOString().split('T')[0],
              contact: row['Контакт'] || row['contact'] || '',
              phone: row['Телефон'] || row['phone'] || '',
              firstCandidateDate: row['Дата кандидата'] || row['firstCandidateDate'] || '',
              offerDate: row['Дата оффера'] || row['offerDate'] || '',
              workStartDate: row['Дата выхода'] || row['workStartDate'] || '',
              paid: parseFloat(row['Оплачено'] || row['paid'] || '0'),
              directCosts: parseFloat(row['Затраты'] || row['directCosts'] || '0'),
              expectedPaymentDate: row['Дата оплаты'] || row['expectedPaymentDate'] || '',
              paymentProbability: parseInt(row['Вероятность'] || row['paymentProbability'] || '100'),
              closingNorm: parseInt(row['Норматив'] || row['closingNorm'] || '30'),
              comment: row['Комментарий'] || row['comment'] || '',
              responsible: row['Ответственный'] || row['responsible'] || 'Любовь',
            });
            successCount++;
          } catch (err) {
            errors.push(`Строка ${index + 2}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      } else if (importType === 'sleeping') {
        data.forEach((row, index) => {
          try {
            addSleepingClient({
              client: row['Клиент'] || row['client'] || '',
              contact: row['Контакт'] || row['contact'] || '',
              phone: row['Телефон'] || row['phone'] || '',
              source: row['Источник'] || row['source'] || 'Завершенный проект',
              product: row['Продукт'] || row['product'] || '',
              project: row['Проект'] || row['project'] || '',
              ltv: parseFloat(row['LTV'] || row['ltv'] || '0'),
              nextStep: row['Следующий шаг'] || row['nextStep'] || '',
              nextStepDate: row['Дата след. шага'] || row['nextStepDate'] || '',
              lastContactDate: row['Дата контакта'] || row['lastContactDate'] || new Date().toISOString().split('T')[0],
              comment: row['Комментарий'] || row['comment'] || '',
            });
            successCount++;
          } catch (err) {
            errors.push(`Строка ${index + 2}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }

      setImportResult({ success: successCount, errors });
      
      if (successCount > 0) {
        alert(`✅ Успешно импортировано: ${successCount} записей${errors.length > 0 ? `\n⚠️ Ошибок: ${errors.length}` : ''}`);
      } else {
        alert(`❌ Не удалось импортировать данные.\n\nРаспарсено строк: ${data.length}\nТип импорта: ${importType}\n\nОшибки:\n${errors.join('\n') || 'Нет ошибок'}`);
      }
      
      setFileContent('');
      setFileName('');
    } catch (err) {
      setImportResult({ success: 0, errors: [err instanceof Error ? err.message : 'Ошибка импорта'] });
      alert(`❌ Критическая ошибка импорта: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    }
  };

  const downloadTemplate = (type: string) => {
    let template = '';
    let filename = '';

    if (type === 'leads') {
      template = JSON.stringify([
        {
          date: '01.09.2026',
          company: 'ООО Пример',
          contact: 'Иван Иванов',
          phone: '+79991234567',
          source: 'Профи',
          stage: 'Заявка',
          product: 'Рекрутинг',
          project: 'Менеджер по продажам',
          sum: 50000,
          paid: 0,
          nextStep: 'Позвонить',
          nextStepDate: '05.09.2026',
          responsible: 'Любовь',
          comment: 'Интересная вакансия'
        }
      ], null, 2);
      filename = 'template_leads.json';
    } else if (type === 'money') {
      template = JSON.stringify([
        {
          date: '01.09.2026',
          type: 'income',
          counterparty: 'ООО Клиент',
          category: 'Поступление клиента',
          paymentType: 'Предоплата',
          sum: 50000,
          description: 'Оплата по договору'
        }
      ], null, 2);
      filename = 'template_money.json';
    } else if (type === 'projects') {
      template = JSON.stringify([
        {
          client: 'ООО Пример',
          vacancy: 'Менеджер по продажам',
          sum: 80000,
          days: 10,
          status: 'В работе',
          startDate: '2026-09-01',
          contact: 'Иван Иванов',
          phone: '+79991234567',
          firstCandidateDate: '',
          offerDate: '',
          workStartDate: '',
          paid: 0,
          directCosts: 0,
          expectedPaymentDate: '',
          paymentProbability: 100,
          closingNorm: 30,
          comment: '',
          responsible: 'Любовь'
        }
      ], null, 2);
      filename = 'template_projects.json';
    } else if (type === 'sleeping') {
      template = JSON.stringify([
        {
          client: 'ООО Пример',
          contact: 'Иван Иванов',
          phone: '+79991234567',
          source: 'Завершенный проект',
          product: 'Рекрутинг',
          project: 'Менеджер по продажам',
          ltv: 80000,
          nextStep: 'Повторное касание',
          nextStepDate: '2026-10-01',
          lastContactDate: '2026-09-01',
          comment: 'Проект завершен успешно'
        }
      ], null, 2);
      filename = 'template_sleeping.json';
    }

    const blob = new Blob([template], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-file-import text-indigo-400"></i>
          Импорт данных
        </h1>
        <p className="text-sm text-slate-400 mt-1">Загрузите данные из старой CRM (JSON или CSV)</p>
      </div>

      {/* Import Type */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Что импортируем?</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setImportType('auto')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              importType === 'auto'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-magic mr-2"></i>Авто
          </button>
          <button
            onClick={() => setImportType('leads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              importType === 'leads'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-user-plus mr-2"></i>Лиды
          </button>
          <button
            onClick={() => setImportType('money')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              importType === 'money'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-wallet mr-2"></i>Финансы
          </button>
          <button
            onClick={() => setImportType('projects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              importType === 'projects'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-project-diagram mr-2"></i>Проекты
          </button>
          <button
            onClick={() => setImportType('sleeping')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              importType === 'sleeping'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <i className="fas fa-bed mr-2"></i>Спящая база
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Загрузите файл (JSON или CSV)</h3>
        
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-700/50 hover:border-indigo-500/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <i className="fas fa-cloud-upload-alt text-4xl text-slate-500 mb-3"></i>
          <p className="text-sm text-slate-400">
            {fileName ? (
              <span className="text-indigo-400 font-medium">{fileName}</span>
            ) : (
              <>
                Перетащите файл сюда или <span className="text-indigo-400">нажмите для выбора</span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-1">Поддерживаются форматы: JSON, CSV</p>
        </div>

        {fileContent && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Предпросмотр данных:</p>
            <pre className="text-xs text-slate-300 overflow-x-auto max-h-40">
              {fileContent.split('\n').slice(0, 10).join('\n')}
              {fileContent.split('\n').length > 10 && '\n...'}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            onClick={() => downloadTemplate('leads')} 
            className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-download mr-2"></i>Шаблон лидов
          </button>
          <button 
            onClick={() => downloadTemplate('money')} 
            className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-download mr-2"></i>Шаблон финансов
          </button>
          <button 
            onClick={() => downloadTemplate('projects')} 
            className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-download mr-2"></i>Шаблон проектов
          </button>
          <button 
            onClick={() => downloadTemplate('sleeping')} 
            className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
          >
            <i className="fas fa-download mr-2"></i>Шаблон спящей базы
          </button>
          <button 
            onClick={handleImport} 
            disabled={!fileContent} 
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-upload mr-2"></i>Импортировать
          </button>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Результат импорта</h3>
          <div className="flex items-center gap-2 mb-3">
            <i className={`fas ${importResult.success > 0 ? 'fa-check-circle text-emerald-400' : 'fa-times-circle text-red-400'} text-xl`}></i>
            <span className="text-sm text-slate-300">
              Успешно импортировано: <strong className="text-white">{importResult.success}</strong>
            </span>
          </div>
          {importResult.errors.length > 0 && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400 font-medium mb-2">Ошибки:</p>
              <ul className="text-xs text-red-300 space-y-1 max-h-40 overflow-y-auto">
                {importResult.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <i className="fas fa-info-circle text-cyan-400"></i>
          Инструкция
        </h3>
        <div className="text-xs text-slate-400 space-y-2">
          <p><strong className="text-slate-300">1.</strong> Скачайте шаблон для нужного типа данных (JSON формат)</p>
          <p><strong className="text-slate-300">2.</strong> Заполните данные в соответствии с шаблоном</p>
          <p><strong className="text-slate-300">3.</strong> Загрузите файл (перетащите или нажмите для выбора)</p>
          <p><strong className="text-slate-300">4.</strong> Выберите тип данных или используйте автоопределение</p>
          <p><strong className="text-slate-300">5.</strong> Нажмите "Импортировать"</p>
          
          <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
            <p className="text-xs text-indigo-300 font-medium mb-2">
              <i className="fas fa-lightbulb mr-1"></i>
              Совет: Используйте режим "Авто" для автоматического определения типа данных
            </p>
            <p className="text-xs text-slate-400">
              Система анализирует структуру файла и автоматически выбирает нужный тип импорта.
            </p>
          </div>

          <p className="mt-3 text-amber-400">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            Важно: Все данные сохраняются в localStorage браузера. Сделайте резервную копию перед импортом больших объемов данных.
          </p>
        </div>
      </div>
    </div>
  );
}
