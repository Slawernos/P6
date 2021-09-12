const express = require('express')
const router = express.Router()
const sauceController = require('../controller/sauceController')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')


router.get('/',auth,sauceController.getAll)
router.get('/:id',auth,sauceController.getOne)
router.post('/',auth,multer,sauceController.postSauce)
router.post('/:id/like',auth,sauceController.likeSauce)
router.put('/:id',auth,multer,sauceController.putSauce)
router.delete('/:id',auth,sauceController.deleteSauce)

// 
module.exports = router
