const SUPABASE_URL = 'https://jpmhnlorbrtjeesknwbl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J3BY43oX5VIrIdj7qo-TIQ_z7ylupDy';

const fmtDate = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default async function handler(req, res) {
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const resendKey   = process.env.RESEND_API_KEY;

  if (!notifyEmail || !resendKey) {
    return res.status(500).json({ error: 'NOTIFY_EMAIL ou RESEND_API_KEY não configurados' });
  }

  const today = new Date().toISOString().slice(0, 10);
  const in90  = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const docsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/documentos?select=tipo_documento,numero,data_vencimento,clientes(nome)`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const docs = await docsRes.json();

  const vencidos = docs.filter(d => d.data_vencimento && d.data_vencimento < today);
  const vencendo = docs.filter(d => d.data_vencimento && d.data_vencimento >= today && d.data_vencimento <= in90);
  const ok       = !vencidos.length && !vencendo.length;

  const assunto = ok
    ? 'SECONCI — ✅ Sem pendências hoje'
    : vencidos.length
      ? `SECONCI — 🚨 ${vencidos.length} documento(s) vencido(s)`
      : `SECONCI — ⏰ ${vencendo.length} documento(s) vencendo`;

  let message = `Resumo diário SECONCI — ${fmtDate(today)}\n\n`;
  if (ok) {
    message += '✅ Todos os documentos estão em dia.';
  } else {
    if (vencidos.length) {
      message += `🚨 VENCIDOS (${vencidos.length}):\n`;
      vencidos.forEach(d => {
        message += `• ${d.clientes?.nome || '—'} — ${d.tipo_documento} ${d.numero || ''} (venceu ${fmtDate(d.data_vencimento)})\n`;
      });
      message += '\n';
    }
    if (vencendo.length) {
      message += `⏰ VENCENDO EM 90 DIAS (${vencendo.length}):\n`;
      vencendo.forEach(d => {
        message += `• ${d.clientes?.nome || '—'} — ${d.tipo_documento} ${d.numero || ''} (vence ${fmtDate(d.data_vencimento)})\n`;
      });
    }
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'SECONCI Goiás <onboarding@resend.dev>',
      to:   [notifyEmail],
      subject: assunto,
      text: message
    })
  });

  const data = await emailRes.json();
  if (emailRes.ok) {
    return res.status(200).json({ success: true, vencidos: vencidos.length, vencendo: vencendo.length });
  }
  return res.status(500).json({ error: data.message });
}
