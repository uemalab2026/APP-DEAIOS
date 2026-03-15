import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthContextType {
  year: number;
  month: number;
  setMonth: (year: number, month: number) => void;
  monthLabel: string;
  isCurrentMonth: boolean;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const MonthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  const [year, setYear] = useState(() => {
    const saved = localStorage.getItem('deaios_selected_year');
    return saved ? parseInt(saved, 10) : currentYear;
  });

  const [month, setMonthState] = useState(() => {
    const saved = localStorage.getItem('deaios_selected_month');
    return saved ? parseInt(saved, 10) : currentMonth;
  });

  useEffect(() => {
    localStorage.setItem('deaios_selected_year', year.toString());
    localStorage.setItem('deaios_selected_month', month.toString());
  }, [year, month]);

  const setMonth = (y: number, m: number) => {
    setYear(y);
    setMonthState(m);
  };

  const isCurrentMonth = year === currentYear && month === currentMonth;

  const date = new Date(year, month - 1, 1);
  const monthLabel = format(date, 'MMM yyyy', { locale: ptBR }).toUpperCase();

  return (
    <MonthContext.Provider value={{ year, month, setMonth, monthLabel, isCurrentMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonthContext = () => {
  const context = useContext(MonthContext);
  if (!context) throw new Error('useMonthContext must be used within MonthProvider');
  return context;
};
