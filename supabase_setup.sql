-- ============================================================
-- DEAIOS — Script de criação do banco de dados Supabase
-- Execute este script inteiro no SQL Editor do Supabase
-- Dashboard: https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- 1. TABELA: leads
-- Armazena todos os leads do CRM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'novo',
  current_stage TEXT DEFAULT 'Captação',
  channel TEXT NOT NULL DEFAULT 'anuncio',
  sub_channel TEXT,
  campaign TEXT,
  source TEXT,
  service_interest TEXT,
  value NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- 2. TABELA: daily_entries
-- Armazena lançamentos diários de performance por canal
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  channel TEXT NOT NULL,
  revenue_projected NUMERIC DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversations INTEGER DEFAULT 0,
  schedules INTEGER DEFAULT 0,
  attendances INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  ad_investment_meta NUMERIC DEFAULT 0,
  ad_investment_google NUMERIC DEFAULT 0,
  access_social_selling NUMERIC DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- 3. TABELA: settings
-- Armazena configurações globais (metas, dados da clínica)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- 4. TABELA: members
-- Armazena membros da equipe
-- ============================================================
CREATE TABLE IF NOT EXISTS public.members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'ativo',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  invited_by UUID REFERENCES auth.users(id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Permite que usuários autenticados leiam e escrevam dados
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- LEADS: qualquer usuário autenticado pode ler e escrever
CREATE POLICY "Authenticated users can read leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert leads" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads" ON public.leads
  FOR DELETE TO authenticated USING (true);

-- DAILY_ENTRIES: qualquer usuário autenticado pode ler e escrever
CREATE POLICY "Authenticated users can read daily_entries" ON public.daily_entries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert daily_entries" ON public.daily_entries
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update daily_entries" ON public.daily_entries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- SETTINGS: qualquer usuário autenticado pode ler e escrever
CREATE POLICY "Authenticated users can read settings" ON public.settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert settings" ON public.settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings" ON public.settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- MEMBERS: qualquer usuário autenticado pode ler e escrever
CREATE POLICY "Authenticated users can read members" ON public.members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert members" ON public.members
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update members" ON public.members
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members" ON public.members
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- DADOS INICIAIS (Settings padrão)
-- ============================================================
INSERT INTO public.settings (key, value) VALUES
  ('metas', '{"goal": 153000, "goal_average": 175000, "goal_super": 220000}'::jsonb),
  ('investimento', '{"meta_ads": 11000, "social_selling": 1515, "extra": 0}'::jsonb),
  ('clinica', '{"name": "DIoEstética", "cnpj": "00.000.000/0000-00", "phone": "(11) 3232-1234", "address": "Av. Paulista, 1000 - São Paulo, SP"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- PRONTO! Todas as tabelas foram criadas com sucesso.
-- Agora volte ao aplicativo e faça login para testar.
-- ============================================================
