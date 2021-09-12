const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const userSchema = require('../modules/userModule')


exports.signUp = async (req,res,next) =>{
    bcrypt.hash(req.body.password,10).then((hash)=>{
        console.log(req.body.email)
        const user = new userSchema({
            email:req.body.email,
            password:hash
        });
        user.save().then(()=>{
            res.status(201).json({message:"user created"})
        }).catch((err)=>{
            res.status(401).json({message: err.message })
        })
    }).catch((err)=>{
        res.status(500).json({message: err.message })
    })
}


exports.login = async (req,res,next) =>{
    userSchema.findOne({"email":req.body.email}).then((user)=>{
        bcrypt.compare(req.body.password,user.password).then((loggedIn)=>{
            if(loggedIn){
                const token = jwt.sign({
                    user: req.body.email
                  }, process.env.SUPERSECRET, { expiresIn: 60 * 15 });
                res.status(201).json({userId:req.body.email,token:token})
            }
            else{
                res.status(401).json({err:"Wrong credentials"})
            }
        }).catch((err)=>{
            res.status(500).json({message: err.message })
        })
    }).catch((err)=>{
        res.status(500).json({message: err.message })
    })


}