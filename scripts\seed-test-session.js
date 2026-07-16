// Windows a veces usa un DNS del sistema que rompe la búsqueda de registros SRV
// (mongodb+srv://); forzamos un DNS público solo para este script de prueba local.
require("dns").setServers(["8.8.8.8"]);

const { connectDB, VerifySession } = require("../lib/db");

async function main() {
  const [guildId, userId, roleId] = process.argv.slice(2);

  if (!guildId || !userId || !roleId) {
    console.error(
      "Uso: node --env-file=.env scripts/seed-test-session.js <guildId> <userId> <roleId>"
    );
    process.exit(1);
  }

  await connectDB();

  const token = "test-" + Math.random().toString(36).slice(2, 10);

  await VerifySession.create({
    token,
    guildId,
    userId,
    roleId,
    used: false,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  console.log(`Sesión creada. Abre: http://localhost:3000/verify/${token}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
