const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'A Song  must have a Title attribute'],
        unique: true,
        trim: true,
        maxLength:[40, ' A Song  must have less or equal 40 characters'],
        minLength:[10, ' A Song must have more or equal 10 characters'],
    },
    
    duration: {
        type: String,
        required: true
    },
    releasedAt: {
        type: Date,
        required: true
      },
    rate:{
        type: Number,
        default:3

    }

})

const Song = mongoose.model('Songs', songSchema)
module.exports = Song