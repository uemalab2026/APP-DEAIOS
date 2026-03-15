import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const SlideOver: React.FC<SlideOverProps> = ({ isOpen, onClose, title, children, width = 'md' }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsRendered(false), 400); // Wait for exit animation
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isRendered) return null;

  const widths = {
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    xl: 'max-w-xl w-full',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "relative h-full bg-surface/95 backdrop-blur-2xl border-l border-border shadow-soft flex flex-col transition-transform duration-400 ease-in-out",
          widths[width],
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <h2 className="text-xl font-heading font-bold text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 bg-elevated/50 text-secondary hover:text-primary hover:bg-hover rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
