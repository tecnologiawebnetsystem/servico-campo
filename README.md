# Sistema de Cadastro de Horas - Serviço de Campo

Sistema para registro de horas de serviço de campo com autenticação por PIN, controle mensal de horas e estudos bíblicos.

## Configuração com Neon (PostgreSQL)

Este projeto usa o **Neon** como banco de dados PostgreSQL serverless. A integração já está configurada automaticamente.

### Pré-requisitos

- Conta Vercel conectada ao v0
- Integração Neon ativada no projeto

### Scripts do banco de dados

Os scripts SQL para criar as tabelas estão em `scripts/`:
- `01_create_neon_tables.sql` - Cria as tabelas
- `02_insert_initial_data_neon.sql` - Insere a usuária Pamela Gonçalves

Estes scripts já foram executados automaticamente durante a configuração.

### Como usar

1. Acesse o aplicativo
2. Use o PIN **191018** para fazer login como Pamela Gonçalves
3. Comece a registrar suas horas de serviço!

## Estrutura do Banco de Dados

### Tabela: usuarios
- `id`: ID do usuário (SERIAL)
- `nome`: Nome completo (VARCHAR)
- `pin`: PIN de 6 dígitos (VARCHAR, UNIQUE)
- `created_at`: Data de criação (TIMESTAMP)

### Tabela: registro_horas
- `id`: ID do registro (SERIAL)
- `usuario_id`: Referência ao usuário (INTEGER)
- `data`: Data completa do registro (DATE)
- `quantidade_horas`: Horas trabalhadas (DECIMAL)
- `modalidade`: Tipo de atividade (VARCHAR)
- `mes`: Mês (INTEGER)
- `ano`: Ano (INTEGER)
- `created_at`: Data de criação (TIMESTAMP)

### Tabela: estudos_biblicos
- `id`: ID do estudo (SERIAL)
- `usuario_id`: Referência ao usuário (INTEGER)
- `mes`: Mês (INTEGER)
- `ano`: Ano (INTEGER)
- `quantidade`: Número de estudos (INTEGER)
- `created_at`: Data de criação (TIMESTAMP)
- `updated_at`: Última atualização (TIMESTAMP)

## Funcionalidades

- Login com PIN de 6 dígitos
- Cadastro de horas com calendário visual
- Suporte para horas decimais (1,3 ou 1,48)
- 5 modalidades: Pregação, Cartas, Ligação, Estudo, TPE
- Widgets mostrando total de horas, horas faltantes e estudos bíblicos
- Gerenciamento de estudos bíblicos com botões +/-
- Edição e exclusão de registros de horas
- Navegação entre meses/anos
- Grid organizado por dia
- PWA instalável em tablets e dispositivos móveis

## Tecnologias

- Next.js 16
- React 19.2
- TypeScript
- Neon PostgreSQL (Serverless)
- Tailwind CSS 4
- shadcn/ui

## Instalação no Tablet

O aplicativo é um PWA (Progressive Web App) e pode ser instalado diretamente no tablet:

1. Abra o site no navegador do tablet
2. Toque no menu do navegador
3. Selecione "Adicionar à Tela Inicial"
4. O app será instalado como aplicativo nativo
</parameter>
