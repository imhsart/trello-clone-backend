require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { UserRouter } = require('./Routes/User.routes.js')
const { TaskRouter } = require('./Routes/Task.routes.js')
const cp = require('cookie-parser')
const cors = require('cors')
const {errorHandler} = require('./Middlewares/errorHandler.js')


const app = express()
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  origin: ['http://localhost:5173', "https://taskflow-vwwb.onrender.com"],
  credentials: true
}))
app.use(express.json())
app.use(cp())
app.use("/api/users",UserRouter)
app.use("/api/tasks", TaskRouter)
const PORT = process.env.PORT || 8080
app.use(errorHandler)




mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Database connected successfully...')

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})
.catch(error => console.log('Connection Error:', error))
