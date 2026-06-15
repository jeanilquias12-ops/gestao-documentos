const SUPABASE_URL = 'https://jpmhnlorbrtjeesknwbl.supabase.co';
// Usa a chave de serviço (server-side, ignora RLS) se configurada; senão cai na chave pública.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbWhubG9yYnJ0amVlc2tud2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDgyNTQsImV4cCI6MjA5MzQ4NDI1NH0.wvD6GIoQqnLp95kjVGCNg23aNYQTJeurp2Lic65uoXw';

const DIAS_PT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MESES_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function fmtDateExtenso(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return `${DIAS_PT[d.getDay()]}, ${d.getDate()} de ${MESES_PT[d.getMonth()]}`;
}

function statusCfg(status) {
  switch (status) {
    case 'pendente':   return { label: 'Pendente',   cor: '#1565C0', fundo: '#E3F2FD', emoji: '🕐' };
    case 'reagendado': return { label: 'Reagendado', cor: '#8A5A00', fundo: '#FFF6E0', emoji: '🔄' };
    case 'realizado':  return { label: 'Realizado',  cor: '#2E7D32', fundo: '#E8F5E9', emoji: '✅' };
    case 'cancelado':  return { label: 'Cancelado',  cor: '#9B2A1A', fundo: '#FCE6E2', emoji: '❌' };
    default:           return { label: status,       cor: '#555555', fundo: '#f5f5f5', emoji: '📋' };
  }
}

function gerarHtml({ semanaLabel, dias, totalAgendamentos, hoje }) {
  const corHeader = '#0F4F22';

  const diasHtml = dias.map(dia => {
    if (!dia.avaliacoes.length) return '';

    const linhas = dia.avaliacoes.map((a, i) => {
      const st = statusCfg(a.status);
      return `
        <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fbfa'}">
          <td style="padding:12px 16px;border-bottom:1px solid #e8ede9;vertical-align:top">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;width:100%">
                  <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#13301B">${a.empresa}</p>
                  ${a.hora ? `<p style="margin:0 0 3px;font-size:12px;color:#456355">🕐 Horário: <b>${a.hora}</b></p>` : ''}
                  ${a.responsavel ? `<p style="margin:0 0 3px;font-size:12px;color:#456355">👤 Responsável: ${a.responsavel}</p>` : ''}
                  ${a.obs ? `<p style="margin:0 0 3px;font-size:12px;color:#7A9387;font-style:italic">📝 ${a.obs}</p>` : ''}
                </td>
                <td style="vertical-align:top;padding-left:12px;white-space:nowrap">
                  <span style="display:inline-block;background:${st.fundo};color:${st.cor};font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;letter-spacing:.04em">${st.emoji} ${st.label}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    }).join('');

    return `
      <div style="margin-bottom:24px">
        <div style="background:#0F4F22;border-radius:8px 8px 0 0;padding:10px 16px;display:flex;align-items:center">
          <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:.02em">
            📅 ${fmtDateExtenso(dia.data)} <span style="font-weight:400;color:rgba(255,255,255,.7);margin-left:8px">${fmtDate(dia.data)}</span>
          </p>
          <span style="margin-left:auto;background:rgba(255,255,255,.2);color:#ffffff;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px">${dia.avaliacoes.length} avaliação${dia.avaliacoes.length > 1 ? 'ões' : ''}</span>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2ede5;border-top:none;border-radius:0 0 8px 8px;overflow:hidden">
          ${linhas}
        </table>
      </div>`;
  }).join('');

  const semVazia = !dias.some(d => d.avaliacoes.length);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f1;padding:32px 0">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%">

        <!-- HEADER -->
        <tr><td style="background:${corHeader};border-radius:12px 12px 0 0;padding:36px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:.14em;text-transform:uppercase">SECONCI Goiás · SST</p>
          <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-.02em">📋 Agenda Semanal</h1>
          <p style="margin:0 0 4px;font-size:15px;color:rgba(255,255,255,.9);font-weight:600">Avaliações Psicossociais</p>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,.7)">${semanaLabel}</p>
        </td></tr>

        <!-- RESUMO -->
        <tr><td style="background:#1B6B2F;padding:14px 40px;text-align:center">
          ${semVazia
            ? `<p style="margin:0;font-size:13px;color:rgba(255,255,255,.9)">Nenhuma avaliação agendada para a próxima semana.</p>`
            : `<p style="margin:0;font-size:13px;color:rgba(255,255,255,.9)"><b style="font-size:22px;color:#ffffff">${totalAgendamentos}</b> &nbsp;avaliação${totalAgendamentos > 1 ? 'ões' : ''} agendada${totalAgendamentos > 1 ? 's' : ''} na semana</p>`
          }
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:32px 40px">
          ${semVazia
            ? `<div style="text-align:center;padding:24px 0">
                <p style="font-size:40px;margin:0 0 12px">📭</p>
                <p style="font-size:15px;color:#456355;font-weight:600;margin:0 0 6px">Agenda limpa!</p>
                <p style="font-size:13px;color:#7A9387;margin:0">Nenhuma avaliação psicossocial pendente ou reagendada para a próxima semana.</p>
               </div>`
            : diasHtml
          }
          <div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid #e8ede9">
            <p style="margin:0 0 14px;font-size:13px;color:#7A9387">Acesse o sistema para gerenciar os agendamentos.</p>
            <a href="https://gestao-documentos-theta.vercel.app" style="display:inline-block;background:#1B6B2F;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:12px 32px;border-radius:8px;letter-spacing:.02em">Abrir sistema →</a>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f4faf6;border-top:1px solid #e2ede5;border-radius:0 0 12px 12px;padding:18px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#7A9387">SECONCI Goiás · Sistema de Gestão SST · Enviado em ${fmtDate(hoje)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

  const notifyEmail = process.env.NOTIFY_EMAIL_AGENDA || process.env.NOTIFY_EMAIL;
  const apiKey      = process.env.BREVO_API_KEY;

  if (!notifyEmail || !apiKey) {
    return res.status(500).json({ error: 'NOTIFY_EMAIL_AGENDA (ou NOTIFY_EMAIL) e BREVO_API_KEY não configurados' });
  }

  // Calcular próxima semana (segunda a domingo)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diaSemana = hoje.getDay(); // 0=dom, 5=sex
  const diasAteSegunda = diaSemana === 0 ? 1 : 8 - diaSemana;
  const proxSegunda = new Date(hoje.getTime() + diasAteSegunda * 86400000);
  const proxDomingo = new Date(proxSegunda.getTime() + 6 * 86400000);

  const toISO = d => d.toISOString().slice(0, 10);
  const inicioSemana = toISO(proxSegunda);
  const fimSemana    = toISO(proxDomingo);
  const hojeISO      = toISO(hoje);

  const semanaLabel = `${fmtDateExtenso(inicioSemana)} até ${fmtDateExtenso(fimSemana)}`;

  // Buscar dados do Supabase
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  const [psiRes, clientesRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/psicossociais?data=gte.${inicioSemana}&data=lte.${fimSemana}&order=data.asc,hora.asc&select=id,cliente_id,empresa_livre,data,hora,status,responsavel,observacoes`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/clientes?select=id,nome`, { headers })
  ]);

  if (!psiRes.ok || !clientesRes.ok) {
    const errBody = await psiRes.text().catch(() => '');
    return res.status(500).json({ error: 'Falha ao consultar Supabase', status: psiRes.status, detail: errBody });
  }

  let psicossociais = [], clientes = [];
  { const r = await psiRes.json();      psicossociais = Array.isArray(r) ? r : []; }
  { const r = await clientesRes.json(); clientes      = Array.isArray(r) ? r : []; }

  const clienteMap = {};
  clientes.forEach(c => { clienteMap[c.id] = c.nome; });

  // Organizar por dia da semana
  const diasMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(proxSegunda.getTime() + i * 86400000);
    const iso = toISO(d);
    diasMap[iso] = { data: iso, avaliacoes: [] };
  }

  psicossociais.forEach(p => {
    if (!diasMap[p.data]) return;
    diasMap[p.data].avaliacoes.push({
      empresa:     p.empresa_livre || clienteMap[p.cliente_id] || '—',
      hora:        p.hora || '',
      status:      p.status || 'pendente',
      responsavel: p.responsavel || '',
      obs:         p.observacoes || ''
    });
  });

  const dias = Object.values(diasMap);
  const totalAgendamentos = psicossociais.length;

  const html = gerarHtml({ semanaLabel, dias, totalAgendamentos, hoje: hojeISO });

  const assunto = totalAgendamentos === 0
    ? 'SECONCI — 📋 Agenda Semanal: nenhuma avaliação psicossocial'
    : `SECONCI — 📋 Agenda Semanal: ${totalAgendamentos} avaliação${totalAgendamentos > 1 ? 'ões' : ''} psicossocial${totalAgendamentos > 1 ? 'is' : ''}`;

  const recipients = notifyEmail.split(',').map(e => e.trim()).filter(Boolean);

  const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender:      { name: 'SECONCI Goiás', email: 'jeanilquias12@gmail.com' },
      to:          recipients.map(e => ({ email: e })),
      subject:     assunto,
      htmlContent: html
    })
  });

  const data = await emailRes.json();
  if (emailRes.ok) {
    return res.status(200).json({ success: true, total: totalAgendamentos, semana: `${inicioSemana} a ${fimSemana}` });
  }
  return res.status(500).json({ error: data.message || JSON.stringify(data) });
};
