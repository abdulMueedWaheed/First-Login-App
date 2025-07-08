import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Add validation
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key is missing in environment variables');
  console.log('Current environment variables:', process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;