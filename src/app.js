require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { User } = require('./Models/User.schema.js')
const { UserRouter } = require('./Routes/User.routes.js')


const app = express()
app.use(express.json())
app.use("/api/users",UserRouter)
const PORT = process.env.PORT || 8080





mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Database connected successfully...')

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})
.catch(error => console.log('Connection Error:', error))
