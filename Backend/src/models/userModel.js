const mongoose= require('mongoose')

const registerSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
      },
  
  },{timestamps:true});
  
  module.exports = mongoose.model('Register', registerSchema);



