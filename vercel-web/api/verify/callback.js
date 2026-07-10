const { connectDB, VerifySession } = require("../../lib/db");
const { exchangeCode, getCurrentUser } = require("../../lib/discordApi");
const { layout } = require("../../lib/page");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { code, state } = req.query;

  if (!code || !state) {
    res
      .status(400)
      .send(
        layout(
          "Solicitud inválida",
          `<div class="logo">❌</div><h1>Solicitud inválida</h1><p>Faltan datos de autenticación.</p>`
        )
      );
    return;
  }

  await connectDB();

  const session = await VerifySession.findOne({ token: state, used: false });

  if (!session) {
    res
      .status(404)
      .send(
        layout(
          "Enlace inválido",
          `<div class="logo">❌</div><h1>Enlace inválido</h1><p>No se encontró una sesión válida para este enlace.</p>`
        )
      );
    return;
  }

  if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
    res
      .status(410)
      .send(
        layout(
          "Enlace expirado",
          `<div class="logo">⏰</div><h1>Enlace expirado</h1><p>Este enlace ya expiró. Vuelve a generar uno desde Discord.</p>`
        )
      );
    return;
  }

  const tokenData = await exchangeCode(code);

  if (!tokenData.access_token) {
    res
      .status(400)
      .send(
        layout(
          "Error OAuth",
          `<div class="logo">❌</div><h1>Error iniciando sesión</h1><p>No se pudo validar tu cuenta de Discord.</p>`
        )
      );
    return;
  }

  const user = await getCurrentUser(tokenData.access_token);

  if (!user || user.id !== session.userId) {
    res
      .status(403)
      .send(
        layout(
          "Cuenta incorrecta",
          `<div class="logo">⚠️</div><h1>Cuenta incorrecta</h1><p>Debes iniciar sesión con la misma cuenta que presionó el botón de verificación en Discord.</p>`
        )
      );
    return;
  }

  res.status(200).send(
    layout(
      "Captcha",
      `<div class="logo">🔐</div>
      <h1>Verificación KoBot</h1>
      <p>Completa el captcha para recibir acceso al servidor.</p>

      <form method="POST" action="/verify/${session.token}">
        <div class="captcha">
          <div class="g-recaptcha" data-sitekey="${process.env.RECAPTCHA_SITE_KEY}"></div>
        </div>

        <button type="submit">Verificarme</button>
      </form>

      <p class="small">Protegido por KoBot • Google reCAPTCHA</p>`
    )
  );
};
