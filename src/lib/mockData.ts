import type { Channel, LeadStatus } from '@/types/types';

// Real data from spreadseet (Nov/Dec 2025 structure)
export const mockDashboardData = {
  currentMonth: {
    revenue: 145000,
    goal: 153000,
    goal_average: 175000,
    goal_super: 220000,
    projection: 145500,
    ad_investment: 11000,
    social_investment: 1515,
    channels: {
      anuncio: { revenue: 85000, percentage: 58.6, ad_spend: 9500 },
      social_selling: { revenue: 35000, percentage: 24.1, repasse: 1515 },
      recorrente: { revenue: 15000, percentage: 10.3 },
      indicacao: { revenue: 10000, percentage: 6.9 }
    },
    funnel: {
      leads: 642,
      initiated: 480,
      scheduled: 125,
      attended: 85,
      sales: 62
    }
  },
  previousMonth: {
    revenue: 125000,
    roas: 10.5
  }
};

export const mockDailyData = [
  { day: 1, anuncio: 2500, social: 1200, recorrente: 0, indicacao: 500 },
  { day: 2, anuncio: 3200, social: 800, recorrente: 1500, indicacao: 0 },
  { day: 3, anuncio: 1500, social: 2200, recorrente: 0, indicacao: 1500 },
  { day: 4, anuncio: 4500, social: 1500, recorrente: 3500, indicacao: 0 },
  { day: 5, anuncio: 2800, social: 1100, recorrente: 0, indicacao: 800 },
  { day: 6, anuncio: 5100, social: 3400, recorrente: 1200, indicacao: 2000 },
  { day: 7, anuncio: 1200, social: 500, recorrente: 0, indicacao: 0 },
  { day: 8, anuncio: 3600, social: 1800, recorrente: 2500, indicacao: 1200 },
  { day: 9, anuncio: 4200, social: 2100, recorrente: 0, indicacao: 500 },
  { day: 10, anuncio: 2900, social: 1600, recorrente: 1800, indicacao: 0 },
];

export const generateMockLeads = (count: number) => {
  const channels: Channel[] = ['anuncio', 'social_selling', 'recorrente', 'indicacao'];
  const statuses: LeadStatus[] = ['novo', 'conversa_iniciada', 'agendado', 'vendido', 'sem_interesse', 'nao_respondeu'];
  const names = ['Ana Silva', 'Carolina Santos', 'Beatriz Costa', 'Mariana Oliveira', 'Juliana Lima', 'Fernanda Souza'];
  const services = ['Botox', 'Preenchimento Labial', 'Fios de PDO', 'Bioestimulador', 'Peeling', 'Laser Lavieen'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `lead-${i}`,
    name: names[Math.floor(Math.random() * names.length)] + ` ${Math.floor(Math.random() * 100)}`,
    phone: `+55 11 9${Math.floor(80000000 + Math.random() * 19999999)}`,
    channel: channels[Math.floor(Math.random() * channels.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    service_interest: services[Math.floor(Math.random() * services.length)],
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    value: Math.floor(Math.random() * 5000) + 500,
    notes: 'Cliente com alto interesse, aguardando retorno de parceiro.'
  }));
};

export const mockLeads = generateMockLeads(50);
