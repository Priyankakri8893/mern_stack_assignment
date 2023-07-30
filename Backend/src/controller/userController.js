const userModel= require('../models/userModel')


const registerUser = async (req, res) => {
    try {
    let { username, password } = req.body;
    console.log(req.body)

    if(!username || !password) return res.status(400).json({
      status: false,
      message: "please provide all detail"
    })

    const data= {
      username: username,
      password: password
    }

    const registerUser= await userModel.create(data)

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

  const getUser= async (req, res) => {
    try {
      const userData= await userModel.find()
      console.log(userData)
      if(!userData){
        return res.status(404).json({
          status: false,
          message: "user not found"
        })
      }
      console.log(userData)
      res.status(200).send({
        status: true,
        data: userData
      })
    } catch (error) {
      res.status(500).send({status: false, msg: error.message})
    }
  }

 module.exports= {registerUser, getUser}
