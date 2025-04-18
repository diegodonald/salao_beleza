import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucbwhwfrvuxnomxdrvpt.supabase.co'; // Substitua pelo seu Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYndod2ZydnV4bm9teGRydnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDA2NjUsImV4cCI6MjA2MDU3NjY2NX0.0gW3yKRUB7GxOWZ9368ZMPc8UjD9dWeuvMRMjaTl-m0'; // Substitua pela sua Anon Public API Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
