const jwt = require("jsonwebtoken")
const { User } = require("../Models/User.schema.js")


const isLoggedIn = async (req, res, next) => {
  try{
    const {token} = req.cookies
    const jwtObj = jwt.decode(token, process.env.JWT_SECRET_KEY)
    if(!jwtObj){
      throw new Error("Please login again!")
    }
    const foundUser = await User.findById(jwtObj._id)
    if(!foundUser){
      throw new Error("Please login again!")
    }
    req.user = foundUser
    next()
  }
  catch(error){
    res.status(404).json({
      "Error message": error.message
    })
  }
}

module.exports = {
  isLoggedIn
}