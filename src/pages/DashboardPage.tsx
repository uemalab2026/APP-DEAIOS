import React from 'react';
import { Card, CardContent } from '@/components/ui/CardElement';
import { mockDashboardData, mockDailyData } from '@/lib/mockData';
import { formatCurrency, formatPercent, formatRoas } from '@/lib/formatters';
import { TrendingUp, Target, HandCoins, Activity, CalendarClock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { cn } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const data = mockDashboardData.currentMonth;
  
  // Custom Recharts tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevated/90 backdrop-blur-xl border border-border p-3 rounded-xl shadow-glass text-sm">
          <p className="font-bold text-primary mb-2">Dia {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span className="capitalize">{entry.name}:</span>
              <span className="font-mono font-medium">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & KPI row */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Welcome / Main Faturamento Card */}
        <Card className="lg:col-span-1 lg:w-1/3 p-6 flex flex-col justify-center bg-gradient-to-br from-surface to-[#1A1A24] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent/10 transition-colors duration-700" />
          
          <div className="relative z-10">
            <h2 className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Faturamento Total</h2>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-mono font-bold text-primary tracking-tight">
                {formatCurrency(data.revenue)}
              </span>
              <span className="text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded flex items-center mb-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +16% v.m.
              </span>
            </div>
            
            {/* Minimalist Goal Gauge / Bar */}
            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
                  <span>Meta Mínima</span>
                  <span className="text-primary font-mono">{formatCurrency(data.goal)}</span>
                </div>
                <div className="h-2 w-full bg-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent shadow-[0_0_10px_rgba(170,255,0,0.5)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (data.revenue / data.goal) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
                  <span>Super Meta</span>
                  <span className="text-primary font-mono">{formatCurrency(data.goal_super)}</span>
                </div>
                <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (data.revenue / data.goal_super) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mini KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <KPICard title="Projeção Atual" value={formatCurrency(data.projection)} icon={<Activity className="w-5 h-5 text-social" />} trend="+2.4%" />
          <KPICard title="ROAS Global" value={formatRoas(13.1)} icon={<Target className="w-5 h-5 text-accent" />} trend="+1.2x" />
          <KPICard title="Investimento (Ads)" value={formatCurrency(data.ad_investment)} icon={<HandCoins className="w-5 h-5 text-error" />} trend="R$ 9.5k" reverseTrend />
          <KPICard title="Dias Úteis" value="18 / 22" icon={<CalendarClock className="w-5 h-5 text-recorrente" />} subtitle="Faltam 4 dias" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <Card className="xl:col-span-2 hovererable">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-primary">Receita por Canal Diária</h3>
                <p className="text-sm text-muted">Acompanhamento consolidado do mês atual</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6B6B80" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Dia ${val}`}
                  />
                  <YAxis 
                    stroke="#6B6B80" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="anuncio" name="Anúncio" stackId="a" fill="#AAFF00" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="social" name="Social Selling" stackId="a" fill="#60A5FA" />
                  <Bar dataKey="recorrente" name="Recorrentes" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="indicacao" name="Indicação" stackId="a" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Overview */}
        <Card className="hovererable bg-surface/40">
          <CardContent className="p-6">
            <h3 className="text-lg font-heading font-bold text-primary mb-6">Funil de Vendas Global</h3>
            
            <div className="space-y-4">
              <FunnelStep label="Total Leads" value={data.funnel.leads} percentage={100} color="bg-secondary" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Conversas Iniciadas" value={data.funnel.initiated} percentage={(data.funnel.initiated/data.funnel.leads)*100} color="bg-info" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Agendamentos" value={data.funnel.scheduled} percentage={(data.funnel.scheduled/data.funnel.initiated)*100} color="bg-warning" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Comparecimentos" value={data.funnel.attended} percentage={(data.funnel.attended/data.funnel.scheduled)*100} color="bg-recorrente" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Vendas Fechadas" value={data.funnel.sales} percentage={(data.funnel.sales/data.funnel.attended)*100} color="bg-success" />
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-sm">
              <span className="text-muted">Conversão Global</span>
              <span className="font-mono font-bold text-accent text-lg">
                {formatPercent((data.funnel.sales / data.funnel.leads) * 100)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};

// Sub-components
const KPICard = ({ title, value, icon, trend, reverseTrend, subtitle }: any) => (
  <Card className="p-5 flex flex-col justify-between hovererable">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-elevated rounded-xl border border-border/50 shadow-sm">
        {icon}
      </div>
      {(trend || subtitle) && (
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded bg-elevated/50",
          trend && !reverseTrend ? "text-success" : trend ? "text-error" : "text-muted"
        )}>
          {trend || subtitle}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-mono font-bold text-primary tracking-tight">{value}</p>
    </div>
  </Card>
);

const FunnelStep = ({ label, value, percentage, color }: any) => (
  <div className="flex items-center group cursor-pointer">
    <div className={cn("w-full h-12 bg-elevated rounded-xl border border-border flex items-center px-4 relative overflow-hidden transition-colors group-hover:border-border-bright/30")}>
      <div 
        className={cn("absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-700", color)}
        style={{ width: `${percentage}%` }}
      />
      <div className="flex justify-between items-center w-full relative z-10">
        <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-mono">{formatPercent(percentage)}</span>
          <span className="text-sm font-bold font-mono bg-elevated/80 px-2 py-0.5 rounded border border-border/50 min-w-10 text-center">{value}</span>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
