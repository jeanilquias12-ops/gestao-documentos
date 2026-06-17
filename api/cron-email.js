const SUPABASE_URL = 'https://jpmhnlorbrtjeesknwbl.supabase.co';
// Usa a chave de serviço (server-side, ignora RLS) se configurada; senão cai na chave pública.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbWhubG9yYnJ0amVlc2tud2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDgyNTQsImV4cCI6MjA5MzQ4NDI1NH0.wvD6GIoQqnLp95kjVGCNg23aNYQTJeurp2Lic65uoXw';

const fmtDate = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

function htmlEmail({ titulo, subtitulo, corHeader, blocos, rodape }) {
  const blocosHtml = blocos.map(b => `
    <div style="margin-bottom:24px">
      <div style="background:${b.corFundo};border-left:4px solid ${b.corBorda};border-radius:6px;padding:14px 18px;margin-bottom:10px">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${b.corTexto};letter-spacing:.04em;text-transform:uppercase">${b.icone} ${b.titulo}</p>
        <p style="margin:0;font-size:12px;color:${b.corTexto};opacity:.8">${b.subtitulo}</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${b.linhas.map((l, i) => `
          <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9f9f9'}">
            <td style="padding:10px 14px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333">${l}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f1;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr><td style="background:${corHeader};border-radius:12px 12px 0 0;padding:32px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.12em;text-transform:uppercase">SECONCI Goiás · SST</p>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-.02em">${titulo}</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,.85)">${subtitulo}</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:32px 40px">
          ${blocosHtml}
          <p style="margin:28px 0 0;font-size:13px;color:#888888;text-align:center">
            Acesse o sistema para mais detalhes e ações necessárias.
          </p>
          <div style="text-align:center;margin-top:16px">
            <a href="https://gestao-documentos-theta.vercel.app" style="display:inline-block;background:#1B6B2F;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:11px 28px;border-radius:8px">Abrir sistema →</a>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9f9f9;border-top:1px solid #eeeeee;border-radius:0 0 12px 12px;padding:18px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#aaaaaa">${rodape}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendBrevo(recipients, subject, html, apiKey) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'SECONCI Goiás', email: 'jeanilquias12@gmail.com' },
      to: recipients.map(e => ({ email: e })),
      subject,
      htmlContent: html
    })
  });
  return r;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

  const notifyEmail = process.env.NOTIFY_EMAIL;
  const apiKey      = process.env.BREVO_API_KEY;

  if (!notifyEmail || !apiKey) {
    return res.status(500).json({ error: 'NOTIFY_EMAIL ou BREVO_API_KEY não configurados' });
  }

  const recipients = notifyEmail.split(',').map(e => e.trim()).filter(Boolean);
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  // Alerta imediato disparado ao salvar documento
  if (req.method === 'POST' && req.body && req.body._trigger === 'doc-save') {
    const { assunto, blocos, corHeader } = req.body;
    const html = htmlEmail({
      titulo: assunto.replace(/SECONCI[^—]*—\s*/, ''),
      subtitulo: hoje,
      corHeader: corHeader || '#1B6B2F',
      blocos: blocos || [],
      rodape: `SECONCI Goiás · Sistema de Gestão SST · ${hoje}`
    });
    const r = await sendBrevo(recipients, assunto, html, apiKey);
    const d = await r.json();
    return r.ok ? res.json({ success: true }) : res.status(500).json({ error: d.message || JSON.stringify(d) });
  }

  // Resumo diário (cron 7h Brasília / 10h UTC)
  const today = new Date().toISOString().slice(0, 10);
  const in90  = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const in30  = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  const diffDays = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);

  const [docsRes, clientesRes, contratosRes, avaliRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/documentos?select=id,tipo_documento,numero,data_vencimento,cliente_id,enviado_assessoria,data_envio_assessoria,data_inicio_elaboracao,data_retorno_assessoria`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/clientes?select=id,nome`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/contratos?select=id,qtd,doc_id,cliente_id`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/avaliacoes?select=contrato_id`, { headers })
  ]);

  if (!docsRes.ok || !clientesRes.ok) {
    const errBody = await docsRes.text().catch(() => '');
    return res.status(500).json({ error: 'Falha ao consultar Supabase', status: docsRes.status, detail: errBody });
  }

  let docs = [], clientes = [], contratos = [], avals = [];
  { const r = await docsRes.json();      docs      = Array.isArray(r) ? r : []; }
  { const r = await clientesRes.json();  clientes  = Array.isArray(r) ? r : []; }
  if (contratosRes.ok){ const r = await contratosRes.json(); contratos = Array.isArray(r) ? r : []; }
  if (avaliRes.ok)    { const r = await avaliRes.json();     avals     = Array.isArray(r) ? r : []; }

  const clienteMap = {};
  clientes.forEach(c => { clienteMap[c.id] = c.nome; });
  const nomeEmpresa = id => clienteMap[id] || '—';

  const vencidos = docs.filter(d => d.data_vencimento && d.data_vencimento < today);
  const vencendo = docs.filter(d => d.data_vencimento && d.data_vencimento >= today && d.data_vencimento <= in90);

  const ltcats = docs.filter(d =>
    d.tipo_documento === 'LTCAT' &&
    d.data_vencimento && d.data_vencimento >= today && d.data_vencimento <= in30
  );

  const artAlerts = [];
  for (const ltcat of ltcats) {
    const linked = contratos.find(c => c.doc_id === ltcat.id);
    if (!linked) continue;
    const realizadas = avals.filter(a => a.contrato_id === linked.id).length;
    const pendentes  = (linked.qtd || 0) - realizadas;
    if (pendentes > 0) artAlerts.push({ nome: nomeEmpresa(ltcat.cliente_id), pendentes, venceART: ltcat.data_vencimento });
  }

  // Fase 1 atrasada: elaboração iniciada há mais de 10 dias sem enviar à assessoria
  const fase1Atrasadas = docs.filter(d =>
    d.data_inicio_elaboracao &&
    !d.enviado_assessoria &&
    !d.data_retorno_assessoria &&
    diffDays(d.data_inicio_elaboracao, today) > 10
  );

  // Fase 2 atrasada: enviado à assessoria há mais de 5 dias sem retorno
  const fase2Atrasadas = docs.filter(d =>
    d.enviado_assessoria &&
    d.data_envio_assessoria &&
    !d.data_retorno_assessoria &&
    diffDays(d.data_envio_assessoria, today) > 5
  );

  const ok = !vencidos.length && !vencendo.length && !artAlerts.length && !fase1Atrasadas.length && !fase2Atrasadas.length;

  let assunto, corHeader, blocos;

  if (ok) {
    assunto   = 'SECONCI — ✅ Sem pendências hoje';
    corHeader = '#1B6B2F';
    blocos = [{
      icone: '✅', titulo: 'Tudo em dia', subtitulo: 'Nenhuma pendência encontrada hoje',
      corFundo: '#E8F5E9', corBorda: '#4CAF50', corTexto: '#2E7D32',
      linhas: ['Todos os documentos estão dentro do prazo de validade.']
    }];
  } else {
    corHeader = vencidos.length ? '#9B2A1A' : vencendo.length ? '#8A5A00' : fase1Atrasadas.length || fase2Atrasadas.length ? '#1565C0' : '#1B6B2F';
    assunto   = vencidos.length
      ? `SECONCI — 🚨 ${vencidos.length} documento(s) vencido(s)`
      : vencendo.length
        ? `SECONCI — ⏰ ${vencendo.length} documento(s) vencendo`
        : fase1Atrasadas.length || fase2Atrasadas.length
          ? `SECONCI — 📋 Elaboração de documento(s) em atraso`
          : `SECONCI — ⚠️ ${artAlerts.length} LTCAT(s) com avaliações pendentes`;

    blocos = [];

    if (vencidos.length) blocos.push({
      icone: '🚨', titulo: `${vencidos.length} documento(s) vencido(s)`, subtitulo: 'Renovação urgente necessária',
      corFundo: '#FCE6E2', corBorda: '#E53935', corTexto: '#9B2A1A',
      linhas: vencidos.map(d => `<b>${nomeEmpresa(d.cliente_id)}</b> — ${d.tipo_documento} &nbsp;·&nbsp; Venceu em <b>${fmtDate(d.data_vencimento)}</b>`)
    });

    if (vencendo.length) blocos.push({
      icone: '⏰', titulo: `${vencendo.length} documento(s) vencendo`, subtitulo: 'Vencimento nos próximos 90 dias',
      corFundo: '#FFF6E0', corBorda: '#FFA000', corTexto: '#8A5A00',
      linhas: vencendo.map(d => `<b>${nomeEmpresa(d.cliente_id)}</b> — ${d.tipo_documento} &nbsp;·&nbsp; Vence em <b>${fmtDate(d.data_vencimento)}</b>`)
    });

    if (artAlerts.length) blocos.push({
      icone: '⚠️', titulo: `${artAlerts.length} LTCAT(s) com avaliações pendentes`, subtitulo: 'ART vencendo em até 30 dias',
      corFundo: '#FFF3E0', corBorda: '#FB8C00', corTexto: '#7B4F00',
      linhas: artAlerts.map(a => `<b>${a.nome}</b> &nbsp;·&nbsp; ${a.pendentes} avaliação(ões) pendente(s) &nbsp;·&nbsp; ART vence em <b>${fmtDate(a.venceART)}</b>`)
    });

    if (fase1Atrasadas.length) blocos.push({
      icone: '📋', titulo: `${fase1Atrasadas.length} elaboração(ões) em atraso — Fase 1`, subtitulo: 'Prazo para envio à assessoria excedido (máx. 10 dias)',
      corFundo: '#E3F2FD', corBorda: '#1565C0', corTexto: '#0D47A1',
      linhas: fase1Atrasadas.map(d => {
        const dias = diffDays(d.data_inicio_elaboracao, today);
        return `<b>${nomeEmpresa(d.cliente_id)}</b> — ${d.tipo_documento} &nbsp;·&nbsp; Elaboração iniciada há <b>${dias} dias</b> sem envio à assessoria`;
      })
    });

    if (fase2Atrasadas.length) blocos.push({
      icone: '🩺', titulo: `${fase2Atrasadas.length} retorno(s) da assessoria em atraso — Fase 2`, subtitulo: 'Prazo para retorno da assessoria excedido (máx. 5 dias)',
      corFundo: '#F3E5F5', corBorda: '#6A1B9A', corTexto: '#4A148C',
      linhas: fase2Atrasadas.map(d => {
        const dias = diffDays(d.data_envio_assessoria, today);
        return `<b>${nomeEmpresa(d.cliente_id)}</b> — ${d.tipo_documento} &nbsp;·&nbsp; Enviado à assessoria há <b>${dias} dias</b> sem retorno`;
      })
    });
  }

  const html = htmlEmail({
    titulo: ok ? 'Sem pendências hoje' : 'Resumo de Pendências',
    subtitulo: `Relatório diário · ${hoje}`,
    corHeader,
    blocos,
    rodape: `SECONCI Goiás · Sistema de Gestão SST · ${hoje}`
  });

  const emailRes = await sendBrevo(recipients, assunto, html, apiKey);
  const data = await emailRes.json();
  if (emailRes.ok) {
    return res.status(200).json({ success: true, vencidos: vencidos.length, vencendo: vencendo.length, artAlerts: artAlerts.length, fase1Atrasadas: fase1Atrasadas.length, fase2Atrasadas: fase2Atrasadas.length });
  }
  return res.status(500).json({ error: data.message || JSON.stringify(data) });
};
