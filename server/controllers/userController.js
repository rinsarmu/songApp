const User = require('../models/userModels')
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./factoryHandler')


const filterObj = (obj, ...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
            console.log("...........", el,obj[el])
        }
    })
    console.log("new onjjjjj ")
    console.log(newObj)
    return newObj
}
exports.getAllUsers = catchAsync(async(req,res, next)=>{

    const tours = await User.find()
    //Send Response
    if(tours.length=== 0){
        // console.log("No tours found")
        return next(new AppError(`No tours found`, 404))
     }
    res.status(200).json({
        status:'success',
        results:tours.length,
        data: {
            tours:tours
        }
    })
 
})

exports.createUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'THis route is not yet defined'
    })
}

exports.updateMe =catchAsync(async (req, res, next)=>{
    // 1) Create error if user posts passwords data

    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates,. please use /updatepassword instead", 400))
    }
    console.log(req.body)
    //2) filter out unnecessary fields
    const filteredBody = filterObj(req.body, "name", 'email')
   
    //3) Update user document
    const updatedUser =await User.findByIdAndUpdate(req.user.id, filteredBody, {new:true, runValidators: true})
    console.log("User..........", filteredBody)

    res.status(200).json({
        status: "success", 
        data: { 
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false} )

    req.headers.authorization.split(' ')[1] = " "
    res.status(204).json({
        data: null
    })
})

exports.getUser= factory.getOne(User)

// Do not update password with this
exports.updateUser= factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)
