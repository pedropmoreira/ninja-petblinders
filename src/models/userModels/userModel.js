const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    vendedor: Boolean,
    image_url: { type: String, required: false },
});

module.exports = mongoose.model('User', UserSchema);
