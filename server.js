const express = require('express')
const app = express()
const Router = express.Router();
const mongoose = require('mongoose')
require('dotenv').config()
const path = require ('path');



//mongoose connection ----
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true,useUnifiedTopology: true } )
    .catch(err=>console.log(err))

const db = mongoose.connection

db.on('error',(error)=> console.error(error))
db.once('open',()=> console.error('Connected to database'))
///------------------------

//parse inc request bodies to JSON
app.use(express.json())

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//first Route auth routes
const userRoute = require('./routes/user')
app.use('/api/auth/',userRoute)


//second Route for sauces!
const saucesRoute = require('./routes/sauces')
app.use('/api/sauces',saucesRoute)

app.use('/images',express.static(path.join(__dirname,'images')));




app.listen(process.env.PORT)
console.log("Server Started, listening on PORT:"+process.env.PORT)