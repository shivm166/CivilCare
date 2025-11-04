import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true, 
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }

    try{
        const salt = await bcrypt .genSalt(7)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch(err){
        next(err)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema)