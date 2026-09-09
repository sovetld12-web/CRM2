import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============ ТИПЫ ============
export interface Lead {
  id: string;
  date: string;
  company: string;
  contact: string;
  phone: string;
  source: string;
  stage: 'Заявка' | 'Диагностика' | 'КП' | 'Договор заключен' | 'Продажа' | 'Отказ' | 'Клиент не отвечает' | 'Спящая база';
  product: string;
  project: string;
  sum: number;
  paid: number;
  nextStep: string;
  nextStepDate: string;
  responsible: string;
  comment: string;
  createdAt: string;
  sourceLeadId?: string;
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
  startDate: string;
  sourceLeadId?: string;
  endDate?: string;
  responsible?: string;
  contact?: string;
  phone?: string;
  firstCandidateDate?: string;
  offerDate?: string;
  workStartDate?: string;
  paid?: number;
  directCosts?: number;
  expectedPaymentDate?: string;
  paymentProbability?: number;
  closingNorm?: number;
  comment?: string;
  pauseReason?: string;
  pauseDate?: string;
}

export interface SleepingClient {
  id: string;
  client: string;
  contact: string;
  phone: string;
  source: string;
  product: string;
  project: string;
  ltv: number;
  nextStep: string;
  nextStepDate: string;
  lastContactDate: string;
  comment: string;
  createdAt: string;
}

interface DataContextType {
  leads: Lead[];
  tasks: Task[];
  moneyOperations: MoneyOperation[];
  projects: Project[];
  sleepingClients: SleepingClient[];
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addMoneyOperation: (op: Omit<MoneyOperation, 'id'>) => void;
  updateMoneyOperation: (id: string, updates: Partial<MoneyOperation>) => void;
  deleteMoneyOperation: (id: string) => void;
  
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addSleepingClient: (client: Omit<SleepingClient, 'id' | 'createdAt'>) => void;
  updateSleepingClient: (id: string, updates: Partial<SleepingClient>) => void;
  deleteSleepingClient: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============ БИЗНЕС-ЛОГИКА ============

// Проверка, является ли продукт консалтингом
const isConsulting = (product: string, comment: string): boolean => {
  if (product === 'Консалтинг') {
    // Проверяем, есть ли слова о вакансиях
    const recruitingKeywords = ['вакансия', 'кандидат', 'подбор', 'рекрутинг'];
    const text = `${product} ${comment}`.toLowerCase();
    return !recruitingKeywords.some(keyword => text.includes(keyword));
  }
  return false;
};

// Расчет рабочих дней между датами
const calculateWorkingDays = (startDate: string, endDate: string = new Date().toISOString().split('T')[0]): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Исключаем субботу и воскресенье
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

// Проверка, является ли операция внутренним переводом
const isInternalTransfer = (description: string, counterparty: string): boolean => {
  const text = `${description} ${counterparty}`.toLowerCase();
  const transferKeywords = [
    'между своими',
    'собственные средства',
    'перевод на свой счет',
    'тунёва',
    'налоговая копилка',
    'пополнение счета',
    'снятие со счета'
  ];
  return transferKeywords.some(keyword => text.includes(keyword));
};

// Проверка, является ли операция кредитом
const isCredit = (description: string, category: string): boolean => {
  const text = `${description} ${category}`.toLowerCase();
  const creditKeywords = ['кредит', 'займ', 'выдача кредита'];
  return category === 'Кредиты' || creditKeywords.some(keyword => text.includes(keyword));
};

// Определение типа платежа (предоплата/постоплата)
const detectPaymentType = (description: string, manualType: string, category?: string): string => {
  if (manualType) return manualType;
  
  const text = `${description} ${category || ''}`.toLowerCase();
  
  // Предоплата
  if (text.includes('предоплата') || 
      text.includes('аванс') || 
      text.includes('первый платеж') ||
      text.includes('30%') ||
      text.includes('начальный взнос')) {
    return 'Предоплата';
  }
  
  // Постоплата
  if (text.includes('постоплата') || 
      text.includes('доплата') || 
      text.includes('остаток') || 
      text.includes('окончательный платеж') ||
      text.includes('70%') ||
      text.includes('финальный платеж')) {
    return 'Постоплата';
  }
  
  return '';
};

// ============ PROVIDER ============

export function DataProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('crm_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [moneyOperations, setMoneyOperations] = useState<MoneyOperation[]>(() => {
    const saved = localStorage.getItem('crm_money');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('crm_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [sleepingClients, setSleepingClients] = useState<SleepingClient[]>(() => {
    const saved = localStorage.getItem('crm_sleeping');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('crm_money', JSON.stringify(moneyOperations));
  }, [moneyOperations]);

  useEffect(() => {
    localStorage.setItem('crm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('crm_sleeping', JSON.stringify(sleepingClients));
  }, [sleepingClients]);

  // ============ ЛИДЫ ============
  
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => {
      const updated = prev.map(lead => {
        if (lead.id !== id) return lead;
        
        const updatedLead = { ...lead, ...updates };
        
        // Логика перехода в спящую базу при "Клиент не отвечает"
        if (updates.stage === 'Клиент не отвечает') {
          updatedLead.nextStep = 'Повторное касание';
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 30);
          updatedLead.nextStepDate = nextDate.toISOString().split('T')[0];
          updatedLead.stage = 'Спящая база';
        }
        
        // Логика создания проекта при "Договор заключен" или "Продажа"
        if ((updates.stage === 'Договор заключен' || updates.stage === 'Продажа') && 
            !isConsulting(lead.product, lead.comment)) {
          
          // Проверяем, есть ли уже проект для этого лида
          const existingProject = projects.find(p => p.sourceLeadId === id);
          
          if (!existingProject) {
            // Создаем новый проект
            const newProject: Project = {
              id: Date.now().toString(),
              client: lead.company || lead.contact,
              vacancy: lead.project || lead.product,
              sum: lead.sum,
              days: 0,
              status: 'В работе',
              startDate: new Date().toISOString().split('T')[0],
              sourceLeadId: id,
              responsible: lead.responsible,
            };
            setProjects(prev => [newProject, ...prev]);
            
            // Создаем задачу "Выставить счет и акт"
            const newTask: Task = {
              id: (Date.now() + 1).toString(),
              title: `Выставить счет и акт: ${lead.company || lead.contact} / ${lead.project || lead.product}`,
              priority: 'critical',
              source: 'crm',
              dueDate: new Date().toISOString().split('T')[0],
              done: false,
              createdAt: new Date().toISOString(),
            };
            setTasks(prev => [newTask, ...prev]);
          }
        }
        
        return updatedLead;
      });
      
      return updated;
    });
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  // ============ ЗАДАЧИ ============
  
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // ============ ФИНАНСЫ ============
  
  const addMoneyOperation = (opData: Omit<MoneyOperation, 'id'>) => {
    // Нормализация данных
    let normalizedType = opData.type;
    let normalizedSum = Math.abs(opData.sum);
    
    // Исключаем внутренние переводы
    if (isInternalTransfer(opData.description, opData.counterparty)) {
      return; // Не добавляем внутренние переводы
    }
    
    // Исключаем кредиты из поступлений
    if (normalizedType === 'income' && isCredit(opData.description, opData.category)) {
      return; // Не добавляем кредиты как выручку
    }
    
    // Определяем тип платежа
    const paymentType = detectPaymentType(opData.description, opData.paymentType, opData.category);
    
    const newOp: MoneyOperation = {
      ...opData,
      id: Date.now().toString(),
      type: normalizedType,
      sum: normalizedSum,
      paymentType,
    };
    
    setMoneyOperations(prev => [newOp, ...prev]);
  };

  const deleteMoneyOperation = (id: string) => {
    setMoneyOperations(prev => prev.filter(op => op.id !== id));
  };

  const updateMoneyOperation = (id: string, updates: Partial<MoneyOperation>) => {
    setMoneyOperations(prev => prev.map(op => 
      op.id === id ? { ...op, ...updates } : op
    ));
  };

  // ============ ПРОЕКТЫ ============
  
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== id) return project;
      
      const updatedProject = { ...project, ...updates };
      
      // Автоматически считаем дни в работе
      if (updatedProject.status === 'В работе' && updatedProject.startDate) {
        updatedProject.days = calculateWorkingDays(updatedProject.startDate);
        
        // Создаем задачу-напоминание если проект работает больше 30 дней
        if (updatedProject.days > 30) {
          const existingTask = tasks.find(t => 
            t.title.includes(updatedProject.vacancy) && 
            t.title.includes('зависшую вакансию')
          );
          
          if (!existingTask) {
            const newTask: Task = {
              id: Date.now().toString(),
              title: `Разобрать зависшую вакансию: ${updatedProject.client} / ${updatedProject.vacancy} (${updatedProject.days} раб. дн.)`,
              priority: updatedProject.days > 60 ? 'critical' : 'important',
              source: 'crm',
              dueDate: new Date().toISOString().split('T')[0],
              done: false,
              createdAt: new Date().toISOString(),
            };
            setTasks(prev => [newTask, ...prev]);
          }
        }
      }
      
      // При закрытии проекта создаем задачу "Выставить счет и акт"
      if (updates.status === 'Закрыт' && project.status !== 'Закрыт') {
        const newTask: Task = {
          id: (Date.now() + 1).toString(),
          title: `Выставить счет и акт: ${updatedProject.client} / ${updatedProject.vacancy}`,
          priority: 'critical',
          source: 'crm',
          dueDate: new Date().toISOString().split('T')[0],
          done: false,
          createdAt: new Date().toISOString(),
        };
        setTasks(prev => [newTask, ...prev]);

        // Автоматически добавляем клиента в спящую базу
        const existingClient = sleepingClients.find(c => c.client === updatedProject.client);
        if (!existingClient) {
          // Рассчитываем LTV клиента
          const clientProjects = projects.filter(p => p.client === updatedProject.client && p.status === 'Закрыт');
          const ltv = clientProjects.reduce((sum, p) => sum + p.sum, 0) + updatedProject.sum;

          const newSleepingClient: SleepingClient = {
            id: (Date.now() + 2).toString(),
            client: updatedProject.client,
            contact: updatedProject.contact || '',
            phone: updatedProject.phone || '',
            source: 'Завершенный проект',
            product: updatedProject.vacancy,
            project: updatedProject.vacancy,
            ltv: ltv,
            nextStep: 'Повторное касание',
            nextStepDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lastContactDate: new Date().toISOString().split('T')[0],
            comment: `Проект завершен ${new Date().toLocaleDateString('ru-RU')}. Сумма: ${updatedProject.sum.toLocaleString('ru-RU')} ₽`,
            createdAt: new Date().toISOString(),
          };
          setSleepingClients(prev => [newSleepingClient, ...prev]);
        } else {
          // Обновляем LTV существующего клиента
          const clientProjects = projects.filter(p => p.client === existingClient.client && p.status === 'Закрыт');
          const ltv = clientProjects.reduce((sum, p) => sum + p.sum, 0) + updatedProject.sum;
          updateSleepingClient(existingClient.id, {
            ltv: ltv,
            lastContactDate: new Date().toISOString().split('T')[0],
            comment: `${existingClient.comment}\n[ПРОЕКТ ЗАВЕРШЕН] ${new Date().toLocaleDateString('ru-RU')}: ${updatedProject.vacancy} (${updatedProject.sum.toLocaleString('ru-RU')} ₽)`,
          });
        }
      }
      
      return updatedProject;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // ============ СПЯЩАЯ БАЗА ============
  
  const addSleepingClient = (clientData: Omit<SleepingClient, 'id' | 'createdAt'>) => {
    const newClient: SleepingClient = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSleepingClients(prev => [newClient, ...prev]);
  };

  const updateSleepingClient = (id: string, updates: Partial<SleepingClient>) => {
    setSleepingClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  const deleteSleepingClient = (id: string) => {
    setSleepingClients(prev => prev.filter(client => client.id !== id));
  };

  // ============ АВТОМАТИЧЕСКИЕ ЗАДАЧИ ============
  
  useEffect(() => {
    // Проверка просроченных касаний по лидам
    const today = new Date().toISOString().split('T')[0];
    
    leads.forEach(lead => {
      if (lead.nextStepDate && lead.nextStepDate < today && lead.stage !== 'Отказ' && lead.stage !== 'Спящая база') {
        const existingTask = tasks.find(t => 
          t.title.includes(lead.contact) && 
          t.title.includes('Просрочено касание')
        );
        
        if (!existingTask) {
          const newTask: Task = {
            id: Date.now().toString() + Math.random(),
            title: `Просрочено касание: ${lead.contact} (${lead.company || lead.project})`,
            priority: 'critical',
            source: 'crm',
            dueDate: today,
            done: false,
            createdAt: new Date().toISOString(),
          };
          setTasks(prev => [newTask, ...prev]);
        }
      }
    });
  }, [leads, tasks]);

  return (
    <DataContext.Provider value={{
      leads,
      tasks,
      moneyOperations,
      projects,
      sleepingClients,
      
      addLead,
      updateLead,
      deleteLead,
      
      addTask,
      updateTask,
      deleteTask,
      
      addMoneyOperation,
      updateMoneyOperation,
      deleteMoneyOperation,
      
      addProject,
      updateProject,
      deleteProject,
      
      addSleepingClient,
      updateSleepingClient,
      deleteSleepingClient,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
