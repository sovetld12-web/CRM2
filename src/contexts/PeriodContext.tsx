import { createContext, useContext, useState, ReactNode } from 'react';

interface PeriodContextType {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  isInPeriod: (dateString: string) => boolean;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const isInPeriod = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  };

  return (
    <PeriodContext.Provider
      value={{
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        isInPeriod,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod must be used within PeriodProvider');
  }
  return context;
}
