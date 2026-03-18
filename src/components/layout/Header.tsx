import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMonthContext } from '@/contexts/MonthContext';
import { ChevronDown, ChevronLeft, ChevronRight, Bell, Search, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { addMonths, subMonths } from 'date-fns';

export const Header: React.FC = () => {
  const { year, month, setMonth, monthLabel } = useMonthContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePrevMonth = () => {
    const d = subMonths(new Date(year, month - 1, 1), 1);
    setMonth(d.getFullYear(), d.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const d = addMonths(new Date(year, month - 1, 1), 1);
    setMonth(d.getFullYear(), d.getMonth() + 1);
  };

  return (
    <header className="h-20 bg-background/60 backdrop-blur-2xl border-b border-border sticky top-0 z-40 flex items-center justify-between px-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      {/* Search Bar - Decorative for now */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Busque por leads, telefones..." 
          className="w-full bg-elevated/30 border border-border rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all text-primary placeholder:text-muted shadow-inner"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6 ml-auto">
        
        {/* Date Selector Container */}
        <div className="flex items-center bg-elevated/40 border border-border rounded-xl p-1 shadow-inner">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-1 font-medium text-sm w-36 text-center select-none text-primary">
            {monthLabel}
          </div>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="success" className="animate-pulse-slow">
            <span className="w-1.5 h-1.5 rounded-full bg-success mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            Funil Saudável
          </Badge>

          <button className="relative p-2 text-secondary hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full outline outline-2 outline-background" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border/50 relative cursor-pointer group" ref={profileRef} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">{user?.name || 'Dr. Igor Alves'}</p>
              <p className="text-xs text-muted capitalize">{user?.role || 'Owner'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold">{user?.name ? user.name.substring(0,2).toUpperCase() : 'IA'}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />

            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-48 bg-white rounded-xl shadow-lg border border-border py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-border sm:hidden">
                  <div className="text-sm font-semibold text-primary">{user?.name}</div>
                  <div className="text-xs text-secondary capitalize">{user?.role}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do sistema
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
