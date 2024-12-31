const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { tyoe: String, require: true },
  email: { tyoe: String, require: true, unique: true },
  password: { tyoe: String, require: true },
  isAdmin: { tyoe: Boolean, default: false, require: true },
  phone: { tyoe: Number, require: true },
  access_token: { tyoe: String, require: true },
  refresh_token: { tyoe: String, require: true },
},
{
    timestamps:true
}
);
const User = mongoose.model('User', userSchema);
module.exports = User;