import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { PeriodProvider, usePeriod } from './contexts/PeriodContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Money from './pages/Money';
import Leads from './pages/Leads';
import Production from './pages/Production';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Bank from './pages/Bank';
import Marketing from './pages/Marketing';
import AIAssistant from './pages/AIAssistant';
import Documents from './pages/Documents';
import Import from './pages/Import';
import SleepingBase from './pages/SleepingBase';
import DataManager from './pages/DataManager';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = usePeriod();

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'money': return <Money />;
      case 'leads': return <Leads />;
      case 'production': return <Production />;
      case 'projects': return <Projects />;
      case 'marketing': return <Marketing />;
      case 'ai-assistant': return <AIAssistant />;
      case 'documents': return <Documents />;
      case 'invoices': return <Invoices />;
      case 'expenses': return <Expenses />;
      case 'bank': return <Bank />;
      case 'import': return <Import />;
      case 'sleeping-base': return <SleepingBase />;
      case 'data-manager': return <DataManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'
        }`}
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden sticky top-0 z-30 p-3 border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 transition-all"
            style={{ color: 'var(--text-primary)' }}
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>

        {/* Global Period Selector */}
        <div className="sticky top-0 md:top-0 z-40 backdrop-blur-md border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <i className="fas fa-calendar-alt text-indigo-400"></i>
              <span className="text-xs md:text-sm text-slate-400">Период:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                {months.map((month, i) => (
                  <option key={i} value={i}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-slate-400">
              <i className="fas fa-database mr-2"></i>
              Данные за {months[selectedMonth]} {selectedYear}
            </div>
          </div>
        </div>
        
        <div className="p-6 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <PeriodProvider>
          <AppContent />
        </PeriodProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
