export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, message } = req.body || {};
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'to, subject e message são obrigatórios' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY não configurada' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'SECONCI Goiás <onboarding@resend.dev>',
      to: [to],
      subject,
      text: message
    })
  });

  const data = await response.json();
  if (response.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: data.message || 'Erro ao enviar' });
  }
}
