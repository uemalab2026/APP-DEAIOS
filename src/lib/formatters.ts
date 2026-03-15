import type { Channel, LeadStatus } from '@/types/types';

export const formatCurrency = (value: number | null | undefined): string => {
  const safeValue = (value != null && !isNaN(value)) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const formatRoas = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + 'x';
};

export const getChannelLabel = (channel: Channel): string => {
  const labels: Record<Channel, string> = {
    anuncio: 'Anúncio',
    social_selling: 'Social Selling',
    recorrente: 'Recorrentes',
    indicacao: 'Indicação'
  };
  return labels[channel];
};

export const getChannelColor = (channel: Channel): string => {
  const colors: Record<Channel, string> = {
    anuncio: 'text-anuncio',
    social_selling: 'text-social',
    recorrente: 'text-recorrente',
    indicacao: 'text-indicacao'
  };
  return colors[channel];
};

export const getChannelBgColor = (channel: Channel): string => {
  const colors: Record<Channel, string> = {
    anuncio: 'bg-anuncio',
    social_selling: 'bg-social',
    recorrente: 'bg-recorrente',
    indicacao: 'bg-indicacao'
  };
  return colors[channel];
};

export const getStatusLabel = (status: LeadStatus): string => {
  const labels: Record<LeadStatus, string> = {
    novo: 'Novo',
    conversa_iniciada: 'Conversa Iniciada',
    nao_respondeu: 'Não Respondeu',
    agendado: 'Agendado',
    compareceu: 'Compareceu',
    vendido: 'Venda Concluída',
    sem_interesse: 'Sem Interesse',
    numero_incorreto: 'Nº Incorreto',
    reagendado: 'Reagendado',
    no_show: 'Faltou (No Show)'
  };
  return labels[status];
};

export const getStatusColorVariant = (status: LeadStatus): 'default' | 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'vendido':
    case 'compareceu':
      return 'success';
    case 'agendado':
    case 'novo':
      return 'info';
    case 'conversa_iniciada':
    case 'reagendado':
      return 'warning';
    case 'nao_respondeu':
    case 'sem_interesse':
    case 'numero_incorreto':
    case 'no_show':
      return 'error';
    default:
      return 'default';
  }
};
