// IMPORTS 
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

const PORT = process.env.PORT || 4000;

//database connecton 
mongoose.connect(process.env.DB_URI,{family: 4,})
const db = mongoose.connection;
db.on('error',(error)=> console.log(error));
db.once('open',()=>console.log('connected to the database'));

// middlewares
// middleware for geting form date by req.body if coming undefined
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.message= req.session.message;
    delete req.session.message;
    next()
})
// end of setting middlewares

// make upload folder as static so image will be gotton
app.use(express.static('uploads'));

// set Template Engine
app.set('view engine','ejs');

// route prefix
app.use("",require('./routes/routes'))

// app.get('/',(req,res)=>{
//     res.send('I am anwaar');
// });

app.listen(PORT,()=>{
    console.log(`Listening at port http://localhost:${PORT}`);
});