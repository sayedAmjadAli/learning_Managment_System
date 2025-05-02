import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            maxLength: [50, "name cannot exceed to 50 charetors"]
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: [true, "email is required"],
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minLength: [8, "password must be greater then 8 charectors"],
            select: false
        },
        role: {
            type: String,
            enum: {
                values: ["student", "instructor", "admin"],
                message: "please select valid role"
            },
            default: "student"
        },
        bio: {
            type: String
        },
        enrolledCourses: [
            {
                course: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Course"
                },
                enrolledAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        createdCourses: [{
            type: mongoose.Schema.ObjectId,
            ref: "Course"
        }],
        verifyAccount:{
           type:Boolean,
           default:false
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        verifyToken: String,
        verifyExpires: Date,
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    
    next()

})

userSchema.methods.isCorrectPassword=async function (password){
  const checkPassword=await bcrypt.compare(password,this.password)

  return checkPassword
}


userSchema.methods.generateResetPasswordToken=function (){
    const resetToken=crypto.randomBytes(20).toString("hex")
  
    this.passwordResetToken=crypto
    .createHash("sha256").
    update(resetToken).
    digest("hex")

    this.passwordResetExpires=Date.now()+10*60*1000

    return resetToken
}


userSchema.methods.generateVerifyAccountToken=function (){
    const verify_token=crypto.randomBytes(20).toString("hex")
  
    this.verifyToken=crypto
    .createHash("sha256").
    update(verify_token).
    digest("hex")

    this.verifyExpires=Date.now()+10*60*1000

    return verify_token
}


userSchema.virtual("totalEnrolledCourses").get(function (){
    return this.enrolledCourses?.length
})


userSchema.methods.updateLastActive=function (){
    this.lastActive=Date.now()

    return this.save({validateBeforeSave:false})
}

export const User = mongoose.model("User", userSchema)