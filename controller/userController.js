const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const passport = require('passport')


exports.signUp =async (req, res)=>{
    try{
        const {fullName, email, password, confirmPassword} = req.body
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exist"
            })
        }
        if(confirmPassword !== password){
            return res.status(400).json({
                message:"Password doesn't match"
            })  
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password, salt)

        const user = await userModel.create({
            fullName, email, password:hash
        })

        res.status(200).json({
            message:"User created successfully ",
            user
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

exports.signIn = async(req, res)=>{
    try{
    const { email, password} = req.body
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }


const confirmPassword = bcrypt.compareSync(password, user.password);
   if(!confirmPassword){
    return res.status(400).json({
        message:"Invalid Password"
    })
   }

   req.session.user = user

   res.status(200).json({
    message:"User logged in successfully ",
    user
})

}catch(err){
    res.status(500).json({
        message:err.message
    })
}
}

exports.getAll = async(req, res)=>{
    try{
        const allUsers = await userModel.find()
        if(allUsers.length ==null){
           return res.status(200).json({
                message:"There are no user in the database "
        })
    }
    return res.status(200).json({
        message:`There are ${allUsers.length} user in the database `
})
    
  }catch(err){
        res.status(500).json({
            message:err.message
        })  
    }
}

exports.signOut = async (req, res) =>{
    try{
       req.session.destroy()
       res.status(200).json({
        message:'Logged out successfully'
       })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

exports.socialAuth = passport.authenticate('facebook',{scope:['verify','profile']})

exports.callback = passport.authenticate('facebook',{
    successRedirect: "auth/facebook/success",
    failureRedirect:'auth/facebook/failure'
})