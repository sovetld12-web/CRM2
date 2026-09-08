import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Money from './pages/Money';
import Leads from './pages/Leads';
import Production from './pages/Production';
import Projects from './pages/Projects';
import Marketing from './pages/Marketing';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Bank from './pages/Bank';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'money': return <Money />;
      case 'leads': return <Leads />;
      case 'production': return <Production />;
      case 'projects': return <Projects />;
      case 'marketing': return <Marketing />;
      case 'invoices': return <Invoices />;
      case 'expenses': return <Expenses />;
      case 'bank': return <Bank />;
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
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
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
      <AppContent />
    </ThemeProvider>
  );
}
