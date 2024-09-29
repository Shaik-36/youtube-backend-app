

import { Router } from "express";

import { loginUser, 
         logoutUser, 
         registerUser, 
         refreshAccessToken, 
         changeCurrenrPassword, 
         getCurrentUser, 
         updateAccountDetails, 
         updateUserAvatar, 
         updateUserCoverImage, 
         getUserChannelProfile, 
         getWatchHistory 
        
        } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middelware.js";



const  router = Router()


// Register Route (POST)
//http://localhost:8000/api/v1/users/register
router.route("/register").post(


    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),


    registerUser


    
)


// Login Route (POST)
router.route("/login").post(loginUser)



//******************  Secured Routes  ********************* */

// Logout (POST)
// Here we need to pass the middle ware just before the method is run ( verifyJWT )
router.route("/logout").post(verifyJWT, logoutUser)

// Refresh Token (POST)
router.route("/refresh-token").post(refreshAccessToken)

// Change Password (POST)
// Make sure you verify user middleware( verifyJWT )
router.route("/change-password").post(verifyJWT, changeCurrenrPassword)

// Get Current user (GET)
// Make sure you verify user middleware( verifyJWT )
router.route("/current-user").get(verifyJWT, getCurrentUser)

// Update Account Details
// Make sure you verify user middleware( verifyJWT )
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


// Update Avatar (PATCH)
// Make sure you verify user middleware( verifyJWT )
// And another middleware - multer - to upload file to local storage first
router.route("/avatar").patch(
                                verifyJWT, 
                                upload.single("avatar"), 
                                updateUserAvatar 
)

// Update Cover Image (PATCH)
// Make sure you verify user middleware( verifyJWT )
// And another middleware - multer - to upload file to local storage first
router.route("/cover-image").patch(
                                    verifyJWT,
                                    upload.single("coverImage"),
                                    updateUserCoverImage
)

// Get User Channel Profile
// Here we will fetch the username form params i.e..../user/:username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)


// Get User Watch History
// Here we will fetch the username form params i.e..../user/:username
router.route("/history").get(verifyJWT, getWatchHistory)

//********************************************************* */


export default router



