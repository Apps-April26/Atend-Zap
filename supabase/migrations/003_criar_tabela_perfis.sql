-- Migration 003: Criar tabela de perfis de acesso
-- Sistema: Atendimentos WhatsApp v3.0

DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('administrador', 'usuario_comum');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  role role_enum DEFAULT 'usuario_comum',
  nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perfis_user_id ON perfis(user_id);
CREATE INDEX IF NOT EXISTS idx_perfis_role ON perfis(role);