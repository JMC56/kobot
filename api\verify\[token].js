const { connectDB, VerifySession } = require("../../lib/db");
const {
  verifyCaptcha,
  getMember,
  getRole,
  addRole,
} = require("../../lib/discordApi");
const { layout } = require("../../lib/page");

module.exports = async function handler(req, res) {
  const { token } = req.query;

  await connectDB();

  const session = await VerifySession.findOne({ token, used: false });

  if (!session) {
    res
      .status(404)
      .send(
        layout(
          "Enlace inválido",
          `<div class="logo"><img src="/kobotx.png" alt=""></div><h1>Enlace inválido</h1><p>Este enlace no existe o ya fue usado.</p>`
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
          `<div class="logo"><img src="/icon_cargando.gif" alt=""></div><h1>Enlace expirado</h1><p>Este enlace ya expiró. Vuelve a generar uno desde Discord.</p>`
        )
      );
    return;
  }

  // Paso 1: el usuario abre el link -> lo mandamos a iniciar sesión con Discord
  if (req.method === "GET") {
    const url =
      "https://discord.com/oauth2/authorize" +
      `?client_id=${process.env.CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
      "&response_type=code" +
      "&scope=identify" +
      `&state=${token}`;

    res.writeHead(302, { Location: url });
    res.end();
    return;
  }

  // Paso 3: el usuario envía el formulario del captcha
  if (req.method === "POST") {
    const captchaToken = req.body && req.body["cf-turnstile-response"];

    if (!captchaToken) {
      res
        .status(400)
        .send(
          layout(
            "Captcha requerido",
            `<div class="logo"><img src="/kobot-warning.png" alt=""></div><h1>Captcha requerido</h1><p>Debes marcar la casilla antes de continuar.</p><a class="btn" href="/verify/${session.token}">Intentar de nuevo</a>`
          )
        );
      return;
    }

    const captchaData = await verifyCaptcha(captchaToken);

    if (!captchaData.success) {
      res
        .status(400)
        .send(
          layout(
            "Captcha inválido",
            `<div class="logo"><img src="/kobotx.png" alt=""></div><h1>Captcha inválido</h1><p>No se pudo validar el captcha.</p><a class="btn" href="/verify/${session.token}">Intentar de nuevo</a>`
          )
        );
      return;
    }

    const [member, role] = await Promise.all([
      getMember(session.guildId, session.userId),
      getRole(session.guildId, session.roleId),
    ]);

    if (!member || !role) {
      res
        .status(404)
        .send(
          layout(
            "Error",
            `<div class="logo"><img src="/kobotx.png" alt=""></div><h1>No se pudo entregar el rol</h1><p>El usuario o el rol configurado no existe.</p>`
          )
        );
      return;
    }

    const ok = await addRole(session.guildId, session.userId, session.roleId);

    if (!ok) {
      res
        .status(500)
        .send(
          layout(
            "Error",
            `<div class="logo"><img src="/kobotx.png" alt=""></div><h1>No se pudo entregar el rol</h1><p>Revisa que el rol del bot esté por encima del rol de verificación en la jerarquía de Discord.</p>`
          )
        );
      return;
    }

    session.used = true;
    await session.save();

    res
      .status(200)
      .send(
        layout(
          "Verificado",
          `<div class="logo"><img src="/kobotok.svg" alt=""></div><h1>Verificación completada</h1><p>Has sido verificado correctamente y ya recibiste el rol en Discord.</p><p class="small">Puedes cerrar esta página.</p>`
        )
      );
    return;
  }

  res.status(405).send("Method Not Allowed");
};
