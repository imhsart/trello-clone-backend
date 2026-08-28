const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String, 
    minlength: 2,
    maxlength: 15,
    required: true,
    trim: true,
    immutable: true
  },
  lastname: {
    type: String,
    minlength: 3,
    required: true,
    maxlength: 15,
    trim: true,
    immutable: true
  },
  username: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s]+$/, "Username cannot contain spaces"]
  }, 
  email: {
    type: String,
    trim: true,
    unique: true,
    maxlength: 40,
    required: true,
    minlength: 12,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    trim: true
  },
  DOB: {
    type: String,
    required: true,
    trim: true,
    immutable: true
  }, 
  gender: {
    type: String,
    enum: {
       values: ["male", "female", "others"],
       message: '{VALUE} is not a valid gender'
    },
    required: true,
    immutable: true
  }, 
  organization: {
    type: String,
    trim: true,
    maxlength: 50,
    minlength: 5
  }
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)
module.exports = {
  User
}