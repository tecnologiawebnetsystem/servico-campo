-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  pin VARCHAR(6) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de registro de horas
CREATE TABLE IF NOT EXISTS registro_horas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  horas DECIMAL(5,2) NOT NULL,
  modalidade VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_dia CHECK (dia >= 1 AND dia <= 31),
  CONSTRAINT check_mes CHECK (mes >= 1 AND mes <= 12),
  CONSTRAINT check_modalidade CHECK (modalidade IN ('Pregação', 'Cartas', 'Ligação', 'Estudo', 'TPE'))
);

-- Criação da tabela de estudos bíblicos
CREATE TABLE IF NOT EXISTS estudos_biblicos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, mes, ano),
  CONSTRAINT check_mes_estudos CHECK (mes >= 1 AND mes <= 12),
  CONSTRAINT check_quantidade CHECK (quantidade >= 0)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_registro_horas_usuario ON registro_horas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_registro_horas_data ON registro_horas(usuario_id, mes, ano);
CREATE INDEX IF NOT EXISTS idx_estudos_biblicos_usuario ON estudos_biblicos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_estudos_biblicos_data ON estudos_biblicos(usuario_id, mes, ano);
