const promisify = require('util').promisify;
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')
const sendEmail = require('./../utils/email')



const signToken = (id) =>{
   return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })

} 

const createSendToken = (user, statusCode, res)=>{
    const token = signToken(user._id)
    const cookieOptions =  {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
    
    // res.cookie('jwt',token,cookieOptions)

    //to hide user pasword from the output
    user.password = undefined

    
    res
        .cookie('jwt',token,cookieOptions)
        .status(statusCode)
        .json({
            status: 'Success',
            token,
            data:{
                user: user
            }
        })
}

exports.signup = catchAsync(async(req,res,next)=>{
    console.log(req.body)
    if(req.body.password!== req.body.confirmPassword){
        return next(new AppError('Passwords do not match',400))
    }
    const newUser = await User.create({
        name:req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        active: true
    })

    createSendToken(newUser, 201, res) 

    // const token = signToken(newUser._id)
    
    // res.status(201).json({
    //     status: 'Success',
    //     token,
    //     data:{
    //         user: newUser
    //     }
    // })
})

exports.login =catchAsync(async (req, res, next)=>{
    const {email, password} = req.body

    // 1) Check if eail and password exist
    if(!email|| !password){
        return next(new AppError('Please provide email and password', 400))
    }

    
    // 2) check if user exist and password is correct

    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError("Incorrect email or password", 401))
    }
    console.log('Email')
    console.log(user)
    //  3) if everything ok, send token to client

    createSendToken(user, 200, res) 

    // const token = signToken(user._id)
    // res.status(200).json({
    //     status: "success",
    //     token,
      
    // })
})

exports.protect = catchAsync(async(req,res, next)=>{

    // 1) Get token from header and ceck if it's exist
    
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1]
    }
    // console.log(token)
    if(!token){
        return next(new AppError("You are not loggedin! Please log in to get acceess", 401))
    }

    //2) Verification token
   console.log("decode .... first ") 

   const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
   console.log("decode .... ") 
   console.log(decoded)
    //3) Check if user still exists

    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError("THe user belonging to this token does no longer exists.", 401))
    }

        // return next(new AppError("Te user belonging to this token does no longer exists.", 401))


    //4) Check if user changed password  after the token was issued
   if (currentUser.changedPasswordAfter(decoded.iat)) {
    console.log("change.... blah")

    return  next(new AppError("User recently changed password ! Session is already expired", 401))
   }

   //Grant Access to Protected Route
   req.user = currentUser;
    next()
})

exports.restrictTo = (...roles)=>{
    return(req,res,next)=>{
        //roles [admin, lead-guide]
        console.log("Role  ddd", req.user.role)
        if(!roles.includes(req.user.role)){
            return next(new AppError("User do not have permission to perform this action", 403))
        }
        next()

    }

}
// Forgot password

exports.forgotPassword =catchAsync(async(req, res, next)=>{
    //1. Get user based onposted emeail

    const user = await User.findOne({email:req.body.email})

    if(!user) {
        return next(new AppError("There is no user with thsi email", 404))

    }
    //2) Generate the randome rest token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    //3 ) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit patch request with your new passwor and confirm to: ${resetUrl}.\n Please if you didn't forget your password, please ignore this email.`
    try{
        await sendEmail({
            email: user.email,
            subject:'your password reset token',
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    } catch(err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save({validateBeforeSave: false})
        return next(new AppError("There was an error in the mail. Try again later", 500))
    }
  
})
exports.resetPassword = catchAsync(async(req, res, next)=>{
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.tokon)
        .digest('hex')

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt: Date.now()}})
    //2) If token has not expired, and there is user, set the new password
    if(!user) {
        return next(new AppError("Token is invalid or has expired", 400))
    }   
    user.password = req.body.password,
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save();
    //3) Update changedpasswordAt property for the user

    //4) Log the user in, send JWT
    createSendToken(user, 200, res) 

    // const token = signToken(user.id);
    // res.status(200).json({
    //     status: "successs",
    //     token
    // })

})

exports.updatePassword = catchAsync(async(req,res,next) => {
    // 1) check user from collection
    console.log(req.user.id)
    console.log("update Password")
    const user = await User.findById(req.user.id).select('+password')
    if(!user){
        return next(new AppError("Sorry! User is not exist. Please provide orrect password to continue", 400))
    }
    // @) Check if poosted current password is correct
    
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError("Your current password is wrong", 401))
    }
    //3 ) If so, update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    if(user.password!== user.passwordConfirm){
        return next(new AppError("Passwords do not match", 400))
    }
    
    await user.save()


    //4) Log user in, send JWT
  createSendToken(user, 200, res) 

    // const token = signToken(user.id)
    // res.status(200).json({
    //     status: "successs",
    //     token
    // })

})
