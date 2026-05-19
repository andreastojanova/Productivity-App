import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ulbosjmhannlmlvtkvmc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYm9zam1oYW5ubG1sdnRrdm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjM1MjgsImV4cCI6MjA5NDc5OTUyOH0.Q6NanAmOslJphrmDNE00HY72DgUFkbcJtO5zK5e2ojI'
)