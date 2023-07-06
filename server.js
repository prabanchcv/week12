const express=require('express')
const app=express()
const session=require('express-session')
const axios = require('axios');

// const Port=process.env.PORT || 3000
const {v4:uuid}=require("uuid")
const mongoose=require('mongoose')
const userRoute=require("./routes/userRoute")
const adminRoute=require('./routes/adminRoute')
const mongoDB = require("./database/connection")
const nocache=require("nocache")
const path=require('path')
app.use(nocache())




const logger = require('morgan');
const cookieParser = require('cookie-parser');

// const Category = require("./models/categoryModel");
const PORT = process.env.PORT || 8000
mongoDB()






app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//view child folders mount

app.set('views',path.join(__dirname,'Views','userView'))
app.set('views',path.join(__dirname,'Views','adminView'))

//mount public


// Serve static files from the 'public' folder

// app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'child folders in public folder'
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));




//mount session
app.use(
    session({
        secret:uuid(),
        resave:false,
        saveUninitialized:true
    })
    
);

app.use(nocache())

app.use('/',userRoute)
app.use('/admin',adminRoute)


app.listen(PORT, (() => console.log(`server started at  http://localhost:${PORT}`)))
