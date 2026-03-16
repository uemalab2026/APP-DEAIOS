-- Run this script in the Supabase SQL Editor to set Pedro's password and confirm his email
UPDATE auth.users
SET 
  encrypted_password = crypt('dioestetica@2026', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'pedro@dioestetica.com.br';

-- Also update the status in the members table to active
UPDATE public.members
SET status = 'ativo'
WHERE email = 'pedro@dioestetica.com.br';
