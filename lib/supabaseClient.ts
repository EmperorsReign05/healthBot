import { createClient } from '@supabase/supabase-js'

// 1. Make sure your .env.local file has these variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. The 'export' keyword is crucial here. It's what makes this file a module.
export const supabase = createClient(supabaseUrl, supabaseKey)

export { createClient }
