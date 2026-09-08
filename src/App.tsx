import { useState } from 'react';
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

export type PageType = 'dashboard' | 'tasks' | 'money' | 'leads' | 'production' | 'projects' | 'invoices' | 'expenses' | 'bank';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'money': return <Money />;
      case 'leads': return <Leads />;
      case 'production': return <Production />;
      case 'projects': return <Projects />;
      case 'invoices': return <Invoices />;
      case 'expenses': return <Expenses />;
      case 'bank': return <Bank />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a]">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
