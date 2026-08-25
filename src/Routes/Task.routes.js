const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedInMiddleware.js")
const { Task } = require("../Models/Task.schema.js")


//create task api

router.post("/create", isLoggedIn, async (req, res, next) => {
  try{
    const {title, description, priority, status} = req.body
    if(!title.trim() || !description.trim() || !priority.trim() || !status.trim()){
      throw new Error("Please enter all values.")
    }
    if(title.trim().length > 35){
      throw new Error("Max length of title must be atmost 35 characters.")
    }
    if(description.trim().length > 100){
      throw new Error("Max length of description must be atmost 100 characters.")
    }
    const newTask = await Task.create({
      title,
      description,
      priority,
      status,
      author: req.user._id
    })
    res.status(201).json({
      message: "Task created successfully!",
      data: newTask
    })
  }
  catch(error){
    next(error)
  }
})


//get all tasks api

router.get("/get", isLoggedIn, async (req, res, next) => {
  try{
    const allTasks = await Task.find({
      author: req.user._id
    })
    res.status(200).json({
      data: allTasks
    })
  }
  catch(error){
    next(error)
  }
})


//get particular task api

router.get("/get/:id", isLoggedIn, async (req, res, next) => {
  try{
    const { id } = req.params
    const foundTask = await Task.findOne({
      _id: id,
      author: req.user._id
    })
    if(!foundTask){
      throw new Error("Task does not exist!")
    }
    res.status(200).json({
      data: foundTask
    })
  }
  catch(error){
    next(error)
  }
})

// delete task api

router.delete("/delete/:id", isLoggedIn, async (req, res, next) => {
  try{
    const { id } = req.params
    const deletedTask = await Task.deleteOne({
      _id: id,
      author: req.user._id
    })
    if(deletedTask.deletedCount === 0){
      throw new Error("No task found!")
    }
    res.status(200).json({
      message: "Task deleted successfully!"
    })
  }
  catch(error){
    next(error)
  }
})

//update task api

router.patch("/update/:id", isLoggedIn, async (req, res, next) => {
  try{
    const { id } = req.params
    const { title, description, priority, status } = req.body
    if(!title.trim() || !description.trim() || !priority.trim() || !status.trim()){
      throw new Error("Please enter all fields!")
    }
    const updatedTask = await Task.findOneAndUpdate({
      _id: id,
      author: req.user._id
    }, {
      title,
      description,
      priority,
      status
    }, {
      returnDocument: "after",
      runValidators: true
    })
    res.status(200).json({
      message: "Updated the task successfully!",
      data: updatedTask
    })
  }
  catch(error){
    next(error)
  }
})


module.exports = {
  TaskRouter: router
}