import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/CardElement';
import { formatCurrency, formatPercent, formatRoas } from '@/lib/formatters';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Target, HandCoins, Activity, CalendarClock, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface DashboardData {
  revenue: number;
  goal: number;
  goal_average: number;
  goal_super: number;
  projection: number;
  ad_investment: number;
  social_investment: number;
  totalLeads: number;
  totalConversations: number;
  totalSchedules: number;
  totalAttendances: number;
  totalSales: number;
  roas: number;
  businessDays: number;
  totalBusinessDays: number;
}

interface DailyChartData {
  day: number;
  anuncio: number;
  social: number;
  recorrente: number;
  indicacao: number;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dailyChart, setDailyChart] = useState<DailyChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = new Date(year, month, 0);
    const endOfMonthStr = `${year}-${String(month).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
    const today = now.getDate();
    const totalDaysInMonth = endOfMonth.getDate();

    // Fetch daily entries for current month
    const { data: entries } = await supabase
      .from('daily_entries')
      .select('*')
      .gte('date', startOfMonth)
      .lte('date', endOfMonthStr)
      .order('date', { ascending: true });

    // Fetch settings (goals)
    const { data: settingsRows } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['metas', 'investimento']);

    const metas = settingsRows?.find(s => s.key === 'metas')?.value || { goal: 153000, goal_average: 175000, goal_super: 220000 };
    const investimento = settingsRows?.find(s => s.key === 'investimento')?.value || { meta_ads: 11000, social_selling: 1515 };

    const safeEntries = entries || [];

    // Calculate totals
    let totalRevenue = 0;
    let totalLeads = 0;
    let totalConversations = 0;
    let totalSchedules = 0;
    let totalAttendances = 0;
    let totalSales = 0;
    let totalAdInvestment = 0;
    let totalSocialInvestment = 0;

    // Group by day for chart
    const dayMap: Record<number, DailyChartData> = {};

    for (const entry of safeEntries) {
      const day = new Date(entry.date + 'T00:00:00').getDate();
      totalRevenue += Number(entry.revenue_projected) || 0;
      totalLeads += entry.leads || 0;
      totalConversations += entry.conversations || 0;
      totalSchedules += entry.schedules || 0;
      totalAttendances += entry.attendances || 0;
      totalSales += entry.sales || 0;
      totalAdInvestment += (Number(entry.ad_investment_meta) || 0) + (Number(entry.ad_investment_google) || 0);
      totalSocialInvestment += Number(entry.access_social_selling) || 0;

      if (!dayMap[day]) {
        dayMap[day] = { day, anuncio: 0, social: 0, recorrente: 0, indicacao: 0 };
      }

      const ch = entry.channel;
      const rev = Number(entry.revenue_projected) || 0;
      if (ch === 'anuncio') dayMap[day].anuncio += rev;
      else if (ch === 'social') dayMap[day].social += rev;
      else if (ch === 'recorrente') dayMap[day].recorrente += rev;
      else if (ch === 'indicacao') dayMap[day].indicacao += rev;
    }

    const chartData = Object.values(dayMap).sort((a, b) => a.day - b.day);

    const daysElapsed = Math.max(today, 1);
    const projection = daysElapsed > 0 ? (totalRevenue / daysElapsed) * totalDaysInMonth : 0;
    const totalInvestment = totalAdInvestment + totalSocialInvestment;
    const roas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;

    // Estimate business days (rough: ~22 per month)
    const totalBusinessDays = 22;
    const businessDaysElapsed = Math.round((today / totalDaysInMonth) * totalBusinessDays);

    setData({
      revenue: totalRevenue,
      goal: metas.goal || 153000,
      goal_average: metas.goal_average || 175000,
      goal_super: metas.goal_super || 220000,
      projection,
      ad_investment: totalAdInvestment || Number(investimento.meta_ads) || 0,
      social_investment: totalSocialInvestment || Number(investimento.social_selling) || 0,
      totalLeads,
      totalConversations,
      totalSchedules,
      totalAttendances,
      totalSales,
      roas,
      businessDays: businessDaysElapsed,
      totalBusinessDays,
    });

    setDailyChart(chartData);
    setIsLoading(false);
  };
  
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!data) return null;

  const previousRevenue = 0; // Will be calculated from previous month if data exists
  const revenueGrowth = previousRevenue > 0 ? ((data.revenue - previousRevenue) / previousRevenue * 100) : 0;

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
              {revenueGrowth !== 0 && (
                <span className="text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded flex items-center mb-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(0)}% v.m.
                </span>
              )}
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
          <KPICard title="Projeção Atual" value={formatCurrency(data.projection)} icon={<Activity className="w-5 h-5 text-social" />} trend={data.projection > data.goal ? 'Acima' : 'Abaixo'} />
          <KPICard title="ROAS Global" value={formatRoas(data.roas)} icon={<Target className="w-5 h-5 text-accent" />} trend={data.roas > 5 ? 'Bom' : 'Atenção'} />
          <KPICard title="Investimento (Ads)" value={formatCurrency(data.ad_investment)} icon={<HandCoins className="w-5 h-5 text-error" />} trend={formatCurrency(data.social_investment)} reverseTrend />
          <KPICard title="Dias Úteis" value={`${data.businessDays} / ${data.totalBusinessDays}`} icon={<CalendarClock className="w-5 h-5 text-recorrente" />} subtitle={`Faltam ${data.totalBusinessDays - data.businessDays} dias`} />
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
              {dailyChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Nenhum lançamento diário neste mês.</p>
                  <p className="text-xs mt-1">Use a página "Lançamento Diário" para inserir dados.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Funnel Overview */}
        <Card className="hovererable bg-surface/40">
          <CardContent className="p-6">
            <h3 className="text-lg font-heading font-bold text-primary mb-6">Funil de Vendas Global</h3>
            
            <div className="space-y-4">
              <FunnelStep label="Total Leads" value={data.totalLeads} percentage={100} color="bg-secondary" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Conversas Iniciadas" value={data.totalConversations} percentage={data.totalLeads > 0 ? (data.totalConversations/data.totalLeads)*100 : 0} color="bg-info" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Agendamentos" value={data.totalSchedules} percentage={data.totalConversations > 0 ? (data.totalSchedules/data.totalConversations)*100 : 0} color="bg-warning" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Comparecimentos" value={data.totalAttendances} percentage={data.totalSchedules > 0 ? (data.totalAttendances/data.totalSchedules)*100 : 0} color="bg-recorrente" />
              <div className="pl-4 border-l border-border/50 ml-4 h-4" />
              <FunnelStep label="Vendas Fechadas" value={data.totalSales} percentage={data.totalAttendances > 0 ? (data.totalSales/data.totalAttendances)*100 : 0} color="bg-success" />
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-sm">
              <span className="text-muted">Conversão Global</span>
              <span className="font-mono font-bold text-accent text-lg">
                {formatPercent(data.totalLeads > 0 ? (data.totalSales / data.totalLeads) * 100 : 0)}
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
