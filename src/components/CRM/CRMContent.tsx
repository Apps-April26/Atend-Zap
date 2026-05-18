'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

interface User {
  id: string
  email?: string
}

interface Perfil {
  role: string
  nome?: string
}

interface Atendimento {
  id: string
  data_hora: string
  nome: string
  telefone: string
  nicho: string
  status: string
  bairro_entrega?: string
  regiao_entrega?: string
  data_agendamento?: string
  hora_agendamento?: string
  tipo_atendimento?: string
  status_entrega?: string
  produtos_citados?: string
  [key: string]: unknown
}

interface Props {
  atendimentos: Atendimento[]
  user: User
  perfil: Perfil | null
}

export default function CRMContent({ atendimentos, user, perfil }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [filtroNicho, setFiltroNicho] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroBairro, setFiltroBairro] = useState('')
  const [showExport, setShowExport] = useState(false)

  const atendimentosFiltrados = atendimentos.filter((a) => {
    if (filtroNicho && a.nicho !== filtroNicho) return false
    if (filtroStatus && a.status !== filtroStatus) return false
    if (filtroBairro && a.bairro_entrega !== filtroBairro) return false
    return true
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Data/Hora', 'Nome', 'Telefone', 'Nicho', 'Status',
      'Endereço', 'Bairro', 'Região', 'CEP', 'Data Agendamento',
      'Hora Agendamento', 'Tipo Atendimento', 'Status Entrega',
      'Produtos', 'Resumo', 'Transferido para', 'Lembrete', 'Lembrete Data'
    ]

    const rows = atendimentosFiltrados.map((a) => [
      a.id,
      a.data_hora,
      a.nome,
      a.telefone,
      a.nicho,
      a.status,
      a.endereco_entrega || '',
      a.bairro_entrega || '',
      a.regiao_entrega || '',
      a.cep_entrega || '',
      a.data_agendamento || '',
      a.hora_agendamento || '',
      a.tipo_atendimento || '',
      a.status_entrega || '',
      a.produtos_citados || '',
      a.resumo_conversa || '',
      a.transferido_para || '',
      a.lembrete || '',
      a.lembrete_data || '',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `atendimentos_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('pt-BR')
  }

  const nicheLabels: Record<string, string> = {
    construcao: 'Construção',
    gastronomia: 'Gastronomia',
    medico: 'Prod. Médicos',
    petshop: 'PetShop',
  }

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    encerrado: 'Encerrado',
    transferido: 'Transferido',
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>CRM</h1>
          <span className={styles.badge}>
            {perfil?.role === 'administrador' ? 'Administrador' : 'Usuário'}
          </span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{user.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <select
            value={filtroNicho}
            onChange={(e) => setFiltroNicho(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos os nichos</option>
            <option value="construcao">Construção</option>
            <option value="gastronomia">Gastronomia</option>
            <option value="medico">Prod. Médicos</option>
            <option value="petshop">PetShop</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className={styles.select}
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="encerrado">Encerrado</option>
            <option value="transferido">Transferido</option>
          </select>

          <input
            type="text"
            placeholder="Filtrar por bairro..."
            value={filtroBairro}
            onChange={(e) => setFiltroBairro(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.actions}>
          <span className={styles.count}>
            {atendimentosFiltrados.length} atendimento(s)
          </span>
          <button onClick={handleExportCSV} className={styles.exportBtn}>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Nicho</th>
              <th>Status</th>
              <th>Bairro</th>
              <th>Região</th>
              <th>Agendamento</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {atendimentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  Nenhum atendimento encontrado
                </td>
              </tr>
            ) : (
              atendimentosFiltrados.map((a) => (
                <tr key={a.id}>
                  <td>{formatDate(a.data_hora)}</td>
                  <td>{a.nome}</td>
                  <td>{a.telefone}</td>
                  <td>
                    <span
                      className={styles.nicheTag}
                      data-niche={a.nicho}
                    >
                      {nicheLabels[a.nicho] || a.nicho}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusTag} data-status={a.status}>
                      {statusLabels[a.status] || a.status}
                    </span>
                  </td>
                  <td>{a.bairro_entrega || '-'}</td>
                  <td>{a.regiao_entrega || '-'}</td>
                  <td>
                    {a.data_agendamento
                      ? `${a.data_agendamento} ${a.hora_agendamento || ''}`
                      : '-'}
                  </td>
                  <td>{a.tipo_atendimento || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}