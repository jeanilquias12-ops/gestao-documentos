// Teste das regras da agenda (fim de semana, feriados de Goiânia e conflito de dia), sem navegador.
// Roda o código que está no próprio index.html. Uso: node tests/agenda-regras.test.js
const fs = require('fs'), assert = require('assert');
const html = fs.readFileSync(process.argv[2] || require('path').join(__dirname, '..', 'index.html'), 'utf8');
const ini = html.indexOf('/* ================== REGRAS DA AGENDA');
const fim = html.indexOf('// Aviso na hora de escolher a data');
assert.ok(ini >= 0 && fim > ini, 'bloco das regras da agenda não encontrado no index.html');
const src = html.slice(ini, fim);
const state = {psicossociais: [], eventos: [], agendaDias: []};
const nomeEmpresa = id => ({e1: 'Empresa Um', e2: 'Empresa Dois'}[id] || '—');
const fmtDate = iso => iso.split('-').reverse().join('/');
const api = new Function('state', 'nomeEmpresa', 'fmtDate',
  src + ';return {pascoaDe, feriadosDoAno, diaEspecialAgenda, agendadosNoDia, avaliarDataAgenda, FERIADOS_PADRAO, dataDoFeriado, comportamentoFeriado};')(state, nomeEmpresa, fmtDate);
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };

// Páscoa (datas conhecidas)
for (const [ano, esperado] of [[2024, '2024-03-31'], [2025, '2025-04-20'], [2026, '2026-04-05'], [2027, '2027-03-28'], [2028, '2028-04-16'], [2029, '2029-04-01'], [2030, '2030-04-21']])
  assert.strictEqual(iso(api.pascoaDe(ano)), esperado, 'Páscoa ' + ano), n++;

// 2026 contra a lista do feriados.com.br/GO/Goiânia (conferida no navegador)
const f26 = api.feriadosDoAno(2026);
const bloqueiam = Object.entries(f26).filter(([, v]) => v.tipo === 'feriado').map(([d]) => d).sort();
assert.deepStrictEqual(bloqueiam, ['2026-01-01', '2026-04-03', '2026-04-21', '2026-05-01', '2026-05-24', '2026-06-04', '2026-09-07', '2026-10-12', '2026-10-24', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25'], 'feriados que impedem 2026'); n++;
const facult = Object.entries(f26).filter(([, v]) => v.tipo === 'facultativo').map(([d]) => d).sort();
assert.deepStrictEqual(facult, ['2026-02-16', '2026-02-17', '2026-02-18', '2026-07-26', '2026-10-15', '2026-10-28'], 'facultativos 2026'); n++;
// Consciência Negra só é nacional a partir de 2024
ok(!api.feriadosDoAno(2023)['2023-11-20'], '20/11/2023 não era feriado nacional');
ok(api.feriadosDoAno(2024)['2024-11-20'], '20/11/2024 é feriado');

// Regras por dia
const d = x => api.diaEspecialAgenda(x);
ok(d('2026-10-10').bloqueia && d('2026-10-10').nome === 'Sábado', 'sábado impede');
ok(d('2026-10-11').bloqueia && d('2026-10-11').nome === 'Domingo', 'domingo impede');
ok(d('2026-10-24').bloqueia && d('2026-10-24').nome === 'Sábado · Aniversário de Goiânia', 'sábado que também é feriado');
ok(d('2026-10-12').bloqueia && d('2026-10-12').tipo === 'feriado', 'feriado nacional em dia útil impede');
ok(d('2026-04-03').bloqueia && d('2026-04-03').nome === 'Sexta-Feira Santa', 'sexta santa');
ok(d('2026-06-04').bloqueia && d('2026-06-04').nome === 'Corpus Christi', 'corpus christi (municipal) impede');
ok(!d('2026-10-15').bloqueia && d('2026-10-15').tipo === 'facultativo', 'ponto facultativo só avisa');
ok(!d('2026-02-16').bloqueia && d('2026-02-16').tipo === 'facultativo', 'carnaval só avisa');
ok(!d('2026-10-13').bloqueia && d('2026-10-13').tipo === null, 'dia comum livre');
ok(!d('').bloqueia && !d('lixo').bloqueia && !d(null).bloqueia, 'entrada vazia ou inválida não quebra');
ok(!d('2026-05-10').bloqueia || d('2026-05-10').nome === 'Domingo', 'Dia das Mães (domingo) só pelo fim de semana');
ok(!d('2026-05-11').bloqueia, 'comemorativos ignorados');

// Rótulo curto que cabe na célula do calendário (o nome completo vai no tooltip)
ok(d('2026-10-15').curto === 'Dia do Professor', 'curto sem parênteses');
ok(d('2026-10-24').curto === 'Aniversário de Goiânia', 'curto de sábado que é feriado');
ok(d('2026-02-18').curto === 'Quarta-feira de Cinzas', 'curto da quarta de cinzas');
ok(d('2026-10-17').curto === '' && d('2026-10-13').curto === undefined, 'sábado comum sem rótulo; dia útil sem curto');

// Conflitos entre todas as agendas
state.psicossociais.push({id: 'p1', data: '2026-10-13', empresa: 'e1', hora: '09:00', status: 'pendente'});
state.eventos.push({id: 'v1', tipo: 'auditoria', data: '2026-10-13', empresaLivre: 'Obra Alfa', hora: '', status: 'pendente'},
                   {id: 'v2', tipo: 'palestra', data: '2026-10-13', empresa: 'e2', hora: '08:00', status: 'cancelado'},
                   {id: 'v3', tipo: 'treinamento', data: '2026-10-14', empresa: 'e2', hora: '10:00', status: 'pendente'});
let r = api.avaliarDataAgenda('2026-10-13');
ok(r.bloqueio === null, 'conflito nunca impede');
ok(r.avisos.length === 1 && /Já há 2 agendamento\(s\) em 13\/10\/2026/.test(r.avisos[0]), 'conta 2 (cancelado fica de fora)');
ok(r.avisos[0].indexOf('Psicossocial · Empresa Um · 09:00') < r.avisos[0].indexOf('Auditoria · Obra Alfa'), 'ordenado por horário (sem hora por último)');
ok(!/Palestra/.test(r.avisos[0]), 'cancelado não conta');
r = api.avaliarDataAgenda('2026-10-13', 'p1');
ok(/Já há 1 agendamento/.test(r.avisos[0]), 'ignora o próprio item ao editar');
r = api.avaliarDataAgenda('2026-10-15');
ok(r.bloqueio === null && r.avisos.length === 1 && /Dia do Professor/.test(r.avisos[0]), 'facultativo avisa');
r = api.avaliarDataAgenda('2026-10-17');
ok(r.bloqueio === 'Sábado' && r.avisos.length === 0, 'sábado impede e não polui com aviso');
r = api.avaliarDataAgenda('2026-10-20');
ok(r.bloqueio === null && r.avisos.length === 0, 'dia livre sem nada');

// ---- O coordenador muda as regras (state.agendaDias) ----
const fer = (chave, comportamento) => ({id: 'fer-' + chave, tipo: 'feriado', chave, comportamento});
const ind = (inicio, fim, motivo) => ({id: 'ad' + inicio, tipo: 'indisponivel', inicio, fim, motivo});
const limpo = () => { state.agendaDias = []; state.psicossociais.length = 0; state.eventos.length = 0; };
limpo();
// chaves únicas e estáveis (é por elas que a mudança vale em todos os anos)
const chaves = api.FERIADOS_PADRAO.map(f => f.chave);
ok(new Set(chaves).size === chaves.length && chaves.length === 19, '19 feriados padrão com chaves únicas');
// liberar: vale em todos os anos, inclusive nos móveis; fim de semana continua impedindo
state.agendaDias = [fer('aniversario-de-goiania', 'liberar'), fer('corpus-christi', 'liberar')];
ok(!d('2028-10-24').bloqueia && !d('2029-10-24').bloqueia, 'aniversário liberado em todos os anos');
ok(!d('2026-06-04').bloqueia && !d('2027-05-27').bloqueia, 'Corpus Christi (móvel) liberado em 2026 e 2027');
ok(d('2026-10-24').bloqueia && d('2026-10-24').tipo === 'fds' && d('2026-10-24').nome === 'Sábado', 'liberado não libera sábado, e o nome do feriado some');
ok(d('2026-10-12').bloqueia, 'os outros feriados seguem impedindo');
// só avisar / impedir
state.agendaDias = [fer('natal', 'avisar'), fer('dia-do-professor', 'impedir')];
ok(!d('2026-12-25').bloqueia && d('2026-12-25').tipo === 'facultativo', 'Natal em "só avisar" não impede');
ok(api.avaliarDataAgenda('2026-12-25').avisos.length === 1 && api.avaliarDataAgenda('2026-12-25').bloqueio === null, 'Natal em "só avisar" gera aviso');
ok(d('2026-10-15').bloqueia && d('2026-10-15').tipo === 'feriado', 'Dia do Professor em "impedir" passa a impedir');
ok(api.comportamentoFeriado('natal') === 'avisar' && api.comportamentoFeriado('tiradentes') === null, 'comportamentoFeriado lê só o que foi mudado');
// dias indisponíveis: período inclusivo, um dia só, motivo na mensagem
state.agendaDias = [ind('2026-12-22', '2026-12-31', 'Recesso de fim de ano'), ind('2026-11-10', '2026-11-10', 'Evento interno')];
ok(d('2026-12-22').bloqueia && d('2026-12-31').bloqueia && d('2026-12-23').bloqueia, 'recesso: primeiro, último e meio do período');
ok(!d('2026-12-21').bloqueia && !d('2027-01-04').bloqueia, 'recesso: dia antes e dia depois liberados');
ok(d('2026-12-23').tipo === 'indisponivel' && d('2026-12-23').curto === 'Recesso de fim de ano' && d('2026-12-23').nome === 'dia indisponível (Recesso de fim de ano)', 'tipo, rótulo e mensagem do indisponível');
ok(d('2026-11-10').bloqueia && !d('2026-11-11').bloqueia, 'um dia só');
ok(d('2026-12-26').tipo === 'fds', 'sábado dentro do recesso continua sendo fim de semana');
ok(api.avaliarDataAgenda('2026-12-23').bloqueio === 'dia indisponível (Recesso de fim de ano)', 'o motivo vai na mensagem de bloqueio');
// precedência: indisponível vence "liberar"; períodos que se sobrepõem usam o que começa primeiro
state.agendaDias = [fer('natal', 'liberar'), ind('2026-12-20', '2026-12-28', 'Recesso'), ind('2026-12-24', '2026-12-30', 'Manutenção')];
ok(d('2026-12-25').bloqueia && d('2026-12-25').curto === 'Recesso', 'indisponível vence o feriado liberado; sobreposto usa o que começa antes');
ok(d('2026-12-29').curto === 'Manutenção', 'fora do primeiro período vale o segundo');
// dados malformados do banco não quebram
state.agendaDias = [{tipo: 'indisponivel', inicio: '', fim: '', motivo: 'x'}, {tipo: 'feriado', chave: '', comportamento: ''}];
ok(!d('2026-10-13').bloqueia, 'linhas incompletas são ignoradas');
state.agendaDias = undefined;
ok(!d('2026-10-13').bloqueia && d('2026-10-12').bloqueia, 'sem state.agendaDias tudo funciona como padrão');
state.agendaDias = [];
console.log(`ok: ${n} verificações`);
