import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Using hardcoded fallbacks for production.');
}

const FALLBACK_URL = 'https://zyeldkinzwbknynpdmig.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZWxka2luendia255bnBkbWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MjE2MDYsImV4cCI6MjA4OTA5NzYwNn0._VBMKInq5A83m9tZdyc7XbEOb3J3oD0nWUDmds__xEc';

export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY
);
