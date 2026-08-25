const express = require('express')
const { User } = require('../Models/User.schema')
const router = express.Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { isLoggedIn } = require('../Middlewares/isLoggedInMiddleware.js')


//signup api

router.post("/signup", async (req, res, next) => {
  try{
    const {firstname, lastname, username, email, password, DOB, gender} = req.body

    //validate important fields
    const isValidDate = validator.isDate(DOB, {
      format: 'YYYY-MM-DD'
    })
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
    next(error)
  }
})

//login api

router.post("/login", async (req, res, next) => {
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
    let token = jsonwebtoken.sign({_id: isUserFound._id}, process.env.JWT_SECRET_KEY, {expiresIn: "2d"})
    res.status(200).cookie("token", token, {
      secure : true,
      httpOnly : true,
      sameSite : "strict",
      maxAge: 48 * 60 * 60 * 1000
    }).json({message: "User logged in successfully!"})
  }
  catch(error){
    next(error)
  }
})

//logout api

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    secure : true,
    httpOnly : true,
    sameSite : "strict",
    maxAge: 0
  }).json({"message": "Logged out successfully!"})
})


// user details edit api

router.patch("/edit",isLoggedIn, async (req, res, next) => {
  try{
    const loggedInUser = req.user
    const { username, profilePicture, organization } = req.body
    const updateData = {}
    if(username?.trim()){
      updateData.username = username.trim()
    }
    if(profilePicture?.trim()){
      updateData.profilePicture = profilePicture.trim()
    }
    if(organization?.trim()){
      updateData.organization = organization.trim()
    }
    if(Object.keys(updateData).length === 0){
      throw new Error("Please provide at least one field to update!")
    }
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      updateData, 
    {
      returnDocument: "after",
      runValidators: true
    })

    res.status(200).json({
      "message": "Updated details successfully!",
      "data": updateData
    })
  }
  catch(error){
    next(error)
  }
})

//change password api

router.patch("/change-pass", isLoggedIn, async (req, res, next) => {
  try{
    const {oldPassword, newPassword} = req.body
    const loggedInUser = req.user
    let isPassMatched = await bcrypt.compare(oldPassword, loggedInUser.password)
    if(!isPassMatched){
      throw new Error("Password does not match. Try again!")
    }
    const isStrongNewPass = validator.isStrongPassword(newPassword)
    if(!isStrongNewPass){
      throw new Error("Please create a strong new password.")
    }
    const isSamePass = await bcrypt.compare(newPassword, loggedInUser.password)
    if(isSamePass){
      throw new Error("New password must be different from your current password!")
    }
    const saltRounds = 10
    const newHashedPass = await bcrypt.hash(newPassword, saltRounds)
    loggedInUser.password = newHashedPass
    await loggedInUser.save()
    res.cookie("token", null, {
      secure : true,
      httpOnly : true,
      sameSite : "strict",
      maxAge: 0
    }).status(200).json({
      message: "Password changed successfully."
    })
  }catch(error){
    next(error)
  }
})

//get user data

router.get("/get-user-data", isLoggedIn, (req, res, next) => {
  try{
    const { firstname, lastname, username, email, profilePicture, DOB, gender, organization, createdAt } = req.user
    res.status(200).json({
      data: {
        firstname,
        lastname, 
        username, 
        email,
        profilePicture,
        DOB,
        gender,
        organization,
        createdAt
      }
    })
  }
  catch(error){
    next(error)
  }
})


//export router
module.exports = {
  UserRouter: router
}