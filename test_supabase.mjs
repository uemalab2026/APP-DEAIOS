import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'romulobrandao.pro@gmail.com',
    password: 'dioestetica@2026',
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  console.log('Logged in!', authData.user.id);

  const { data: fetch, error: fe } = await supabase.from('leads').select('*').limit(1);
  if (fe) {
    console.error('Fetch error:', fe);
  } else {
    console.log('Columns in leads table:', Object.keys(fetch[0] || {}));
  }
}

test();
