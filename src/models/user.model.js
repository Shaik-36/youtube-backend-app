import mongoose, {Schema} from "mongoose";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



const userSchema = new Schema(
{
        username: {
            type: String,
            reqiured : true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            reqiured : true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            reqiured : true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,  // Cloudinary URL
            required: true,
        },

        coverImage: {
            type: String,
            
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        password: {
            type: String,
            reqiured : [true, 'Password is Required'],  
        },

        refreshToken: {
            type: String
        }
        
},

    {
        timestamps: true
    }
)

//  ****************************** Encrypting Password  *************************************
// Middleware - Pre Hook using bcrypt
userSchema.pre("save", async function (next) {
    
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10)

    next()
})
//********************************************************************************************


//  ***********************  Create Custom methods from mongoose  ******************************


//To check password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)

}
//***********************************************************************************************



/*********************** JWT TOKENS GENERATION ******************** */


// Generate Access Token
userSchema.methods.generateAccessToken = function(){
   return  jwt.sign(

                    {
                        // Payload for Sign in Token
                        _id: this._id,
                        email: this.email,
                        username: this.username,
                        fullName: this.fullName
                    },

                    process.env.ACCESS_TOKEN_SECRET,

                    {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                    }

    )
}



// Generate Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(

        {
            // Payload for Sign in Token
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        
)
}

//****************************************************************************************






export const User = mongoose.model("User", userSchema)



