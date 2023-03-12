const express = require('express');
const userRouter = express.Router()

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
} = require('../controllers/userController')

const {
    signup,
     login,
     forgotPassword,
     resetPassword,
     updatePassword,
     protect
    } = require('../controllers/authController')

userRouter.post('/signup', signup)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.patch('/resetPassword:token', resetPassword)
userRouter.patch('/updatePassword', protect, updatePassword)
userRouter.patch('/updateMe', protect, updateMe)
userRouter.delete('/deleteMe', protect, deleteMe)




userRouter.post('/login', login)


 
userRouter.route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = userRouter