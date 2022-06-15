const { Schema, model, default: mongoose } = require('mongoose');
mongoose.connect(process.env.MONGOURI)

const User = model('user', new Schema({
    name: { type: String, unique: true, required: true },
    unitPrice: { type: Number, default: 0 },
}, { timestamps: false }));

module.exports = User


