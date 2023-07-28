const registerModel= require('../models/userModel')


const registerUser = async (req, res) => {
  console.log('hii')
    try {
    let { username, password } = req.body;
    console.log("hello")
    console.log(req.body)

    if(!username || !password) return res.status(400).json({
      status: false,
      message: "please provide all detail"
    })

    const registerUser= await registerModel.create(req.body)

    console.log(registerUser)
    res.status(201).send({
      status: true,
      message: "successfull register",
      data: registerUser
    })
  }
  catch (err) {
    res.status(500).send({status: false, msg: err.message})
  }
  }


 module.exports= {registerUser}
