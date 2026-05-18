-- Migration 004: Habilitar RLS (Row Level Security) em todas as tabelas
-- Sistema: Atendimentos WhatsApp v3.0
-- ATENÇÃO: Após habilitar RLS, políticas controlam acesso aos dados

-- Habilitar RLS nas tabelas
ALTER TABLE atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_acesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA TABELA atendimentos
-- ============================================

-- Administradores veem tudo
CREATE POLICY "Administradores veem todos os atendimentos"
  ON atendimentos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'administrador'
    )
  );

-- Usuários comuns veem apenas atendimentos (leitura)
CREATE POLICY "Usuários comuns veem atendimentos"
  ON atendimentos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'usuario_comum'
    )
  );

-- Usuários comuns podem atualizar apenas status_entrega
CREATE POLICY "Usuários comuns atualizam status de entrega"
  ON atendimentos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'usuario_comum'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'usuario_comum'
    )
  );

-- ============================================
-- POLÍTICAS PARA TABELA logs_acesso
-- ============================================

-- Apenas administradores veem logs
CREATE POLICY "Apenas administradores veem logs de acesso"
  ON logs_acesso FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'administrador'
    )
  );

-- ============================================
-- POLÍTICAS PARA TABELA perfis
-- ============================================

-- Administradores gerenciam perfis
CREATE POLICY "Administradores gerenciam perfis"
  ON perfis FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfis
      WHERE perfis.user_id = auth.uid()::text
      AND perfis.role = 'administrador'
    )
  );

-- Todos veem seu próprio perfil
CREATE POLICY "Usuários veem próprio perfil"
  ON perfis FOR SELECT
  TO authenticated
  USING (perfis.user_id = auth.uid()::text);