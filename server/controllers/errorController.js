const AppError = require('./../utils/AppError')
const handleCastErrorDB = (err)=>{
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleduplicateFieldErrorDB = (err)=>{
    // console.log("error message", err.errmsg)
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//    const value = 'dd'
    console.log(value);
  
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

const handleValidationError =(err)=>{
    const errors = Object.values(err.errors).map(el=>el.message)
    const message = `Invalid input data ${errors}.join(', ')`


    return new AppError(message,400)

}

const handleJsonWebTokenError = ()=> new AppError('Invalid Token. Please log in again', 401)

const handleTokenExpiredError = ()=> new AppError('Your token is expired. pleae login again', 401);

const sendErrorProd = (err, res)=>{
    // Operational, trusted Error: send message to clientdventurer 1
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
           
    
        })

    // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        // console.log("Error", err)

        // 2) Send generic message
        res.status(500).json({
            status: "Error",
            message:"Something happened Unexpectedly. Our Engineers take care of that"
    
        })
    }
}
const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack

    })
}

module.exports = (err, req, res, next) => {
    // console.log(err, 'adisseeeeeeeeeeeeee')
    // console.log(err.name)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Error'

    if(process.env.NODE_DEV === 'development'){
        console.log("...............error in developemtn .......\n")
        console.log(err)
        sendErrorDev(err, res)
    }
    else if(process.env.NODE_DEV ==='production'){
        console.log(err, 'adisseeeeeeeeeeeeee')
        console.log(err.name)
    
        console.log("In production er/.....................")
        let error = {...err}

        console.log("erororororoorororroroor")
        // console.log(err)

        console.log(err.name)
        console.log("ended")


        if (err.name === 'CastError') error= handleCastErrorDB(error)

        // if (error.name === 'CastError') error= handleCastErrorDB(error)
        if(error.code === 11000) error = handleduplicateFieldErrorDB(err)
        if(err.name === 'ValidationError') error = handleValidationError(err)
        if(err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(err)
        if(err.name === 'TokenExpiredError') error = handleTokenExpiredError(err)


        sendErrorProd(error, res)
        

    }

  
}