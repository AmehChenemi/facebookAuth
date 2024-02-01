const mongoose = require ('mongoose')
const userSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    profileImage:{
        type:String
    },
    isVerified:{
        type:Boolean
    }
},{timestamps:true})

const userModel = mongoose.model('session', userSchema)
module.exports = userModel