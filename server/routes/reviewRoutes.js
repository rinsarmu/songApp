const express = require('express')
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview

    } = require('./../controllers/reviewController')

const {protect, restrictTo} =  require('./../controllers/authController')

const reviewRouter = express.Router({mergeParams:true})
console.log("")

// reviewRouter.route('/:id')
//     .get(getReview)

reviewRouter.route('/')
    .get(protect,restrictTo('user'), getAllReviews)
    .post(
        protect,
        restrictTo('user'), 
        setTourUserIds,
        createReview)

// reviewRouter.route('/:id').delete(protect, restrictTo('user'), deleteReview))
reviewRouter.route('/:id').get(getReview).patch(updateReview).delete( deleteReview)

module.exports = reviewRouter

