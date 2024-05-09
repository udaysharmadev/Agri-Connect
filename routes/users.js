const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/Agriconnect");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  dp: {
    type: String,
    default: 'default_dp.jpg'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  username: String,
  userType: {
      type: String,
      enum: ['Farmer', 'Retailer']
  }
});


userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);

