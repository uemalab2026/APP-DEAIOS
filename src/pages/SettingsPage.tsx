import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardElement';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Building2, Target, DollarSign, UserCog, Save } from 'lucide-react';

const tabs = [
  { id: 'clinica', label: 'Clínica', icon: Building2 },
  { id: 'metas', label: 'Metas Mensais', icon: Target },
  { id: 'investimento', label: 'Investimentos', icon: DollarSign },
  { id: 'conta', label: 'Minha Conta', icon: UserCog },
] as const;

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('metas');
  const { success } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Configurações salvas', 'As alterações foram aplicadas com sucesso.');
  };

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
                      <Input label="Meta Mínima Requerida (R$)" type="number" defaultValue="153000" />
                      <Input label="Meta Média Esperada (R$)" type="number" defaultValue="175000" />
                      <Input label="Super Meta (R$)" type="number" defaultValue="220000" />
                    </div>
                  </div>
                )}

                {activeTab === 'investimento' && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="text-secondary text-sm">Orçamentos previstos para o mês. Usado para calcular o ROAS parcial.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Orçamento Meta Ads (R$)" type="number" defaultValue="11000" />
                      <Input label="Orçamento Social Selling (R$)" type="number" defaultValue="1515" />
                      <Input label="Investimento Extra Previsto (R$)" type="number" defaultValue="0" />
                    </div>
                  </div>
                )}

                {activeTab === 'clinica' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Nome da Clínica" defaultValue="DIoEstética" />
                      <Input label="CNPJ" defaultValue="00.000.000/0000-00" />
                      <Input label="Telefone Fixo" defaultValue="(11) 3232-1234" />
                      <Input label="Endereço" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                    </div>
                  </div>
                )}

                {activeTab === 'conta' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Nome Completo" defaultValue="Dr. Igor Alves" />
                      <Input label="Email" type="email" defaultValue="igoralves@dioestetica.com" />
                      <div className="md:col-span-2 pt-4">
                        <Button type="button" variant="outline" className="w-full md:w-auto">Redefinir Senha</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-border flex justify-end">
                  <Button type="submit" variant="primary">
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
