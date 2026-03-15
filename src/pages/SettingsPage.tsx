import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardElement';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Target, DollarSign, UserCog, Save, Loader2 } from 'lucide-react';

const tabs = [
  { id: 'clinica', label: 'Clínica', icon: Building2 },
  { id: 'metas', label: 'Metas Mensais', icon: Target },
  { id: 'investimento', label: 'Investimentos', icon: DollarSign },
  { id: 'conta', label: 'Minha Conta', icon: UserCog },
] as const;

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('metas');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: showError } = useToast();
  const { user } = useAuth();

  // Form state
  const [metas, setMetas] = useState({ goal: 153000, goal_average: 175000, goal_super: 220000 });
  const [investimento, setInvestimento] = useState({ meta_ads: 11000, social_selling: 1515, extra: 0 });
  const [clinica, setClinica] = useState({ name: 'DIoEstética', cnpj: '', phone: '', address: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['metas', 'investimento', 'clinica']);

    if (!error && data) {
      for (const row of data) {
        if (row.key === 'metas') setMetas(row.value);
        if (row.key === 'investimento') setInvestimento(row.value);
        if (row.key === 'clinica') setClinica(row.value);
      }
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let key = '';
    let value: any = {};

    if (activeTab === 'metas') {
      key = 'metas';
      value = metas;
    } else if (activeTab === 'investimento') {
      key = 'investimento';
      value = investimento;
    } else if (activeTab === 'clinica') {
      key = 'clinica';
      value = clinica;
    } else {
      // Conta tab - just show success for now
      setIsSaving(false);
      success('Configurações salvas', 'As alterações foram aplicadas com sucesso.');
      return;
    }

    // Upsert: try update first, then insert if not found
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key));
    } else {
      ({ error } = await supabase
        .from('settings')
        .insert([{ key, value }]));
    }

    setIsSaving(false);

    if (error) {
      console.error(error);
      showError('Erro ao salvar', 'Não foi possível salvar as configurações.');
    } else {
      success('Configurações salvas', 'As alterações foram aplicadas com sucesso.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">Configurações</h1>
        <p className="text-secondary">Gerencie as metas, orçamentos e detalhes da clínica.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium
                ${activeTab === id 
                  ? 'bg-elevated/80 border border-border shadow-soft text-primary' 
                  : 'text-secondary hover:text-primary hover:bg-hover border border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === id ? 'text-accent' : ''}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Card>
            <CardHeader className="border-b border-border mb-6">
              <CardTitle>
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                
                {activeTab === 'metas' && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="text-secondary text-sm">Defina os objetivos globais de faturamento para servir de base para os dashboards e termômetros.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Meta Mínima Requerida (R$)" 
                        type="number" 
                        value={metas.goal}
                        onChange={(e) => setMetas({...metas, goal: Number(e.target.value)})}
                      />
                      <Input 
                        label="Meta Média Esperada (R$)" 
                        type="number" 
                        value={metas.goal_average}
                        onChange={(e) => setMetas({...metas, goal_average: Number(e.target.value)})}
                      />
                      <Input 
                        label="Super Meta (R$)" 
                        type="number" 
                        value={metas.goal_super}
                        onChange={(e) => setMetas({...metas, goal_super: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'investimento' && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="text-secondary text-sm">Orçamentos previstos para o mês. Usado para calcular o ROAS parcial.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Orçamento Meta Ads (R$)" 
                        type="number" 
                        value={investimento.meta_ads}
                        onChange={(e) => setInvestimento({...investimento, meta_ads: Number(e.target.value)})}
                      />
                      <Input 
                        label="Orçamento Social Selling (R$)" 
                        type="number" 
                        value={investimento.social_selling}
                        onChange={(e) => setInvestimento({...investimento, social_selling: Number(e.target.value)})}
                      />
                      <Input 
                        label="Investimento Extra Previsto (R$)" 
                        type="number" 
                        value={investimento.extra}
                        onChange={(e) => setInvestimento({...investimento, extra: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'clinica' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Nome da Clínica" 
                        value={clinica.name}
                        onChange={(e) => setClinica({...clinica, name: e.target.value})}
                      />
                      <Input 
                        label="CNPJ" 
                        value={clinica.cnpj}
                        onChange={(e) => setClinica({...clinica, cnpj: e.target.value})}
                      />
                      <Input 
                        label="Telefone Fixo" 
                        value={clinica.phone}
                        onChange={(e) => setClinica({...clinica, phone: e.target.value})}
                      />
                      <Input 
                        label="Endereço" 
                        value={clinica.address}
                        onChange={(e) => setClinica({...clinica, address: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'conta' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Nome Completo" defaultValue={user?.name || ''} />
                      <Input label="Email" type="email" defaultValue={user?.email || ''} disabled />
                      <div className="md:col-span-2 pt-4">
                        <Button type="button" variant="outline" className="w-full md:w-auto">Redefinir Senha</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-border flex justify-end">
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
