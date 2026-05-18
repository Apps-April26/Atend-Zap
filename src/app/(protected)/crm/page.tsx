import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CRMContent from '@/components/CRM/CRMContent'

export default async function CRMPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch atendimentos
  const { data: atendimentos } = await supabase
    .from('atendimentos')
    .select('*')
    .order('data_hora', { ascending: false })

  // Fetch user profile
  const { data: perfil } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '1.5rem' }}>
      <CRMContent
        atendimentos={atendimentos || []}
        user={user}
        perfil={perfil}
      />
    </main>
  )
}