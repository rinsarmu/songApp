// Entry of the application.
// //all db configuration, environment et

process.on('uncaughtException', err=>{
    console.log(err.name, err.message)
    console.log(err)
    console.log("Uncaught exception  Shuting down...")
    process.exit(1)
})

const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose');
const { Number } = require('mongoose');

dotenv.config({path: './config.env'})
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  
    
})
    .then(con=>{
        // console.log(con.connections)
        console.log("Db connection established")
    })
    
    
    const PORT = process.env.PORT || 8000
    const server = app.listen(PORT, ()=>{console.log("port is running on 8000")})

process.on('unhandledRejection', err=>{
    console.log(err.name, err.message)
    console.log("UNHANDELED db REJECTION Shuting down...")
    server.close(()=>{

        process.exit(1)
    });
})


