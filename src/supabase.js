import { createClient } from '@supabase/supabase-js'

const supaBaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supaBaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(
    supaBaseUrl,
    supaBaseKey
)