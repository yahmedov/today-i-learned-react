import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cazbhfybkzvlipjkvkux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhemJoZnlia3p2bGlwamt2a3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDgyNTUsImV4cCI6MjA1NTI4NDI1NX0.sYeNa9SroRy5T6L9G40lrEZM4oS1KtkRnvU_uXuaI_I';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
