# Projeto: Gestão de Documentos

Este diretório é o projeto **Gestão de Documentos** (controle de PGR, LTCAT e documentos SST).

## Regras obrigatórias
- SOMENTE mexer neste projeto. Nunca tocar em outros projetos (segaudit, sitepgr, seconci-sst).
- O arquivo principal é `index.html.html` — toda a lógica do sistema está nele.
- Sempre fazer commit + push para o GitHub após qualquer alteração aprovada.
- Nunca fazer push sem testar antes (verificar lógica e/ou testar via Supabase MCP).

## Identidade
- **Repositório GitHub**: https://github.com/jeanilquias12-ops/gestao-documentos
- **Branch principal**: `main`
- **Banco de dados**: Supabase — projeto `jpmhnlorbrtjeesknwbl` (região `us-west-2`)

## Supabase — tabelas
| Tabela                | Descrição                          |
|-----------------------|------------------------------------|
| `clientes`            | Empresas cadastradas               |
| `documentos`          | PGR, LTCAT e outros documentos     |
| `contratos`           | Contratos de avaliação por empresa |
| `avaliacoes`          | Avaliações lançadas por contrato   |
| `historico_documentos`| Log de alterações nos documentos   |

## Regras do banco
- `documentos.cliente_id` tem FK → `clientes.id` com ON DELETE CASCADE.
- Todas as tabelas têm RLS habilitado com política `Acesso livre` (anon pode ler/escrever).
- Chave pública (anon): `sb_publishable_J3BY43oX5VIrIdj7qo-TIQ_z7ylupDy`
- URL: `https://jpmhnlorbrtjeesknwbl.supabase.co`

## Fluxo de save
1. `save()` → grava em localStorage (cache local)
2. `salvar*Nuvem()` → grava no Supabase (fonte da verdade)
3. Ao recarregar → `carregarDaNuvem()` busca Supabase e sobrescreve localStorage
4. Se Supabase vazio → estado local é zerado (sem dados de exemplo)

## Histórico de correções já feitas
- Schema do banco corrigido (colunas `data_envio_financeiro`, `tipos_qtd`, `valor`)
- Handlers de save convertidos para async/await com toast de erro real
- `seedData()` removido do `initApp()` — sem dados de exemplo automáticos
- Modal não fecha mais ao clicar fora — somente pelo X ou Cancelar
- Campo Empresa vem em branco ao criar novo documento
