import { createClient } from '@supabase/supabase-js'

// Cukup masukkan URL base saja tanpa /rest/v1/
const supabaseUrl = 'https://bmjflatpnowbwgbsfsre.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtamZsYXRwbm93YndnYnNmc3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTc3NzcsImV4cCI6MjA5NjczMzc3N30.0yaqMRSzFmDAjbqlzuBemINhV5nc9dCFEfIrr2a11A0'

export const supabase = createClient(supabaseUrl, supabaseKey)
