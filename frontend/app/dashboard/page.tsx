import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'
import { Item } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <DashboardClient 
      userEmail={user.email!} 
      userId={user.id} 
      initialItems={items as Item[] || []} 
    />
  )
}
