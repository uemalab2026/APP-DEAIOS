import React, { useState } from 'react';
import { Card } from '@/components/ui/CardElement';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { SlideOver } from '@/components/ui/SlideOver';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { getChannelLabel, getStatusLabel, getStatusColorVariant, formatCurrency } from '@/lib/formatters';
import type { Channel, LeadStatus } from '@/types/types';
import { Search, Filter, Plus, MessageCircle, Calendar, DollarSign, Clock, Loader2 } from 'lucide-react';

// Using the same Lead type shape that comes from Supabase
export interface SupabaseLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  current_stage: string;
  channel: string;
  sub_channel: string | null;
  campaign: string | null;
  source: string | null;
  created_at: string;
  value: number;
  service_interest: string | null;
  notes: string | null;
}

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const { success } = useToast();

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.phone?.includes(searchTerm)
  );

  React.useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
    setIsLoading(false);
  };

  const openLeadDetails = (lead: any) => {
    setSelectedLead(lead);
    setIsSlideOverOpen(true);
  };

  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newLeadData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      channel: formData.get('channel') as string,
      status: 'novo',
      current_stage: 'Captação',
      service_interest: (formData.get('service') as string) || null,
      value: Number(formData.get('value')) || 0,
      notes: (formData.get('notes') as string) || null,
    };

    setIsNewLeadModalOpen(false);

    const { data, error } = await supabase
      .from('leads')
      .insert([newLeadData])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data && data[0]) {
      setLeads([data[0], ...leads]);
      success('Lead Adicionado', `${newLeadData.name} foi adicionado(a) com sucesso ao banco de dados.`);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight">CRM de Leads</h1>
          <p className="text-secondary mt-1">Gerencie e acompanhe o status de todas as oportunidades.</p>
        </div>
        <Button variant="primary" onClick={() => setIsNewLeadModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Lead
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 bg-surface/50 border-border/50">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-elevated/30">
          <div className="w-full sm:w-96">
            <Input 
              placeholder="Buscar por nome ou telefone..." 
              icon={<Search className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Button variant="outline" className="shrink-0 bg-surface">
              <Filter className="w-4 h-4 mr-2" /> Canais
            </Button>
            <Button variant="outline" className="shrink-0 bg-surface">
              <Filter className="w-4 h-4 mr-2" /> Status
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-elevated/90 backdrop-blur-md z-10 border-b border-border shadow-sm">
              <tr>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Lead</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Canal</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider hidden md:table-cell">Interesse</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider text-right">Valor Extimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => openLeadDetails(lead)}
                  className="hover:bg-hover/50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-primary group-hover:text-accent transition-colors">{lead.name}</div>
                    <div className="text-sm text-secondary font-mono mt-0.5">{lead.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={lead.channel as any}>{getChannelLabel(lead.channel as Channel)}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={getStatusColorVariant(lead.status as LeadStatus)}>{getStatusLabel(lead.status as LeadStatus)}</Badge>
                  </td>
                  <td className="py-4 px-6 text-secondary hidden md:table-cell">
                    {lead.service_interest}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-medium text-primary">
                    {formatCurrency(lead.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading ? (
            <div className="p-12 text-center text-muted flex flex-col items-center">
              <Loader2 className="w-8 h-8 opacity-50 mb-4 animate-spin" />
              <p>Carregando leads da nuvem...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-muted flex flex-col items-center">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Nenhum lead encontrado com a busca "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      </Card>

      {/* SlideOver Detail Panel */}
      <SlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)}
        title="Detalhes do Lead"
        width="lg"
      >
        {selectedLead && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Info */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-1 font-heading">{selectedLead.name}</h2>
                <div className="flex items-center gap-3 text-secondary font-mono mt-2">
                  <Badge variant={selectedLead.channel as any}>{getChannelLabel(selectedLead.channel as Channel)}</Badge>
                  <span>•</span>
                  <span>{selectedLead.phone}</span>
                </div>
              </div>
              <Badge size="lg" variant={getStatusColorVariant(selectedLead.status as LeadStatus)}>
                {getStatusLabel(selectedLead.status as LeadStatus)}
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button variant="primary" className="flex-1 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar
              </Button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-elevated p-4 rounded-xl border border-border">
                <span className="text-xs text-muted uppercase tracking-wider mb-1 block">Interesse</span>
                <span className="font-medium text-primary">{selectedLead.service_interest}</span>
              </div>
              <div className="bg-elevated p-4 rounded-xl border border-border">
                <span className="text-xs text-muted uppercase tracking-wider mb-1 block">Valor Estimado</span>
                <span className="font-medium text-primary font-mono text-lg text-accent flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 opacity-50 text-accent" />
                  {formatCurrency(selectedLead.value).replace('R$', '').trim()}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Anotações</h3>
              <div className="bg-elevated/50 p-4 rounded-xl border border-border text-secondary text-sm leading-relaxed min-h-[100px]">
                {selectedLead.notes}
              </div>
            </div>

            {/* Timeline Mock */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Histórico</h3>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/20" />
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-primary text-sm">Status alterado para Agendado</p>
                  <p className="text-xs text-muted flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> Hoje às 14:32</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-elevated border border-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-secondary text-sm">Lead criado pelo canal Anúncio</p>
                  <p className="text-xs text-muted flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> Ontem às 09:15</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </SlideOver>

      {/* New Lead Modal */}
      <Modal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        title="Novo Lead"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 pt-4">
          <Input name="name" label="Nome do Lead" placeholder="Ex: Maria Silva" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="phone" label="WhatsApp" placeholder="(11) 99999-9999" required />
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary block">Canal Origem</label>
              <select name="channel" className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm" required>
                <option value="anuncio">Anúncio</option>
                <option value="social">Social Selling</option>
                <option value="recorrente">Recorrente</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="service" label="Serviço de Interesse" placeholder="Ex: Depilação a Laser" required />
            <Input name="value" type="number" label="Valor Estimado (R$)" placeholder="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-primary block">Anotações (Opcional)</label>
            <textarea name="notes" rows={3} className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm resize-none" placeholder="Detalhes adicionais sobre o lead..."></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6 relative z-50">
            <Button type="button" variant="ghost" onClick={() => setIsNewLeadModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Adicionar Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
