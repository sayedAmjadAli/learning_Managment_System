import { User } from "../models/user.model.js";
import { AppError, catchAsync } from "../middleware/error.middleware.js";
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const createUserAccount = catchAsync(async (req, res) => {

    const { name, email, password, role = "student" } = req.body
 
    console.log({name,email,password})
    if ([name, email, password].some(field => field?.trim() === "")) {
        throw new AppError(400, "All fields are required")
    }

    const existsUser = await User.findOne({ email:email.toLowerCase() })

    if (existsUser) {
        throw new AppError(404, "User with this email already exists")
    }


    const user = await User.create({ name, email:email.toLowerCase(), password, role })

    res.status(200).json({ success: true, message: "successfully user account created" })
})


const loginuser=catchAsync (async (req,res)=>{
    const {email,password}=req.body

    console.log({email,password})
    if([email,password].some(field=>field?.trim()=="")){
        throw new AppError(400,"All fields are required")
    }

    const user=await User.findOne({email:email.toLowerCase()}).select("+password")

    if(!user){
        throw new AppError(404,"email or password is incorrect")
    }

    //now check password

    const correctPassword=await user.isCorrectPassword(password)

    if(!correctPassword){
        throw new AppError(400, "email or password is incorrect")
    }


    const token= jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

    res
    .status(200)
    .cookie("token",token,{httpOnly:true,maxAge:Date.now()+10*60*1000})
    .json({success:true,message:"successfully login "})
})


export {
    createUserAccount,
    loginuser
}