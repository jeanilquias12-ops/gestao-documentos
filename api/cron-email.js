const SUPABASE_URL = 'https://jpmhnlorbrtjeesknwbl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J3BY43oX5VIrIdj7qo-TIQ_z7ylupDy';

const fmtDate = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

async function sendBrevo(recipients, subject, message, apiKey) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'SECONCI Goiás', email: 'jeanilquias12@gmail.com' },
      to: recipients.map(e => ({ email: e })),
      subject,
      textContent: message
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

  // Alerta imediato disparado ao salvar documento
  if (req.method === 'POST' && req.body && req.body._trigger === 'doc-save') {
    const { assunto, message } = req.body;
    const r = await sendBrevo(recipients, assunto, message, apiKey);
    const d = await r.json();
    return r.ok ? res.json({ success: true }) : res.status(500).json({ error: d.message || JSON.stringify(d) });
  }

  // Resumo diário (cron 7h Brasília / 10h UTC)
  const today = new Date().toISOString().slice(0, 10);
  const in90  = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const in30  = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  // Queries separadas — sem join FK para evitar crash quando relacionamento não está definido
  const [docsRes, clientesRes, contratosRes, avaliRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/documentos?select=id,tipo_documento,numero,data_vencimento,cliente_id`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/clientes?select=id,nome`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/contratos?select=id,qtd,doc_id,cliente_id`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/avaliacoes?select=contrato_id`, { headers })
  ]);

  // Verificar se cada resposta é válida antes de processar
  let docs = [], clientes = [], contratos = [], avals = [];

  if (docsRes.ok) {
    const raw = await docsRes.json();
    docs = Array.isArray(raw) ? raw : [];
    if (!Array.isArray(raw)) console.error('Erro na query documentos:', JSON.stringify(raw));
  } else {
    console.error('Falha HTTP ao buscar documentos:', docsRes.status);
  }

  if (clientesRes.ok) {
    const raw = await clientesRes.json();
    clientes = Array.isArray(raw) ? raw : [];
  }

  if (contratosRes.ok) {
    const raw = await contratosRes.json();
    contratos = Array.isArray(raw) ? raw : [];
  }

  if (avaliRes.ok) {
    const raw = await avaliRes.json();
    avals = Array.isArray(raw) ? raw : [];
  }

  // Mapa de clientes para lookup por id
  const clienteMap = {};
  clientes.forEach(c => { clienteMap[c.id] = c.nome; });
  const nomeEmpresa = id => clienteMap[id] || '—';

  const vencidos = docs.filter(d => d.data_vencimento && d.data_vencimento < today);
  const vencendo = docs.filter(d => d.data_vencimento && d.data_vencimento >= today && d.data_vencimento <= in90);

  // ARTs de LTCAT vencendo em ≤30 dias com avaliações pendentes
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
    if (pendentes > 0) {
      artAlerts.push({
        nome:      nomeEmpresa(ltcat.cliente_id),
        pendentes,
        venceART:  ltcat.data_vencimento
      });
    }
  }

  const ok = !vencidos.length && !vencendo.length && !artAlerts.length;

  let assunto;
  if (ok) {
    assunto = 'SECONCI — ✅ Sem pendências hoje';
  } else if (vencidos.length) {
    assunto = `SECONCI — 🚨 ${vencidos.length} documento(s) vencido(s)`;
  } else if (vencendo.length) {
    assunto = `SECONCI — ⏰ ${vencendo.length} documento(s) vencendo`;
  } else {
    assunto = `SECONCI — ⚠️ ${artAlerts.length} LTCAT(s) com avaliações pendentes`;
  }

  let message = `Resumo diário SECONCI — ${fmtDate(today)}\n\n`;
  if (ok) {
    message += '✅ Todos os documentos estão em dia.';
  } else {
    if (vencidos.length) {
      message += `🚨 VENCIDOS (${vencidos.length}):\n`;
      vencidos.forEach(d => {
        message += `• ${nomeEmpresa(d.cliente_id)} — ${d.tipo_documento} ${d.numero || ''} (venceu ${fmtDate(d.data_vencimento)})\n`;
      });
      message += '\n';
    }
    if (vencendo.length) {
      message += `⏰ VENCENDO EM 90 DIAS (${vencendo.length}):\n`;
      vencendo.forEach(d => {
        message += `• ${nomeEmpresa(d.cliente_id)} — ${d.tipo_documento} ${d.numero || ''} (vence ${fmtDate(d.data_vencimento)})\n`;
      });
      message += '\n';
    }
    if (artAlerts.length) {
      message += `⚠️ AVALIAÇÕES PENDENTES (ART vence em ≤30 dias):\n`;
      artAlerts.forEach(a => {
        message += `• ${a.nome} — ${a.pendentes} avaliação(ões) pendente(s) (ART vence ${fmtDate(a.venceART)})\n`;
      });
    }
  }

  const emailRes = await sendBrevo(recipients, assunto, message, apiKey);
  const data = await emailRes.json();
  if (emailRes.ok) {
    return res.status(200).json({ success: true, vencidos: vencidos.length, vencendo: vencendo.length, artAlerts: artAlerts.length });
  }
  return res.status(500).json({ error: data.message || JSON.stringify(data) });
};
