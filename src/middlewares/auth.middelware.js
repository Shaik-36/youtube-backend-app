import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"




export const verifyJWT = asyncHandler( async (req, _, next) => {

    try {
        // get Token access using cookies (from req.cookieParser) or from req.header in Authorization (by eliminating Bearer_)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if(!token) {
            throw new ApiErrors(401, "Unauthorized request")
        }
    
        // Now need to check if the token is correct or not
        // so we have to decode using jwt and verify using jwt
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(" -password -refreshToken ")
    
        if(!user) {
            // Next_Video: discuss about frontend
            throw new ApiErrors(401, "Invalid Access Token")
        }
    
        // If user exists
        req.user = user
        next()

    } catch (error) {
        throw new ApiErrors( 401, error?.message || "Invalid access Token")
    }

})
