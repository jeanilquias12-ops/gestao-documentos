module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, subject, message } = req.body || {};
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'to, subject e message são obrigatórios' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'BREVO_API_KEY não configurada' });

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'SECONCI Goiás', email: 'jeanilquias12@gmail.com' },
      to: [{ email: to }],
      subject,
      textContent: message
    })
  });

  const data = await response.json();
  if (response.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: data.message || JSON.stringify(data) });
  }
};
