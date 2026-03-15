import React from 'react';
import { Card, CardContent } from '@/components/ui/CardElement';
import { formatCurrency } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const annualData = [
  { month: 'Jan', revenue24: 120000, revenue25: 145000 },
  { month: 'Fev', revenue24: 110000, revenue25: 135000 },
  { month: 'Mar', revenue24: 130000, revenue25: 165000 },
  { month: 'Abr', revenue24: 140000, revenue25: 180000 },
  { month: 'Mai', revenue24: 135000, revenue25: 190000 },
  { month: 'Jun', revenue24: 125000, revenue25: 160000 },
  { month: 'Jul', revenue24: 145000, revenue25: 210000 },
  { month: 'Ago', revenue24: 160000, revenue25: 230000 },
  { month: 'Set', revenue24: 155000, revenue25: 225000 },
  { month: 'Out', revenue24: 170000, revenue25: 0 },
  { month: 'Nov', revenue24: 190000, revenue25: 0 },
  { month: 'Dez', revenue24: 210000, revenue25: 0 },
];

export const AnnualDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">Painel Anual</h1>
        <p className="text-secondary">Comparativo ano a ano e análise de sazonalidade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-surface to-[#1A1A24] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors" />
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Faturamento Anual (2025)</h3>
          <p className="text-4xl font-mono font-bold text-accent tracking-tight">{formatCurrency(1640000)}</p>
          <div className="mt-4 text-sm text-success font-medium">+24.5% vs 2024</div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">Investimento Total</h3>
          <p className="text-4xl font-mono font-bold text-primary tracking-tight">{formatCurrency(185000)}</p>
          <div className="mt-4 text-sm text-secondary font-medium">11.2% da receita total</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">ROAS Global (Ano)</h3>
          <p className="text-4xl font-mono font-bold text-primary tracking-tight">8.8x</p>
          <div className="mt-4 text-sm text-success font-medium">+1.5x vs 2024</div>
        </Card>
      </div>

      <Card className="hovererable">
        <CardContent className="p-6">
          <h3 className="text-lg font-heading font-bold text-primary mb-6">Comparativo Ano a Ano</h3>
          <div className="h-[400px] w-full">
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
                <Bar dataKey="revenue24" name="2024" fill="rgba(153,153,170,0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue25" name="2025" fill="#AAFF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default AnnualDashboard;
