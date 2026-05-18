-- Migration 002: Criar tabela de logs de acesso ao CRM
-- Sistema: Atendimentos WhatsApp v3.0

CREATE TABLE IF NOT EXISTS logs_acesso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  acao TEXT NOT NULL,
  detalhes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_acesso_user_id ON logs_acesso(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_acesso_created_at ON logs_acesso(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_acesso_acao ON logs_acesso(acao);