const express = require('express');
const app = express()
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean")

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/AppError')
const songRouter = require('./routes/songRoutes')

// 1. Global MIDDLEWARES

// Security HTTP headers
app.use(helmet())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

const corsOptions = {
    origin: ['http://localhost:3000']
  };
app.use(cors(corsOptions))

//DEVELOPMENT
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
    app.use(morgan('dev'))

}

//LIMIT REQUEST
//Limiting number of request comes from the same ip address to protect DNS and brute force I use express-rate-limiter

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, //allow 100 request from the server in one hour only
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use("/api", limiter)

//BODY PARSER, readeing data form body int req.body
app.use(express.json({limit:'10kb'}))

// DATA SANITIZATION 
//1) Data sanitization against NoSQL query injection
app.use(mongoSanitize()) //it removes all $ character from accessing ther db 

    //2) Data Sanitization against XSS
app.use(xss())

//Prevent parameter pollution

//serving static files
app.use(express.static(path.join(__dirname, "public")))

//Test middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware")
    // console.log(req.headers)
    next();
})

//2. CONTROLLERS

app.get("/message", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.use('/api/v1/songs', songRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server!`,400))
})
app.use(globalErrorHandler)
module.exports = app