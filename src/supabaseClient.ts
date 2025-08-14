import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scpjbcjiqummkonbfbnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcGpiY2ppcXVtbWtvbmJmYm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzI1ODcsImV4cCI6MjA3MDE0ODU4N30.XLF-PJ60gliLUrzB6gLiY-yVMddeBjssyMRRPmmPn2s';

export const supabase = createClient(supabaseUrl, supabaseKey);