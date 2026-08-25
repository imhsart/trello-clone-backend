const errorHandler = (err, req, res, next) => {
  //mongo duplicate key error
  if(err.code === 11000){
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    return res.status(409).json({
      message: `${field} "${value}" already exists.`
    })
  }

  //mongoose validation error
  if(err.name === "ValidationError"){
    const messages = Object.values(err.errors).map(error => error.message)

    return res.status(400).json({
      message: messages.join(" ")
    })
  }

  //mongoose invalid ObjectId
  if(err.name === "CastError"){
    return res.status(400).json({
      message: "Invalid ID."
    })
  }

  return res.status(400).json({
    message: err.message || "Something went wrong!"
  })
}

module.exports = {
  errorHandler
}