const sauceSchema = require('../modules/sauceModule')
const fs = require('fs')


//getting all sauces
exports.getAll = async (req, res, next) => {
    // console.log(req.headers.authorization)
    const allSauces = await sauceSchema.find();
    res.status(200).json(allSauces)

}


//getting one sauce
exports.getOne = async (req, res, next) => {
    sauceSchema.findOne({ _id: req.params.id }).then((result) =>
        res.status(200).json(result)
    ).catch((err) => {
        res.status(400).json({ message: err.message })
    })
}

// adding new sauce !
exports.postSauce = async (req, res, next) => {


    const url = req.protocol + '://' + req.get('host');
    let sauceJson = JSON.parse(req.body.sauce)
    const sauce = new sauceSchema({
        userId: sauceJson.userId,
        name: sauceJson.name,
        manufacturer: sauceJson.manufacturer,
        description: sauceJson.description,
        mainPepper: sauceJson.mainPepper,
        heat: sauceJson.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersLiked: [],
        imageUrl: url + '/images/' + req.file.filename
    })
    console.log()
    sauce.save().then((item) => {
        res.status(201).json({ message: "Sauce created successfully!" })
    }).catch((err) => {
        res.status(500).json({ error: err.message })
    })
}


//update sauce 
exports.putSauce = async (req, res, next) => {
    sauceSchema.findOne({ _id: req.params.id }).then((result) => {
        try {
            var requiredSauce;
            try {
                requiredSauce = JSON.parse(req.body.sauce);
            }
            catch (err) {
                requiredSauce = req.body;
                
            }
            result.name = requiredSauce.name
                result.manufacturer = requiredSauce.name
                result.heat = requiredSauce.heat
                result.mainPepper = requiredSauce.mainPepper
                result.description = requiredSauce.description
                if (req.file) {
                    const url = req.protocol + '://' + req.get('host');
                    fs.unlink('./' + result.imageUrl.split(url)[1], (err => {
                        if (err) console.log(err);
                    }))
                    result.imageUrl = url + '/images/' + req.file.filename
                }
                result.save().then(() => {
                    res.status(201).json({ message: "Sauce updated!" })
                }).catch((err) => {
                    res.status(400).json({ message: err.message })
                })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    




   
    }).catch ((err) => {
    res.status(400).json({ message: err.message })
})   
}
//delete sauce
exports.deleteSauce = (req, res, next) => {

    sauceSchema.findOne({ _id: req.params.id }).then((result) => {
        var url = req.protocol + '://' + req.get('host');
        sauceSchema.deleteOne(result).then(() => {
            fs.unlink('./' + result.imageUrl.split(url)[1], (err => {
                if (err) console.log(err);
            }))
            res.status(200).json({ message: "sauce deleted successfully" })
        }).catch((err) => {
            res.status(500).json({ message: err.message  })
        })
    }).catch((err) => {
        res.status(500).json({ message: err.message })
    })





}



//like or dislike sauce

exports.likeSauce = (req,res,next)=>{
    try{
        var userLiked = req.body.userId;
        var likeMethod = parseInt(req.body.like)
        sauceSchema.findOne({_id:req.params.id}).then((result)=>{
            
            if(likeMethod==1){
                if(!result.usersLiked.includes(userLiked)){
                    result.usersLiked.push(userLiked)
                }
                else{
                    res.status(500).json({message:"this user already liked!"})
                }
                
            }
            else if(likeMethod==0){
                if(result.usersLiked.includes(userLiked)){
                    result.usersLiked.splice(result.usersLiked.indexOf(userLiked), 1)
                }
                else if(result.usersDisliked.includes(userLiked)){
                    result.usersDisliked.splice(result.usersDisliked.indexOf(userLiked), 1)
                }
                else{
                    res.status(500).json({message:"errod updating like"})
                }
            }
            else if(likeMethod==-1){
                if(!result.usersDisliked.includes(userLiked)){
                    result.usersDisliked.push(userLiked)
                }
                else{
                    res.status(500).json({message:"this user already liked!"})
                }
            }
            else{
                res.status(500).json({message:"errod updating like"})
            }
            result.dislikes=result.usersDisliked.length
            result.likes=result.usersLiked.length;
            result.save().then(()=>{
                res.status(200).json({message:"like/dislike Accepted!"})
            }).catch((err)=>{
                res.status(500).json({message:err.message})
            })
        }).catch((err)=>{
            res.status(500).json({message:err.message})
        })

    }
    catch(err){
        res.status(500).json({message:err.message})
    }


}
