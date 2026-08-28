const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    trim: true,
    maxlength: 35
  },
  description: {
    type: String, 
    trim: true,
    required: true,
    maxlength: 150
  },
  priority: {
    type: String,
    enum: {
      values: ["low", "medium", "high"],
      message: "{VALUE} is not a valid priority type"
    },
    default: "low"
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "inprogress", "complete"],
      message: "{VALUE} is not a valid status type"
    },
    default: "pending"
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    immutable: true,
    required: true
  }

}, {timestamps: true})

const Task = mongoose.model('Task', TaskSchema)
module.exports = {
  Task
}