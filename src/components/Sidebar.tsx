import { PageType } from '../App';

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const menuItems: { id: PageType; label: string; icon: string; badge?: string }[] = [
  { id: 'dashboard', label: 'Центр управления', icon: 'fas fa-chart-line' },
  { id: 'tasks', label: 'Задачи', icon: 'fas fa-check-circle', badge: '8' },
  { id: 'money', label: 'Деньги', icon: 'fas fa-wallet' },
  { id: 'leads', label: 'Лиды', icon: 'fas fa-users', badge: '7' },
  { id: 'production', label: 'Производство', icon: 'fas fa-briefcase', badge: '10' },
  { id: 'projects', label: 'Проекты', icon: 'fas fa-folder-open' },
  { id: 'invoices', label: 'Счета', icon: 'fas fa-file-invoice' },
  { id: 'expenses', label: 'Затраты', icon: 'fas fa-receipt' },
  { id: 'bank', label: 'Банк', icon: 'fas fa-university' },
];

export default function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 h-screen bg-[#0c1222] border-r border-slate-800/50 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">КР</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold gradient-text whitespace-nowrap">Команда Роста</h1>
            <p className="text-[10px] text-slate-500 whitespace-nowrap">CRM-система</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`sidebar-item w-full ${currentPage === item.id ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <i className={`${item.icon} w-5 text-center text-sm ${currentPage === item.id ? 'text-indigo-400' : ''}`}></i>
            {!collapsed && (
              <>
                <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="badge badge-info text-[10px] px-1.5 py-0">{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
          {!collapsed && <span className="text-xs">Свернуть</span>}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Л</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">Любовь</p>
              <p className="text-[10px] text-slate-500">Администратор</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
