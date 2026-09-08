import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Import() {
  const { addLead, addMoneyOperation, addProject } = useData();
  const [importType, setImportType] = useState<'leads' | 'money' | 'projects'>('leads');
  const [fileContent, setFileContent] = useState('');
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv: string): any[] => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }

    return data;
  };

  const handleImport = () => {
    if (!fileContent) {
      alert('Загрузите файл');
      return;
    }

    const data = parseCSV(fileContent);
    const errors: string[] = [];
    let successCount = 0;

    try {
      if (importType === 'leads') {
        data.forEach((row, index) => {
          try {
            addLead({
              date: row['Дата'] || row['date'] || new Date().toLocaleDateString('ru-RU'),
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
              type: row['Тип'] === 'Поступление' ? 'income' : 'expense',
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
            });
            successCount++;
          } catch (err) {
            errors.push(`Строка ${index + 2}: ${err instanceof Error ? err.message : 'Ошибка'}`);
          }
        });
      }

      setImportResult({ success: successCount, errors });
      setFileContent('');
    } catch (err) {
      setImportResult({ success: 0, errors: [err instanceof Error ? err.message : 'Ошибка импорта'] });
    }
  };

  const downloadTemplate = () => {
    let csv = '';
    if (importType === 'leads') {
      csv = 'Дата,Компания,Контакт,Телефон,Источник,Этап,Продукт,Проект,Сумма,Оплачено,Следующий шаг,Дата след. шага,Ответственный,Комментарий\n';
      csv += '01.09.2026,ООО Пример,Иван Иванов,+79991234567,Профи,Заявка,Рекрутинг,МОП,50000,0,Позвонить,05.09.2026,Любовь,\n';
    } else if (importType === 'money') {
      csv = 'Дата,Тип,Контрагент,Категория,Вид оплаты,Сумма,Описание\n';
      csv += '01.09.2026,Поступление,ООО Клиент,Поступление клиента,Предоплата,50000,Оплата по договору\n';
    } else if (importType === 'projects') {
      csv = 'Клиент,Вакансия,Сумма,Дней,Статус,Дата начала\n';
      csv += 'ООО Пример,Менеджер по продажам,80000,10,В работе,2026-09-01\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `template_${importType}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="fas fa-file-import text-indigo-400"></i>
          Импорт данных
        </h1>
        <p className="text-sm text-slate-400 mt-1">Загрузите данные из старой CRM или Excel</p>
      </div>

      {/* Import Type */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Что импортируем?</h3>
        <div className="flex gap-2">
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
        </div>
      </div>

      {/* File Upload */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Загрузите CSV файл</h3>
        <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-8 text-center hover:border-indigo-500/30 transition-all">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-500 mb-3"></i>
            <p className="text-sm text-slate-400">Нажмите для загрузки или перетащите файл</p>
            <p className="text-xs text-slate-500 mt-1">Поддерживается CSV формат</p>
          </label>
        </div>

        {fileContent && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Предпросмотр данных:</p>
            <pre className="text-xs text-slate-300 overflow-x-auto max-h-40">
              {fileContent.split('\n').slice(0, 5).join('\n')}
              {fileContent.split('\n').length > 5 && '\n...'}
            </pre>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button onClick={downloadTemplate} className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <i className="fas fa-download mr-2"></i>Скачать шаблон
          </button>
          <button onClick={handleImport} disabled={!fileContent} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
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
              <ul className="text-xs text-red-300 space-y-1">
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
          <p>1. Скачайте шаблон для нужного типа данных</p>
          <p>2. Заполните данные в Excel или другом редакторе</p>
          <p>3. Сохраните файл в формате CSV (разделитель — запятая)</p>
          <p>4. Загрузите файл и нажмите "Импортировать"</p>
          <p className="mt-3 text-amber-400">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            Важно: даты в формате ДД.ММ.ГГГГ, суммы без пробелов и символов
          </p>
        </div>
      </div>
    </div>
  );
}
