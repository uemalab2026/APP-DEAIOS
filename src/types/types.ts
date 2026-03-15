export type Channel = 'anuncio' | 'social_selling' | 'recorrente' | 'indicacao';
export type LeadStatus = 'novo' | 'conversa_iniciada' | 'nao_respondeu' | 'agendado' | 'compareceu' | 'vendido' | 'sem_interesse' | 'numero_incorreto' | 'reagendado' | 'no_show';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  timezone: string;
}

export interface Profile {
  id: string;
  workspace_id: string;
  full_name: string;
  role: 'owner' | 'admin' | 'member';
  avatar_url?: string;
}

export interface MonthlyGoal {
  year: number;
  month: number;
  goal: number;
  goal_average: number;
  goal_super: number;
  ad_investment: number;
  social_investment: number;
}
