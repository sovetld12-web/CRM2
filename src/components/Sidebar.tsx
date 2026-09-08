import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Центр управления', icon: 'fas fa-chart-line' },
    { id: 'tasks', label: 'Задачи', icon: 'fas fa-tasks', badge: 8 },
    { id: 'money', label: 'Деньги', icon: 'fas fa-wallet' },
    { id: 'leads', label: 'Лиды', icon: 'fas fa-user-plus', badge: 7 },
    { id: 'production', label: 'Производство', icon: 'fas fa-briefcase' },
    { id: 'projects', label: 'Проекты', icon: 'fas fa-project-diagram' },
    { id: 'marketing', label: 'Маркетинг', icon: 'fas fa-bullhorn' },
    { id: 'invoices', label: 'Счета', icon: 'fas fa-file-invoice' },
    { id: 'expenses', label: 'Затраты', icon: 'fas fa-receipt' },
    { id: 'bank', label: 'Банк', icon: 'fas fa-university' },
  ];

  return (
    <aside
      className={`sidebar-container fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <i className="fas fa-rocket text-white text-sm"></i>
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Команда Роста</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 transition-all"
          style={{ color: 'var(--text-secondary)' }}
        >
          <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-xs`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`sidebar-item w-full ${currentPage === item.id ? 'active' : ''}`}
            title={!isOpen ? item.label : undefined}
          >
            <i className={`${item.icon} w-5 text-center`}></i>
            {isOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        {/* Theme toggle */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} mb-2`}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            style={{ transform: theme === 'light' ? undefined : undefined }}
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          >
            <span className={`absolute inset-0 flex items-center ${theme === 'dark' ? 'justify-start pl-1.5' : 'justify-end pr-1.5'}`}>
              <i className={`fas ${theme === 'dark' ? 'fa-moon text-indigo-300' : 'fa-sun text-amber-400'} text-[10px]`}></i>
            </span>
          </button>
          {isOpen && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            </span>
          )}
        </div>

        {/* User */}
        {isOpen && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: 'var(--bg-input)' }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Л</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>Любовь</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>Администратор</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
