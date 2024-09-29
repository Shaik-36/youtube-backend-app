import mongoose from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiErrors } from "../utils/apiErrors.js";

import {User} from '../models/user.model.js'

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";


import jwt from "jsonwebtoken"




// Genrate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        
        // find the user
        const user = await User.findById(userId)


        // Generate both tokens
        const accessToken = user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()

        // Save refresh token in the database
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        // give the access and refresh token ( return them)
        return {accessToken, refreshToken}



    } catch (error) {
        throw new ApiErrors(500, "Something Went Wrong while generating Tokens")
    }
}

//******************************* End Points Methods START ************************************** */

// Register User
const registerUser= asyncHandler( async (req,res) => {
    
 // *****  Steps For Registering User *****

    // Get user details from Frontend
    // Validation of details - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // Upload them to cloudinary, avatar
    // create user Object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response

//********************************************************************

    // Get user details from Frontend
    const {username, email, fullName, password} = req.body
    // console.log("username:", username );
    // console.log("email:", email );
    // console.log("password:", password );

//********************************************************************

    // Validation of details - not empty
    if(
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiErrors(400, "All fields are required")
    }

//********************************************************************
    // check if user already exists: username, email
    const existedUser =  await User.findOne({
                                        $or: [{ username }, { email }]
                                    })

    if (existedUser) {
        throw new ApiErrors(409, "User already exists")
    }

//********************************************************************
    // check for images, check for avatar
    // As express gives yoou access to            'req.body'
    // Similary multer gives you access to        'req.files'

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(" The temp file path is: ", avatarLocalPath)

    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "No Avatar file exists in Local Storage Path")
    }


//********************************************************************
    // Upload them to cloudinary, avatar


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiErrors(400, "Avatar file is required")
    }

//********************************************************************
    // create user Object - create entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

   

    

//********************************************************************
    // remove password and refresh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    
//********************************************************************
    // check for user creation 

    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering")
    }

//********************************************************************
    // return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registed Successfully")
    )

//********************************************************************



})


// Login User
const loginUser = asyncHandler( async (req,res) => {

    // ******* Steps for Login  ********

    // 1. get the data from req.body
    // Check for empty data or incorret format of data
    // 2. find the user in the database
    // 3. if found -> password check
    // 4. generate -> access and refresh token 
    // 5. send token in secure cookies
    // repsonse login

//****************************************************************************************************** */
    // Get data from req.body
    const {email, username, password} = req.body


//****************************************************************************************************** */
    // check if there is data in any field and send error
    if (!username && !email) {
        throw new ApiErrors(400, "Username and password is required")
    }

//****************************************************************************************************** */
    // find the user in the database using User (from model) and findOne()

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiErrors(400, "User does not exists")
    }

//****************************************************************************************************** */

    // If found check for password 
    // We have already declarted a method in user.model.js called 'isPasswordCorrect'
    // isPasswordCorrect needs one params (req.body.password)
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiErrors(401, "Invalid User Credentials")
    }


//****************************************************************************************************** */
    // generate Access and Refresh Tokens 

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    

    // Now the refresh token in the user is empty because we received the data initially where the refresh token is not defined
    // So once we called the above generate function the refresh token is saved into the database 
    // Now to get the refresh token we need to get the data from database again
    // This is ******  expensive operation   ************ if the data is too big (calling data from database is expensive like from AWS)
    // If it's expensive then just update only the object else call the whole data

     // get all data and Remove password and refresh token
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")

   
//****************************************************************************************************** */
    // Send Access and Refresh Tokens in Secure Cookies to the user
    // We need to design some options for cookies

    const options= {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            
            200, 

            {
                user: loggedInUser, accessToken, refreshToken
            },

            "User Logged In successfully"
        )
    )


})


// Logout User
const logoutUser = asyncHandler( async(req,res) => {

    // ******* Steps for Logout  ********
    // Clear Cookies
    // reset refresh token
    // Now after auth.middleware.js we hafe req.user in the end we have access passed from the middle in the user.routes.js

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $unset: {
                refreshToken: 1 // this remove the field from document
            }
        },
        {
            new: true
        }
    )


    // Now we need to erase cookies as well using options

    const options= {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))

})

//******************************* End Points Methods END ************************************** */




// Fetch uesr channel data from database using username
const getUserChannelProfile = asyncHandler( async (req, res) => {
    

    // We get user details from req.params

    const {username} = req.params

    // Check if username exists or not
    if (!username?.trim()) {
        throw new ApiErrors(400, "Username is incorrect")
    }

    // Find the document using username from database

    const channel = await User.aggregate([


        // *************  Pipeline - 1  **************
        {
           
            $match: {
                username: username?.toLowerCase()
            },
        },

        // *************  Pipeline - 2  **************
        { 
            $lookup: {
                from:         "subscriptions",
                localField:             "_id",
                foreignField:       "channel",
                as:             "subscribers"

            },
        },

        // *************  Pipeline - 3  **************
        {   
            $lookup: {
                from:         "subscriptions",
                localField:             "_id",
                foreignField:     "subscriber",
                as:              "subscribedTo"
            },

        },

        // *************  Pipeline - 4  **************
        {  
            $addFields: {

                subscribersCount: {
                    $size: "$subscribers"
                },

                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },

                isSubscribed: {

                     $cond: {

                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},

                        then: true,

                        else: false

                    }
                }


            }

        },

        //  *************  Pipeline - 5  **************
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatat: 1,
                coverImage: 1


            }
        }
    ])

    // Check if channel is empty and throw error
    if(!channel?.length) {
        throw new ApiErrors(400, "Channed does not exists")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, channel[0], "User Channed Fetched Successfully"))


})


// Get Watch History of the user - Nested Lookups
const getWatchHistory = asyncHandler( async(req, res) => {
    // In here mongoose converts and gives the only id from -->  the _id = ObjectId(66ebf16b4b80322b36fc175b)
    // req.user._id
    
    const user = await User.aggregate([

        // *************  Pipeline - 1  **************
        {
            $match: {
                // Here mongoose doesn't convert the pipeline
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },

        // *************  Pipeline - 2  **************
        {
            $lookup: {
                from:"videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                // *************  Sub - Pipeline - 2.1  ( Map owner with User) **************
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",

                            // *************  Sub - Pipeline - 2.1.1  () **************
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },

        // ***************  Pipeline - 3  ****************
        // Now we have all the data that is required but we will get in array and then from that array 
        // we have to get first value which holds all our data
        // Now from above all the data we got into "owner" field - in the array form
        // Now again we have to perform to get the first value to get the data
        // To eleminate this we will make another pipeline to help front end engineers to fetch data easily
        
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }

    ])

    return res
    .status(200)
    .json( new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched Successfully"
     ))


})




const refreshAccessToken = asyncHandler( async (req, res) => {

    // First we need to get the refresh token from cookies
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken) {
        throw new ApiErrors(401, "Unauthorised Request")
    }


    try {
    
        // Verify the Token using JWT
        const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new ApiErrors(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiErrors(401, "Refresh Token is expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, 
                    refreshToken: newRefreshToken
                },
                "Access Token Refreshed Successful"
            )
        )



    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid refresh token")
    }


})





// Change Password
const changeCurrenrPassword = asyncHandler( async (req, res) => {

    const { oldPassword, newPassword } = req.body

  

    // Now how to get the user 
    // If the user is changing password means he is already logged in 
    // When logged in the user is stored in the authorization middleware (req.user)

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiErrors(400, " Invalid old Password")
    }

    // Set new passsword
    user.password = newPassword

    // After this will hit the userSchema.pre (user.model.js)


    // Save new password in DB
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "Password Changed Successfully"))

})


// Current User - Get
const getCurrentUser = asyncHandler( async (req, res) => {

    //const user = await User.findById(req.user?.id)

    return res
    .status(200)
    .json( new ApiResponse(
        200, 
        req.user, 
        "Current User Fetched Successfully"
    ))

})



// Update Account Details
const updateAccountDetails = asyncHandler( async(req,res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiErrors(400, "All fields are required")
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {new: true}
    
    ).select(" -password -refreshToken ")


    return res
    .status(200)
    .json( new ApiResponse(200, user, "Account details updated Successfully"))
})






//****************************  Files Updating START ************************************ */


const updateUserAvatar = asyncHandler ( async (req, res) => {

    // Firstly we need to get the files access which is already done by multer ( req.files )

    const avatarLocalPath = req.files?.path

    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar File is Missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if (!avatar.url) {
        throw new ApiErrors(400, "Error while uploading avatar")
    }


    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },

        {new: true}

    )


    return res
    .status(200)
    .json( new ApiResponse(200, user, "Avatar Image Updated Successfully"))

})


// Update Cover Image

const updateUserCoverImage = asyncHandler ( async (req, res) => {

    // Firstly we need to get the files access which is already done by multer ( req.files )

    const coverImageLocalPath = req.files?.path

    if (!coverImageLocalPath) {
        throw new ApiErrors(400, "Cover Image File is Missing in Local Storage")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!coverImage.url) {
        throw new ApiErrors(400, "Error while uploading Cover Image")
    }


    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    
    )

    return res
    .status(200)
    .json( new ApiResponse(200, user, "Cover Image Updated Successfully"))


})

//****************************  Files Updating END  ************************************ */



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrenrPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}


