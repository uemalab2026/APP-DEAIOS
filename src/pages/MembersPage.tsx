import React, { useState } from 'react';
import { Card } from '@/components/ui/CardElement';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { UserPlus, Mail, Shield, MoreVertical } from 'lucide-react';

const mockMembers = [
  { id: 1, name: 'Dr. Igor Alves', email: 'igoralves@dioestetica.com', role: 'owner', status: 'ativo' },
  { id: 2, name: 'Ana Comercial', email: 'ana@dioestetica.com', role: 'admin', status: 'ativo' },
  { id: 3, name: 'João SDR', email: 'joao.sdr@dioestetica.com', role: 'member', status: 'ativo' },
  { id: 4, name: 'Mariana Marketing', email: 'mariana@dioestetica.com', role: 'member', status: 'convite_pendente' },
];

export const Members: React.FC = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { success } = useToast();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteOpen(false);
    success('Convite Enviado', 'O usuário receberá um email com as instruções de acesso.');
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = { owner: 'Proprietário', admin: 'Administrador', member: 'Membro' };
    return roles[role];
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = { owner: 'anuncio', admin: 'info', member: 'default' };
    return <Badge variant={variants[role]}>{getRoleLabel(role)}</Badge>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary tracking-tight mb-2">Membros da Equipe</h1>
          <p className="text-secondary">Gerencie o acesso e permissões dos usuários na plataforma.</p>
        </div>
        <Button variant="primary" onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="w-5 h-5 mr-2" />
          Convidar Membro
        </Button>
      </div>

      <Card className="bg-surface/50 border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-elevated/30 border-b border-border">
              <tr>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Usuário</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Acesso</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-muted text-sm uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockMembers.map((member) => (
                <tr key={member.id} className="hover:bg-hover/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center font-bold text-primary">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-primary">{member.name}</div>
                        <div className="text-sm text-secondary font-mono">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getRoleBadge(member.role)}</td>
                  <td className="py-4 px-6">
                    {member.status === 'ativo' 
                      ? <Badge variant="success">Ativo</Badge> 
                      : <Badge variant="warning">Pendente</Badge>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-secondary hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        title="Convidar Novo Membro"
      >
        <form onSubmit={handleInvite} className="space-y-6">
          <p className="text-sm text-secondary">
            Convide colegas para acessar o DEAIOS. Eles precisarão criar uma senha no primeiro acesso.
          </p>

          <Input 
            label="Email do Convidado" 
            type="email" 
            required 
            icon={<Mail className="w-5 h-5" />}
            placeholder="email@clinica.com" 
          />

          <div className="space-y-3">
             <label className="text-sm font-medium text-secondary ml-1">Nível de Acesso</label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <label className="flex items-start gap-3 p-4 border border-accent/50 bg-accent/5 rounded-xl cursor-pointer">
                 <input type="radio" name="role" value="admin" className="mt-1" defaultChecked />
                 <div>
                   <p className="font-medium text-primary flex items-center gap-2">
                     <Shield className="w-4 h-4 text-accent" />
                     Administrador
                   </p>
                   <p className="text-xs text-secondary mt-1">Acesso completo a configurações, relatórios financeiros e gestão de membros.</p>
                 </div>
               </label>
               <label className="flex items-start gap-3 p-4 border border-border hover:border-border-bright rounded-xl cursor-pointer transition-colors bg-elevated/30">
                 <input type="radio" name="role" value="member" className="mt-1" />
                 <div>
                   <p className="font-medium text-primary flex items-center gap-2">
                     Membro Especialista
                   </p>
                   <p className="text-xs text-secondary mt-1">Pode lançar dados diários e visualizar leads, sem acesso a configs globais.</p>
                 </div>
               </label>
             </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Enviar Convite</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Members;
