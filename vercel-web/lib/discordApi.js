const API = "https://discord.com/api/v10";

async function exchangeCode(code) {
  const res = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }),
  });
  return res.json();
}

async function getCurrentUser(accessToken) {
  const res = await fetch(`${API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

// Estas dos usan el Bot Token (no el access token del usuario) porque
// ya no tenemos el cliente de discord.js en memoria como en el servidor Express original.
async function getMember(guildId, userId) {
  const res = await fetch(`${API}/guilds/${guildId}/members/${userId}`, {
    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRole(guildId, roleId) {
  const res = await fetch(`${API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
  });
  if (!res.ok) return null;
  const roles = await res.json();
  return roles.find((r) => r.id === roleId) || null;
}

async function addRole(guildId, userId, roleId) {
  const res = await fetch(
    `${API}/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    }
  );
  return res.ok;
}

async function verifyCaptcha(token) {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    }),
  });
  return res.json();
}

module.exports = {
  exchangeCode,
  getCurrentUser,
  getMember,
  getRole,
  addRole,
  verifyCaptcha,
};
