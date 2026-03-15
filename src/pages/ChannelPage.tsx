import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/CardElement';
import { getChannelLabel, getChannelColor, formatCurrency } from '@/lib/formatters';
import type { Channel } from '@/types/types';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

export const ChannelView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Quick map to channel ID if it came from URL
  const channelId = id === 'social' ? 'social_selling' : id as Channel;
  const color = getChannelColor(channelId);

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
              <span className="text-xs font-semibold px-2 py-1 rounded bg-success/10 text-success">+12%</span>
            </div>
            <h3 className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Receita Gerada</h3>
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(45000)}</p>
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
            <p className="text-2xl font-mono font-bold text-primary">342</p>
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
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(12.50)}</p>
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
            <p className="text-2xl font-mono font-bold text-primary">{formatCurrency(125.00)}</p>
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
              {Array.from({length: 10}).map((_, i) => (
                <tr key={i} className="hover:bg-hover/50 transition-colors">
                  <td className="py-3 px-6 text-sm text-secondary">Out {10 - i}, 2025</td>
                  <td className="py-3 px-6 text-sm font-mono text-primary">{formatCurrency(Math.random() * 500 + 100)}</td>
                  <td className="py-3 px-6 text-sm text-primary">{Math.floor(Math.random() * 20 + 5)}</td>
                  <td className="py-3 px-6 text-sm text-primary">{Math.floor(Math.random() * 5 + 1)}</td>
                  <td className="py-3 px-6 text-sm text-right font-mono font-medium text-accent">{formatCurrency(Math.random() * 5000 + 1000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
};

export default ChannelView;
