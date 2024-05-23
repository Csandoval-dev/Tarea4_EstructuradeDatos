const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
