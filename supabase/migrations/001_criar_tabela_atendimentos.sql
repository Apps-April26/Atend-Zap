-- Migration 001: Criar tabela atendimentos
-- Sistema: Atendimentos WhatsApp v3.0

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar ENUMs
DO $$ BEGIN
  CREATE TYPE nicho_enum AS ENUM ('construcao', 'gastronomia', 'medico', 'petshop');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE status_atendimento_enum AS ENUM ('encerrado', 'transferido', 'pendente');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tipo_atendimento_enum AS ENUM ('entrega', 'consulta', 'retirada', 'presencial');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE regiao_entrega_enum AS ENUM ('Zona Norte', 'Zona Sul', 'Zona Oeste', 'Centro', 'Baixada', 'Grande RJ');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE status_entrega_enum AS ENUM ('agendado', 'confirmado', 'em_rota', 'entregue', 'cancelado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tabela principal: atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT CHECK (char_length(nome) >= 3 AND char_length(nome) <= 100),
  telefone TEXT CHECK (char_length(regexp_replace(telefone, '[^0-9]', '', 'g')) >= 10 AND char_length(regexp_replace(telefone, '[^0-9]', '', 'g')) <= 11),
  nicho nicho_enum,
  resumo_conversa TEXT,
  produtos_citados TEXT,
  transferido_para TEXT,
  status status_atendimento_enum DEFAULT 'pendente',
  lembrete TEXT CHECK (char_length(lembrete) <= 300),
  lembrete_data TIMESTAMP WITH TIME ZONE,
  -- Campos v2 - Agendamento e Logística
  data_agendamento DATE,
  hora_agendamento TIME,
  tipo_atendimento tipo_atendimento_enum,
  endereco_entrega TEXT,
  numero_endereco TEXT,
  complemento TEXT,
  bairro_entrega TEXT,
  regiao_entrega regiao_entrega_enum,
  cep_entrega TEXT CHECK (char_length(regexp_replace(cep_entrega, '[^0-9]', '', 'g')) = 8),
  status_entrega status_entrega_enum DEFAULT 'agendado',
  observacao_entrega TEXT CHECK (char_length(observacao_entrega) <= 300),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_atendimentos_data_hora ON atendimentos(data_hora DESC);
CREATE INDEX IF NOT EXISTS idx_atendimentos_nicho ON atendimentos(nicho);
CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_atendimentos_bairro ON atendimentos(bairro_entrega);
CREATE INDEX IF NOT EXISTS idx_atendimentos_regiao ON atendimentos(regiao_entrega);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data_agendamento ON atendimentos(data_agendamento);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_atendimentos_updated_at
  BEFORE UPDATE ON atendimentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();