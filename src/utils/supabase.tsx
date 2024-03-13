import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
     "https://qwohfqlpkbmsnfwyjrjc.supabase.co",
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3b2hmcWxwa2Jtc25md3lqcmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwOTM3NzcsImV4cCI6MjAyMTY2OTc3N30.sOo819AgfqV-HyPuEo3NoH4RfokEmU0LjocX9pXtLeY"
  )


export default supabase