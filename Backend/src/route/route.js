const express= require('express')
const router= express.Router()
const {registerUser}= require('../controller/userController')

router.post('/api/user', registerUser)
// router.post('/demo', function(req, res){
//     console.log(req.body)
//     res.json(req.body)
// })

module.exports=router;