const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String },
  nascimento: { type: String },
  sexo: { type: String },
  plano: { type: String, default: "Free" },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
