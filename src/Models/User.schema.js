const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String, 
    minLength: 2,
    maxLength: 15,
    required: true,
    trim: true,
    immutable: true
  },
  lastname: {
    type: String,
    minLength: 3,
    required: true,
    maxLength: 15,
    trim: true,
    immutable: true
  },
  username: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 20,
    unique: true,
    trim: true
  }, 
  email: {
    type: String,
    trim: true,
    unique: true,
    maxLength: 40,
    required: true,
    minLength: 12
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profile_pic: {
    type: String,
    trim: true
  },
  tasks: [],
  DOB: {
    type: String,
    required: true,
    trim: true
  }, 
  gender: {
    enum: {
       values: ["male", "female", "others"],
       message: '{VALUE} is not a valid gender'
    },
    required: true
  }, 
  organization: {
    type: String,
    trim: true,
    maxLength: 50,
    minLength: 5
  }
}, {timestamps: true})

const User = mongoose.Model('User', UserSchema)
module.exports = {
  User
}