import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/CardElement';
import { formatCurrency } from '@/lib/formatters';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Loader2, BarChart3 } from 'lucide-react';

interface MonthlyData {
  month: string;
  revenue24: number;
  revenue25: number;
}

export const AnnualDashboard: React.FC = () => {
  const [annualData, setAnnualData] = useState<MonthlyData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  useEffect(() => {
    fetchAnnualData();
  }, []);

  const fetchAnnualData = async () => {
    setIsLoading(true);
    const now = new Date();
    const currentYear = now.getFullYear();
    const prevYear = currentYear - 1;

    // Fetch all daily_entries for current and previous year
    const { data: entries } = await supabase
      .from('daily_entries')
      .select('date, revenue_projected, ad_investment_meta, ad_investment_google, access_social_selling')
      .gte('date', `${prevYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    const safeEntries = entries || [];

    // Group by year+month
    const monthMap: Record<string, { rev24: number; rev25: number; inv: number }> = {};
    for (let m = 0; m < 12; m++) {
      const key = monthLabels[m];
      monthMap[key] = { rev24: 0, rev25: 0, inv: 0 };
    }

    let totRev = 0;
    let totInv = 0;

    for (const entry of safeEntries) {
      const d = new Date(entry.date + 'T00:00:00');
      const yr = d.getFullYear();
      const m = d.getMonth();
      const key = monthLabels[m];
      const rev = Number(entry.revenue_projected) || 0;
      const inv = (Number(entry.ad_investment_meta) || 0) + (Number(entry.ad_investment_google) || 0) + (Number(entry.access_social_selling) || 0);

      if (yr === prevYear) {
        monthMap[key].rev24 += rev;
      } else if (yr === currentYear) {
        monthMap[key].rev25 += rev;
        totRev += rev;
        totInv += inv;
      }
    }

    const data: MonthlyData[] = monthLabels.map(label => ({
      month: label,
      revenue24: monthMap[label].rev24,
      revenue25: monthMap[label].rev25,
    }));

    setAnnualData(data);
    setTotalRevenue(totRev);
    setTotalInvestment(totInv);
    setIsLoading(false);
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const prevYear = currentYear - 1;
  const roasGlobal = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;
  const investPercent = totalRevenue > 0 ? (totalInvestment / totalRevenue) * 100 : 0;

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
        <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">Painel Anual</h1>
        <p className="text-secondary">Comparativo ano a ano e análise de sazonalidade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-surface to-[#1A1A24] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors" />
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Faturamento Anual ({currentYear})</h3>
          <p className="text-4xl font-mono font-bold text-accent tracking-tight">{formatCurrency(totalRevenue)}</p>
          {totalRevenue === 0 && (
            <div className="mt-4 text-sm text-muted">Insira lançamentos diários para ver dados aqui.</div>
          )}
        </Card>
        
        <Card className="p-6">
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Investimento Total</h3>
          <p className="text-4xl font-mono font-bold text-primary tracking-tight">{formatCurrency(totalInvestment)}</p>
          <div className="mt-4 text-sm text-secondary font-medium">{investPercent.toFixed(1)}% da receita total</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">ROAS Global (Ano)</h3>
          <p className="text-4xl font-mono font-bold text-primary tracking-tight">{roasGlobal.toFixed(1)}x</p>
          <div className="mt-4 text-sm text-muted font-medium">Retorno sobre investimento</div>
        </Card>
      </div>

      <Card className="hovererable">
        <CardContent className="p-6">
          <h3 className="text-lg font-heading font-bold text-primary mb-6">Comparativo Ano a Ano</h3>
          <div className="h-[400px] w-full">
            {annualData.some(d => d.revenue24 > 0 || d.revenue25 > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#6B6B80" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B6B80" tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(17,17,24,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(46,46,66,0.5)', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue24" name={`${prevYear}`} fill="rgba(153,153,170,0.3)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue25" name={`${currentYear}`} fill="#AAFF00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Nenhum dado anual encontrado.</p>
                <p className="text-xs mt-1">Os dados aparecerão conforme você fizer lançamentos diários.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default AnnualDashboard;
