const Song = require('../models/songModels')
const factory = require('./factoryHandler')
const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')

exports.getAllSong =(req,res,next)=>{
    const songs = Song.find()
}

exports.getAllSong = catchAsync(async(req,res, next)=>{

    const songs = await Song.find()
    //Send Response
    if(songs.length=== 0){
        // console.log("No tours found")
        return next(new AppError(`No songs found`, 404))
     }
    res.status(200).json({
        status:'success',
        results:songs.length,
        data: {
            songs
        }
    })

 
})

// Rest Api
exports.createSong = factory.createOne(Song)
exports.deleteSong = factory.deleteOne(Song)
exports.updateSong = factory.updateOne(Song)
exports.getSong = factory.getOne(Song)
