const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim: true,
    maxLength: 35
  },
  description: {
    type: String, 
    trim: true,
    required: true,
    maxLength: 100
  },
  priority: {
    type: String,
    enum: {
      value: ["low", "medium", "high"],
      message: "{VALUE} is not a valid priority type"
    },
    default: "low"
  },
  status: {
    type: String,
    enum: {
      value: ["pending", "inprogress", "complete"],
      message: "{VALUE} is not a valid status type"
    },
    default: "pending"
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    immutable: true
  }

}, {timestamps: true})

const Task = mongoose.model('Task', TaskSchema)
module.exports = {
  Task
}