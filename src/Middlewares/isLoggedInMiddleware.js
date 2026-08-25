const jwt = require("jsonwebtoken")
const { User } = require("../Models/User.schema.js")


const isLoggedIn = async (req, res, next) => {
  try{
    const {token} = req.cookies
    if(!token){
      throw new Error("Please login again!")
    }
    const jwtObj = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const foundUser = await User.findById(jwtObj._id)
    if(!foundUser){
      throw new Error("Please login again!")
    }
    req.user = foundUser
    next()
  }
  catch(error){
    res.status(401).json({
      "message": error.message
    })
  }
}

module.exports = {
  isLoggedIn
}