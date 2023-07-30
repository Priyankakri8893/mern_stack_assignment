const express= require('express')
const router= express.Router()
const {registerUser, getUser}= require('../controller/userController')

router.post('/api/user', registerUser)
router.get('/api/user', getUser)
// router.post('/demo', function(req, res){
//     console.log(req.body)
//     res.json(req.body)
// })

module.exports=router;