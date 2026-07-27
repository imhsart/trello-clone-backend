const express = require('express')
const { User } = require('../Models/User.schema')
const router = express.Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')


//signup api

router.post("/signup", async (req, res) => {
  try{
    const {firstname, lastname, username, email, password, DOB, gender} = req.body

    //validate important fields
    const isValidDate = validator.isDate(DOB)
    if(!isValidDate){
      throw new Error ("Please enter a valid date of birth")
    }
    const isValidatePass = validator.isStrongPassword(password)
    if(!isValidatePass){
      throw new Error ("Please enter a strong password")
    }
    const isValidEmail = validator.isEmail(email)
    if(!isValidEmail){
      throw new Error("Please enter a valid email")
    }

    //hashing password
    const saltRounds = 10
    const hashedPass = await bcrypt.hash(password, saltRounds)
    const newUser = await User.create({firstname, lastname, username, email, password: hashedPass, DOB, gender})
    res.status(201).json({
      message: "User created successfully!"
    })
  }catch(error){
    res.status(400).json({'Endpoint error': error.message})
  }
})

//login api

router.post("/login", async (req, res) => {
  try{
    const {username, email, password} = req.body

    //check existing user
    const isUserFound = await User.findOne({
      $or : [
        {username},
        {email}
      ]
    })
    if(!isUserFound){
      throw new Error("User not found!")
    }

    //check password 
    const isPasswordCorrect = await bcrypt.compare(password, isUserFound.password)
    if(!isPasswordCorrect){
      throw new Error("Invalid Credentials!")
    }
    
    //generate token
    let token = jsonwebtoken.sign({_id: isUserFound._id}, process.env.JWT_SECRET_KEY)
    res.status(200).cookie("token", token).json({message: "User logged in successfully!"})
  }
  catch(error){
    res.status(400).json({"Endpoint error:": error.message})
  }
})

//logout api

router.post("/logout", async (req, res) => {
  res.cookie("token", null).json({"message": "Logged out successfully!"})
})



module.exports = {
  UserRouter: router
}