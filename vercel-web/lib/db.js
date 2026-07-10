const mongoose = require("mongoose");

// En serverless (Vercel) cada invocación puede reutilizar el mismo contenedor,
// así que cacheamos la conexión en `global` para no reconectar en cada request.
let cached = global._kobotMongooseCache;
if (!cached) {
  cached = global._kobotMongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Falta la variable de entorno MONGO_URI");

    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const VerifySessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    roleId: { type: String, required: true },
    used: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Evita el error "OverwriteModelError" cuando la función se reutiliza (warm start)
const VerifySession =
  mongoose.models.VerifySession ||
  mongoose.model("VerifySession", VerifySessionSchema);

module.exports = { connectDB, VerifySession };
