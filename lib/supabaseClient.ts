import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvessxtvkydvkqxofxmt.supabase.co'; // Substitua pelo seu Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXNzeHR2a3lkdmtxeG9meG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTk0NTAsImV4cCI6MjA2MDQ5NTQ1MH0.5B500XXXNlzo5KLZE552OOMgfJy1ii_9Jv2iA--FkEI'; // Substitua pela sua Anon Public API Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
