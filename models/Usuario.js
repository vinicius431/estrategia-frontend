const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String },
  nascimento: { type: String },
  sexo: { type: String },
  plano: { type: String, default: "Free" },

  // 🔗 Integração com Instagram/Facebook
  instagramAccessToken: { type: String },
  instagramBusinessId: { type: String },
  facebookPageId: { type: String },
  tokenExpiresAt: { type: Date },
  instagramName: { type: String }, // ✅ Nome do perfil do Instagram conectado
  paginaAccessToken: String,
});

module.exports = mongoose.model("Usuario", usuarioSchema);
