import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zyeldkinzwbknynpdmig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZWxka2luendia255bnBkbWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MjE2MDYsImV4cCI6MjA4OTA5NzYwNn0._VBMKInq5A83m9tZdyc7XbEOb3J3oD0nWUDmds__xEc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUser() {
  console.log('Attempting sign in to check if password works...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'pedro@dioestetica.com.br',
    password: 'dioestetica@2026'
  });
  
  if (!signInError) {
    console.log('User logged in successfully!', !!signInData.user);
    return;
  }
  
  console.log('Sign in failed:', signInError.message);
  console.log('Attempting signUp to set the password...');
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'pedro@dioestetica.com.br',
    password: 'dioestetica@2026',
    options: {
      data: {
        name: 'Pedro Neto'
      }
    }
  });
  
  if (signUpError) {
    console.log('SignUp error:', signUpError.message);
  } else {
    console.log('SignUp successful!', !!signUpData.user);
  }
}

fixUser();
