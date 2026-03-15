import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/CardElement';
import { getChannelLabel, getChannelColor, formatCurrency } from '@/lib/formatters';
import { supabase } from '@/lib/supabase';
import type { Channel } from '@/types/types';
import { TrendingUp, Users, Target, DollarSign, Loader2 } from 'lucide-react';

interface ChannelMetrics {
  revenue: number;
  leadsCaptured: number;
  cpl: number;
  cpa: number;
  revenueGrowth: number;
}

interface DailyRow {
  date: string;
  investment: number;
  leads: number;
  sales: number;
  revenue: number;
}

export const ChannelView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const channelId = id === 'social' ? 'social_selling' : id as Channel;
  const channelFilter = id === 'social_selling' ? 'social' : id;
  const color = getChannelColor(channelId);

  const [metrics, setMetrics] = useState<ChannelMetrics>({ revenue: 0, leadsCaptured: 0, cpl: 0, cpa: 0, revenueGrowth: 0 });
  const [dailyRows, setDailyRows] = useState<DailyRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChannelData();
  }, [id]);

  const fetchChannelData = async () => {
    setIsLoading(true);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = new Date(year, month, 0);
    const endOfMonthStr = `${year}-${String(month).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('channel', channelFilter)
      .gte('date', startOfMonth)
      .lte('date', endOfMonthStr)
      .order('date', { ascending: false });

    const safeEntries = entries || [];

    let totalRevenue = 0;
    let totalLeads = 0;
    let totalSales = 0;
    let totalInvestment = 0;
    const rows: DailyRow[] = [];

    for (const entry of safeEntries) {
      const rev = Number(entry.revenue_projected) || 0;
      const leads = entry.leads || 0;
      const sales = entry.sales || 0;
      const inv = (Number(entry.ad_investment_meta) || 0) + (Number(entry.ad_investment_google) || 0) + (Number(entry.access_social_selling) || 0);

      totalRevenue += rev;
      totalLeads += leads;
      totalSales += sales;
      totalInvestment += inv;

      rows.push({
        date: entry.date,
        investment: inv,
        leads,
        sales,
        revenue: rev,
      });
    }

    setMetrics({
      revenue: totalRevenue,
      leadsCaptured: totalLeads,
      cpl: totalLeads > 0 ? totalInvestment / totalLeads : 0,
      cpa: totalSales > 0 ? totalInvestment / totalSales : 0,
      revenueGrowth: 0, // Would compare with previous month
    });

    setDailyRows(rows);
    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">
          Canal: <span className={color}>{getChannelLabel(channelId)}</span>
        </h1>
        <p className="text-secondary">Métricas detalhadas e performance do canal no mês.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hovererable">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 bg-elevated rounded-xl border border-border/50`}>
                <DollarSign className={`w-5 h-5 ${color}`} />
              </div>
              {metrics.revenueGrowth !== 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-success/10 text-success">+{metrics.revenueGrowth}%</span>
              )}
            </div>
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Receita Gerada</h3>
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(metrics.revenue)}</p>
          </CardContent>
        </Card>

        <Card className="hovererable">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-elevated rounded-xl border border-border/50">
                <Users className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Leads Captados</h3>
            <p className="text-2xl font-mono font-bold text-primary">{metrics.leadsCaptured}</p>
          </CardContent>
        </Card>

        <Card className="hovererable">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-elevated rounded-xl border border-border/50">
                <Target className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Custo por Lead (CPL)</h3>
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(metrics.cpl)}</p>
          </CardContent>
        </Card>

        <Card className="hovererable">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-elevated rounded-xl border border-border/50">
                <TrendingUp className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Custo por Aquisição (CPA)</h3>
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(metrics.cpa)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/50 border-border/50">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-heading font-bold text-primary">Histórico Diário</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-elevated/30">
              <tr>
                <th className="py-3 px-6 font-semibold text-muted text-xs uppercase tracking-wider">Data</th>
                <th className="py-3 px-6 font-semibold text-muted text-xs uppercase tracking-wider">Investimento</th>
                <th className="py-3 px-6 font-semibold text-muted text-xs uppercase tracking-wider">Leads</th>
                <th className="py-3 px-6 font-semibold text-muted text-xs uppercase tracking-wider">Vendas</th>
                <th className="py-3 px-6 font-semibold text-muted text-xs uppercase tracking-wider text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {dailyRows.length > 0 ? (
                dailyRows.map((row, i) => (
                  <tr key={i} className="hover:bg-hover/50 transition-colors">
                    <td className="py-3 px-6 text-sm text-secondary">{formatDate(row.date)}</td>
                    <td className="py-3 px-6 text-sm font-mono text-primary">{formatCurrency(row.investment)}</td>
                    <td className="py-3 px-6 text-sm text-primary">{row.leads}</td>
                    <td className="py-3 px-6 text-sm text-primary">{row.sales}</td>
                    <td className="py-3 px-6 text-sm text-right font-mono font-medium text-accent">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted text-sm">
                    Nenhum lançamento diário encontrado para este canal neste mês.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
};

export default ChannelView;
