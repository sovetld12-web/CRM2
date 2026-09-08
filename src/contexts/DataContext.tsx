import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============ ТИПЫ ============
export interface Lead {
  id: string;
  date: string;
  company: string;
  contact: string;
  phone: string;
  source: string;
  stage: string;
  product: string;
  project: string;
  sum: number;
  paid: number;
  nextStep: string;
  nextStepDate: string;
  responsible: string;
  comment: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'important' | 'normal';
  source: 'manual' | 'crm' | 'ai';
  dueDate: string;
  done: boolean;
  createdAt: string;
}

export interface MoneyOperation {
  id: string;
  date: string;
  type: 'income' | 'expense';
  counterparty: string;
  category: string;
  paymentType: string;
  sum: number;
  description: string;
}

export interface Project {
  id: string;
  client: string;
  vacancy: string;
  sum: number;
  days: number;
  status: string;
  responsible: string;
  leadId?: string;
}

export interface Document {
  id: string;
  type: 'contract' | 'prepay-act' | 'postpay-act';
  number: string;
  date: string;
  client: string;
  service: string;
  sum: number;
  status: string;
  projectId?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

// ============ КОНТЕКСТ ============
interface DataContextType {
  leads: Lead[];
  tasks: Task[];
  money: MoneyOperation[];
  projects: Project[];
  documents: Document[];
  menuOrder: string[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addMoney: (op: Omit<MoneyOperation, 'id'>) => void;
  deleteMoney: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addDocument: (doc: Omit<Document, 'id'>) => void;
  setMenuOrder: (order: string[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// ============ ХРАНИЛИЩЕ ============
const STORAGE_KEYS = {
  leads: 'crm_leads',
  tasks: 'crm_tasks',
  money: 'crm_money',
  projects: 'crm_projects',
  documents: 'crm_documents',
  menuOrder: 'crm_menu_order',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// ============ НАЧАЛЬНЫЕ ДАННЫЕ ============
const initialLeads: Lead[] = [
  { id: '1', date: '31.08.2026', company: '', contact: 'Сергей', phone: '', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'разработка мотивации', sum: 15000, paid: 0, nextStep: 'Вывести на созвон', nextStepDate: '01.09.2026', responsible: 'Любовь', comment: '', createdAt: '2026-08-31' },
  { id: '2', date: '31.08.2026', company: '', contact: 'Мария', phone: '', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'разработка мотивации', sum: 15000, paid: 0, nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '', createdAt: '2026-08-31' },
  { id: '3', date: '31.08.2026', company: '', contact: 'Дмитрий', phone: '', source: 'Профи', stage: 'Заявка', product: 'Консалтинг', project: 'консультация', sum: 15000, paid: 0, nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '', createdAt: '2026-08-31' },
  { id: '4', date: '31.08.2026', company: '', contact: 'Александра', phone: '', source: 'Профи', stage: 'Заявка', product: 'Рекрутинг', project: 'МОП', sum: 50000, paid: 0, nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '', createdAt: '2026-08-31' },
  { id: '5', date: '27.08.2026', company: '', contact: 'Максим', phone: '', source: 'Профи', stage: 'КП', product: 'Рекрутинг', project: 'HRD', sum: 100000, paid: 0, nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '', createdAt: '2026-08-27' },
  { id: '6', date: '26.08.2026', company: '', contact: 'Камила', phone: '', source: 'Профи', stage: 'Диагностика', product: 'Рекрутинг', project: 'МОП', sum: 50000, paid: 0, nextStep: '', nextStepDate: '', responsible: 'Любовь', comment: '', createdAt: '2026-08-26' },
  { id: '7', date: '26.08.2026', company: '', contact: 'Евгений', phone: '', source: 'Аномалия', stage: 'Диагностика', product: 'Рекрутинг', project: 'МОП', sum: 50000, paid: 0, nextStep: 'Созвон', nextStepDate: '03.09.2026', responsible: 'Любовь', comment: '', createdAt: '2026-08-26' },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Выставить счет и акт: Константин / химик технолог', priority: 'critical', source: 'crm', dueDate: '07.09.2026', done: false, createdAt: '2026-09-01' },
  { id: '2', title: 'Выставить счет и акт: Юлия / Главный бухгалтер', priority: 'critical', source: 'crm', dueDate: '07.09.2026', done: false, createdAt: '2026-09-01' },
  { id: '3', title: 'Разобрать зависшую вакансию: парковки / операционный директор', priority: 'important', source: 'crm', dueDate: '07.09.2026', done: false, createdAt: '2026-09-01' },
  { id: '4', title: 'Выставить счет и акт: Ланторо / РОП', priority: 'critical', source: 'crm', dueDate: '07.09.2026', done: false, createdAt: '2026-09-01' },
  { id: '5', title: 'Закрыть просроченные касания по лидам: 66', priority: 'important', source: 'crm', dueDate: '07.09.2026', done: false, createdAt: '2026-09-01' },
];

const initialMoney: MoneyOperation[] = [
  { id: '1', date: '02.09.2026', type: 'expense', counterparty: 'ИП Кузнецова Е.Л.', category: 'Обучение', paymentType: '', sum: 15000, description: 'Счет № 642' },
  { id: '2', date: '02.09.2026', type: 'expense', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', paymentType: '', sum: 10000, description: 'Перевод между счетами' },
  { id: '3', date: '02.09.2026', type: 'income', counterparty: 'ИП Браун И.В.', category: 'Поступление клиента', paymentType: 'Предоплата', sum: 60000, description: 'Счет №84' },
  { id: '4', date: '01.09.2026', type: 'expense', counterparty: 'Тунёва О.Д.', category: 'Вывод на карту', paymentType: '', sum: 3000, description: 'Перевод между счетами' },
  { id: '5', date: '01.09.2026', type: 'income', counterparty: 'ООО "Промнастил"', category: 'Поступление клиента', paymentType: 'Постоплата', sum: 66000, description: 'Счет № 82' },
];

const initialProjects: Project[] = [
  { id: '1', client: 'Алена', vacancy: 'ведение на абонентке', sum: 120000, days: 26, status: 'В работе', responsible: 'Любовь' },
  { id: '2', client: 'ДК Дюкарева', vacancy: 'МОП', sum: 75000, days: 94, status: 'В работе', responsible: 'Любовь' },
  { id: '3', client: 'Цивиоми', vacancy: 'подбор бухгалтера', sum: 75000, days: 83, status: 'В работе', responsible: 'Любовь' },
  { id: '4', client: 'Цивиоми', vacancy: 'подбор ГИП', sum: 100000, days: 80, status: 'В работе', responsible: 'Любовь' },
  { id: '5', client: 'На колесах', vacancy: 'автомеханик, мастер приемщик', sum: 120000, days: 80, status: 'В работе', responsible: 'Любовь' },
  { id: '6', client: 'Парковки', vacancy: 'операционный директор', sum: 120000, days: 44, status: 'В работе', responsible: 'Любовь' },
];

const defaultMenuOrder = ['dashboard', 'tasks', 'money', 'leads', 'production', 'projects', 'marketing', 'ai-assistant', 'documents', 'invoices', 'expenses', 'bank'];

// ============ ПРОВАЙДЕР ============
export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage(STORAGE_KEYS.leads, initialLeads));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEYS.tasks, initialTasks));
  const [money, setMoney] = useState<MoneyOperation[]>(() => loadFromStorage(STORAGE_KEYS.money, initialMoney));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage(STORAGE_KEYS.projects, initialProjects));
  const [documents, setDocuments] = useState<Document[]>(() => loadFromStorage(STORAGE_KEYS.documents, []));
  const [menuOrder, setMenuOrderState] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.menuOrder, defaultMenuOrder));

  useEffect(() => { saveToStorage(STORAGE_KEYS.leads, leads); }, [leads]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.tasks, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.money, money); }, [money]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.projects, projects); }, [projects]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.documents, documents); }, [documents]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.menuOrder, menuOrder); }, [menuOrder]);

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = { ...lead, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addMoney = (op: Omit<MoneyOperation, 'id'>) => {
    const newOp: MoneyOperation = { ...op, id: Date.now().toString() };
    setMoney(prev => [newOp, ...prev]);
  };

  const deleteMoney = (id: string) => {
    setMoney(prev => prev.filter(m => m.id !== id));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: Date.now().toString() };
    setProjects(prev => [newProject, ...prev]);
  };

  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc: Document = { ...doc, id: Date.now().toString() };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const setMenuOrder = (order: string[]) => {
    setMenuOrderState(order);
  };

  return (
    <DataContext.Provider value={{
      leads, tasks, money, projects, documents, menuOrder,
      addLead, updateLead, deleteLead,
      addTask, toggleTask, deleteTask,
      addMoney, deleteMoney,
      addProject, addDocument,
      setMenuOrder,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
