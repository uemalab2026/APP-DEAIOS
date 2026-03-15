import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Megaphone, 
  MessageSquare, 
  Repeat, 
  Share2,
  CalendarDays,
  PenSquare,
  UserPlus
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Painel Comercial', to: '/' },
  { icon: PenSquare, label: 'Lançamento Diário', to: '/daily-entry' },
  { icon: Users, label: 'CRM / Leads', to: '/leads' },
];

const channelItems = [
  { icon: Megaphone, label: 'Anúncio', to: '/canais/anuncio', color: 'text-anuncio' },
  { icon: MessageSquare, label: 'Social Selling', to: '/canais/social', color: 'text-social' },
  { icon: Repeat, label: 'Recorrentes', to: '/canais/recorrente', color: 'text-recorrente' },
  { icon: Share2, label: 'Indicação', to: '/canais/indicacao', color: 'text-indicacao' },
];

const bottomItems = [
  { icon: CalendarDays, label: 'Painel Anual', to: '/anual' },
  { icon: UserPlus, label: 'Equipe', to: '/members' },
  { icon: Settings, label: 'Configurações', to: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const NavLinkItem = ({ item, isChannel = false }: { item: any; isChannel?: boolean }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

    return (
      <NavLink
        to={item.to}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group relative overflow-hidden",
          isActive 
            ? "bg-accent/10 text-accent font-medium" 
            : "text-secondary hover:text-primary hover:bg-hover"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-glow" />
        )}
        <Icon className={cn("w-5 h-5", isChannel && !isActive && item.color, isActive && "text-accent")} />
        <span className="text-sm">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col pt-6 pb-4">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow">
          <span className="text-black font-heading font-bold text-lg">D</span>
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-primary">DEAIOS</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-8">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLinkItem key={item.to} item={item} />
          ))}
        </div>

        <div>
           <h4 className="px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-2">Canais</h4>
          <div className="space-y-1">
            {channelItems.map((item) => (
              <NavLinkItem key={item.to} item={item} isChannel />
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 pt-4 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => (
          <NavLinkItem key={item.to} item={item} />
        ))}
      </div>
    </aside>
  );
};
