const express = require('express');
const songRouter = express.Router()

const {
    getAllSong,
    createSong, 
    getSong, 
    updateSong, 
    deleteSong
} = require('../controllers/songController')


songRouter.route('/')
    .post( createSong)
    .get(getAllSong)


songRouter.route('/:id')
    .get(getSong)
    .patch(updateSong)
    .delete(deleteSong)


module.exports = songRouter
