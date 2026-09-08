import { useState, useEffect, ReactNode } from 'react';

interface AccordionProps {
  id: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function Accordion({ id, title, subtitle, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(`accordion_${id}`);
    return saved !== null ? saved === 'true' : defaultOpen;
  });

  useEffect(() => {
    localStorage.setItem(`accordion_${id}`, String(isOpen));
  }, [isOpen, id]);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && (
            <span className="text-xs text-slate-400 hidden sm:inline">{subtitle}</span>
          )}
        </div>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-slate-400 text-sm transition-transform`}></i>
      </button>
      {isOpen && (
        <div className="border-t border-slate-700/30 p-4">
          {children}
        </div>
      )}
    </div>
  );
}
