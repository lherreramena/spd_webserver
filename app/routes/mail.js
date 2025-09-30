const express = require('express');
const { sendMail } = require('../mailer');
const router = express.Router();

router.post('/send-mail', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await sendMail(to, subject, text);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar correo', details: err });
  }
});

module.exports = router;
