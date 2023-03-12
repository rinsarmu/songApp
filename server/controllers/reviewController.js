const Review = require('./../models/reviewModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')
const factory = require('./factoryHandler')


exports.getAllReviews =catchAsync(async(req,res,next)=>{
    let filter = {}
    if(req.params.toursId) {filter=({tour: req.params.toursId})}
    console.log("Filters", filter)
    const reviews = await Review.find()

    if(!reviews){
        return next(new AppError("Sorry! No reivew is found", 400))
    }
    res.status(200).json({
        status: 'Success',
        results: reviews.length,
        data:{
            reviews
        }
    })
})



exports.setTourUserIds = (req, res, next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
}

exports.createReview = factory.createOne(Review)
exports.getReview = factory.getOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)

// exports.createReviews = catchAsync(async(req,res,next)=>{
//     req.body.createdAt = Date.now()
//     const {
//         review,
//         rating,
//         createdAt,
//         user,
//         tours

//     } = req.body
//     console.log("from destructure\n",{ review, rating,createdAt,user,tours})
//     console.log("From body\n",req.body)

//     //It's Error
//     // const newReview = await Review.create( {
//     //     review:review,
//     //     rating: rating,
//     //     createdAt: createdAt,
//     //     user: user,
//     //     user: tours})

//     //It's working

//     //allow nested routes
//     console.log("logging............")
//     console.log(req.params)
//     if(!req.body.tour) req.body.tour = req.params.tourId
//     if(!req.body.user) req.body.user = req.user.id

//     const newReview = await Review.create(req.body)

//     if(!newReview){
//         return next(new AppError("Sorry! Something si happened! Please send the review again", 401))
//     }

//     res.status(201).json({
//         status:"success",
//         data:{
//             newReview
//         }
//     })
// })


// exports.getReview = catchAsync(async(req, res, next)=>{
//     const {id} = req.params
//     const review = await Review.findById(id);

//     if(!review){
//         return next(new AppError("Sorry! No reivew is found! Please try again later", 400))
//     }
//     res.status(200).json({
//         status: "Success",
//         data:{
//             review
//         }
//     })
// })
