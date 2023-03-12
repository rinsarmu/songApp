const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review  can not be emempty"]
    },
    rating: {
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'A review must belong to the user']
    },
    tour:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, "Review must belong to a tour"]
    },
  
},  
{
    toJSON:{ virtuals: true},
    toObject:{ virtuals: true}
})

// reviewSchema.pre(/^find/, function(){
//     this.find().select('- __v')
// })


reviewSchema.pre(/^find/, function(next){

    //Populating the reviews
    this
    // .populate({
    //     path: 'tour',
    //     select: '-guides'
    // })
    .populate({
        path: 'user',
        select: "name, role"
    })

    next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review