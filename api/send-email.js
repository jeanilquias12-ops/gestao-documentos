function htmlEmailSimples({ titulo, subtitulo, corHeader, icone, corFundo, corBorda, corTexto, linhas }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f1;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <tr><td style="background:${corHeader};border-radius:12px 12px 0 0;padding:32px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.12em;text-transform:uppercase">SECONCI Goiás · SST</p>
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff">${titulo}</h1>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,.85)">${subtitulo}</p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:32px 40px">
          <div style="background:${corFundo};border-left:4px solid ${corBorda};border-radius:6px;padding:14px 18px;margin-bottom:20px">
            <p style="margin:0;font-size:13px;font-weight:700;color:${corTexto}">${icone} ${titulo}</p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            ${linhas.map((l, i) => `
              <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9f9f9'}">
                <td style="padding:10px 14px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333">${l}</td>
              </tr>
            `).join('')}
          </table>
          <div style="text-align:center;margin-top:24px">
            <a href="https://gestao-documentos-theta.vercel.app" style="display:inline-block;background:#1B6B2F;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:11px 28px;border-radius:8px">Abrir sistema →</a>
          </div>
        </td></tr>

        <tr><td style="background:#f9f9f9;border-top:1px solid #eeeeee;border-radius:0 0 12px 12px;padding:16px 40px;text-align:center">
          <p style="margin:0;font-size:11px;color:#aaaaaa">SECONCI Goiás · Sistema de Gestão SST</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subject, message } = req.body || {};
  if (!subject || !message) {
    return res.status(400).json({ error: 'subject e message são obrigatórios' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const to     = process.env.NOTIFY_EMAIL;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY não configurada' });
  if (!to)     return res.status(500).json({ error: 'NOTIFY_EMAIL não configurado' });

  // Detectar tipo pelo assunto para colorir adequadamente
  const isVencido  = subject.includes('🚨') || subject.includes('vencido');
  const isVencendo = subject.includes('⏰') || subject.includes('vencendo');
  const corHeader  = isVencido ? '#9B2A1A' : isVencendo ? '#8A5A00' : '#1B6B2F';
  const corFundo   = isVencido ? '#FCE6E2' : isVencendo ? '#FFF6E0' : '#E8F5E9';
  const corBorda   = isVencido ? '#E53935' : isVencendo ? '#FFA000' : '#4CAF50';
  const corTexto   = isVencido ? '#9B2A1A' : isVencendo ? '#8A5A00' : '#2E7D32';
  const icone      = isVencido ? '🚨' : isVencendo ? '⏰' : '📋';

  // Converter texto simples em linhas HTML
  const linhas = message.split('\n').filter(l => l.trim()).map(l =>
    l.startsWith('•') ? l.replace('•', '').trim() : `<b>${l}</b>`
  );

  const html = htmlEmailSimples({
    titulo:    subject.replace(/SECONCI[^—]*—\s*/, ''),
    subtitulo: new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }),
    corHeader, corFundo, corBorda, corTexto, icone, linhas
  });

  const recipients = to.split(',').map(e => e.trim()).filter(Boolean);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'SECONCI Goiás', email: 'jeanilquias12@gmail.com' },
      to: recipients.map(e => ({ email: e })),
      subject,
      htmlContent: html
    })
  });

  const data = await response.json();
  if (response.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: data.message || JSON.stringify(data) });
  }
};
