import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardElement';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { Megaphone, MessageSquare, Repeat, Share2, Save } from 'lucide-react';
import { formatCurrency, getChannelColor, getChannelBgColor } from '@/lib/formatters';

const channels = [
  { id: 'anuncio', label: 'Anúncio', icon: Megaphone },
  { id: 'social', label: 'Social Selling', icon: MessageSquare },
  { id: 'recorrente', label: 'Recorrentes', icon: Repeat },
  { id: 'indicacao', label: 'Indicação', icon: Share2 },
] as const;

interface ChannelSummary {
  avgDailyRevenue: number;
  cpl: number;
  cpa: number;
  goalPercent: number;
}

export const DailyEntry: React.FC = () => {
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<typeof channels[number]['id']>('anuncio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<ChannelSummary>({ avgDailyRevenue: 0, cpl: 0, cpa: 0, goalPercent: 0 });

  useEffect(() => {
    fetchChannelSummary(activeTab);
  }, [activeTab]);

  const fetchChannelSummary = async (channel: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = new Date(year, month, 0);
    const endOfMonthStr = `${year}-${String(month).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('channel', channel)
      .gte('date', startOfMonth)
      .lte('date', endOfMonthStr);

    // Fetch goals
    const { data: settingsRows } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'metas')
      .single();

    const metas = settingsRows?.value || { goal: 153000 };
    const channelGoal = (metas.goal || 153000) / 4; // Divide equally among 4 channels

    const safeEntries = entries || [];
    const daysWithData = safeEntries.length || 1;

    let totalRevenue = 0;
    let totalLeads = 0;
    let totalSales = 0;
    let totalInvestment = 0;

    for (const entry of safeEntries) {
      totalRevenue += Number(entry.revenue_projected) || 0;
      totalLeads += entry.leads || 0;
      totalSales += entry.sales || 0;
      totalInvestment += (Number(entry.ad_investment_meta) || 0) + (Number(entry.ad_investment_google) || 0) + (Number(entry.access_social_selling) || 0);
    }

    setSummary({
      avgDailyRevenue: totalRevenue / daysWithData,
      cpl: totalLeads > 0 ? totalInvestment / totalLeads : 0,
      cpa: totalSales > 0 ? totalInvestment / totalSales : 0,
      goalPercent: channelGoal > 0 ? Math.min(100, (totalRevenue / channelGoal) * 100) : 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const entryData = {
      date: formData.get('date'),
      channel: activeTab,
      revenue_projected: Number(formData.get('revenue')) || 0,
      leads: Number(formData.get('leads')) || 0,
      conversations: Number(formData.get('conversations')) || 0,
      schedules: Number(formData.get('schedules')) || 0,
      attendances: Number(formData.get('attendances')) || 0,
      sales: Number(formData.get('sales')) || 0,
      ad_investment_meta: Number(formData.get('meta_ads')) || 0,
      ad_investment_google: Number(formData.get('google_ads')) || 0,
      access_social_selling: Number(formData.get('social_selling_access')) || 0,
      posts_count: Number(formData.get('posts_count')) || 0,
    };

    const { error } = await supabase.from('daily_entries').insert([entryData]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      showError('Erro ao salvar', 'Não foi possível salvar no banco de dados. Verifique se a tabela daily_entries existe no Supabase.');
    } else {
      success('Lançamento salvo com sucesso!', 'Os dados foram inseridos na nuvem.');
      e.currentTarget.reset();
      fetchChannelSummary(activeTab);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">Lançamento Diário</h1>
          <p className="text-secondary max-w-xl">Insira os resultados diários consolidados por canal. Estes dados alimentam o Painel Comercial.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-elevated/50 backdrop-blur border border-border/50 rounded-2xl w-fit">
        {channels.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300
              ${activeTab === id 
                ? 'bg-white shadow-soft border-border text-primary' 
                : 'text-secondary hover:text-primary hover:bg-hover border-transparent'}
              border
            `}
          >
            <Icon className={`w-4 h-4 ${activeTab === id ? getChannelColor(id as any) : ''}`} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form Container */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-2 h-6 rounded-sm ${getChannelBgColor(activeTab as any)}`} />
              Lançamento: {channels.find(c => c.id === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input name="date" label="Data" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                <Input name="revenue" label="Faturamento Previsto (R$)" type="number" placeholder="0.00" step="0.01" required />
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
                <Input name="leads" label="Leads" type="number" placeholder="0" min="0" required />
                <Input name="conversations" label="Conversas" type="number" placeholder="0" min="0" />
                <Input name="schedules" label="Agendamentos" type="number" placeholder="0" min="0" required />
              </div>

              <div className="grid grid-cols-2 gap-6 pb-2">
                <Input name="attendances" label="Comparecimentos" type="number" placeholder="0" min="0" required />
                <Input name="sales" label="Vendas" type="number" placeholder="0" min="0" required />
              </div>

              {activeTab === 'anuncio' && (
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                  <Input name="meta_ads" label="Investimento Meta Ads (R$)" type="number" placeholder="0.00" step="0.01" />
                  <Input name="google_ads" label="Investimento Google Ads (R$)" type="number" placeholder="0.00" step="0.01" />
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                  <Input name="social_selling_access" label="Acesso Social Selling (R$)" type="number" placeholder="0.00" step="0.01" />
                  <Input name="posts_count" label="Número de Posts" type="number" placeholder="0" min="0" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-border">
                <Button type="button" variant="ghost">Limpar</Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Lançamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar Mini-Dash - Connected to Supabase */}
        <Card className="bg-gradient-to-br from-surface to-background flex justify-center">
          <CardHeader>
            <CardTitle>Resumo Mensal do Canal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-secondary text-sm mb-1">Média Diária de Receita</p>
              <p className="text-2xl font-mono font-bold text-accent">{formatCurrency(summary.avgDailyRevenue)}</p>
            </div>
            
            <div>
              <p className="text-secondary text-sm mb-1">Custo por Lead Atual (CPL)</p>
              <p className="text-xl font-mono font-medium text-primary">{formatCurrency(summary.cpl)}</p>
            </div>

            <div>
              <p className="text-secondary text-sm mb-1">Custo por Aquisição (CPA)</p>
              <p className="text-xl font-mono font-medium text-primary">{formatCurrency(summary.cpa)}</p>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Meta do Canal</span>
                <span className="text-sm text-muted">{summary.goalPercent.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getChannelBgColor(activeTab as any)}`}
                  style={{ width: `${summary.goalPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DailyEntry;
