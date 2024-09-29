# A Youtube Backend Project

This is a complex Backend Project for Youtube on backend with javascript

Here we used Node.js, Express.js, MongoDB

And some Production level Packages : Multer, Mongoose-aggregate-paginate-v2, cors, dotenv, jsonwebtokens, cloudinary, bcrypt, cookie-parser, prettier.

We will see the step by step process of creating this complex Project


# Dependencies

-> bcrypt
-> cloudinary
-> cookie-parser
-> cors
-> dotenv
-> express
-> jsonwebtoken
-> mongoose
-> mongoose-aggregate-paginate-v2
-> multer

# Create database in MongoDB Atlas


-> https://cloud.mongodb.com/



# Connect to database code in Backend

There are two major methods.

Approach - 1:  
--------------
write all the code db connection in index.js file. 

Approach - 2: 
--------------
Create a folder DB, keep all code in here. ANd import this function in index.js [ Clean, moduler, distributed - Better Professional Approach ]


----------------------------------------------------------------------------------------

-> app.js - through Express

-> database connection (db Folder) - thorugh Mongoose

----------------------------------------------------------------------

Important Dependencies
-----------------------------------------------------------------------
-> npm install mongoose express dotenv
=======================================================================

-> Go to index.js



# Approach - 1 - Connecting to Database

import express from "express"
const app = express()

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR", error);
            throw error
            
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening at ${process.env.PORT}`);
            
        })
    }
    catch (error) {
        console.log("Error while connecting to database", error)
        throw error
    }
})()




# Approach - 2 - Write the code in a DB file and then import it here

-> GO to DB/

-> Get url from database connect

mongodb+srv://imamshan369:<db_password>@cluster0.bwjho.mongodb.net/



 #   Custom API response and error Handling
====================================================================================

-> in Utils
-> Create a file calleed asyncHandler.js


The code defines a function asyncHandler that wraps asynchronous Express.js route handlers to automatically pass any errors they throw to the error-handling middleware.



#    API error Handling
====================================================================================

-> In utils
-> create apiErrors.js


In Node.js, API errors typically refer to problems that occur when a client (such as a web browser or mobile app) makes a request to a server, and something goes wrong in the process. These errors can be caused by various issues, and understanding them involves knowing a bit about how APIs (Application Programming Interfaces) and error handling work.

Here’s a breakdown of what API errors might involve:

1. Types of Errors
Client-Side Errors (4xx): These errors indicate that the problem lies with the request made by the client. Common status codes include:

400 Bad Request: The request could not be understood or was missing required parameters.
401 Unauthorized: The request requires user authentication.
403 Forbidden: The server understood the request, but the client doesn’t have permission to access the resource.
404 Not Found: The requested resource could not be found on the server.
Server-Side Errors (5xx): These errors indicate that the problem lies with the server. Common status codes include:

500 Internal Server Error: A generic error message indicating that the server encountered an unexpected condition.
502 Bad Gateway: The server received an invalid response from an upstream server it needed to access in order to complete the request.
503 Service Unavailable: The server is currently unable to handle the request due to temporary overload or maintenance.
2. Causes of API Errors
Validation Errors: The client might send invalid data (e.g., missing required fields or providing incorrect data types).
Authentication/Authorization Errors: The client might not be authenticated or may not have the right permissions.
Resource Issues: The requested resource might not exist, or the server might be unable to process the request due to internal issues or dependencies.
Configuration Errors: Incorrect server configuration or dependencies might cause errors.
Runtime Exceptions: Unhandled exceptions in your Node.js code can lead to 500 Internal Server Errors.
3. Handling Errors in Node.js
In Node.js, handling API errors involves several practices:

Error Handling Middleware: In frameworks like Express.js, you can use middleware to catch and handle errors. For example:

javascript
Copy code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
Try-Catch Blocks: For synchronous code, use try-catch blocks to handle exceptions. For asynchronous code, use .catch() with promises or try-catch inside async functions.

Validation Libraries: Use libraries like Joi or express-validator to validate input data and handle validation errors.

Logging: Implement logging to capture and record errors for debugging and monitoring. Libraries like Winston or Morgan are often used for this purpose.

Graceful Error Responses: Ensure that your API provides meaningful and consistent error messages. For example:

json
Copy code
{
  "error": {
    "code": 400,
    "message": "Invalid input data"
  }
}
4. Best Practices
Consistent Error Format: Define a consistent format for error responses to make it easier for clients to handle errors.
Detailed Error Messages: Provide enough information for debugging but avoid exposing sensitive information.
Rate Limiting and Throttling: Implement rate limiting to prevent abuse and ensure your server can handle the load.
By understanding and handling API errors effectively, you can improve the reliability and user experience of your Node.js applications.




#    API  Response
====================================================================================

-> In Utils/ApiResponse.js



HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)




#   User and Video model with Hooks and JWT, decrypt
====================================================================================

-> Go to folder src/models

-> create files user.model.js  videos.model.js


------------------------------------------------------
        mongoose-aggregate paginate-v2
------------------------------------------------------


Aggregation Queries - mongoose

videoSchema.plugin(mongooseAggregatePaginate)


#        bcrypt and JWT
=========================================



#       Middleware - Pre Hook using bcrypt
------------------------------------------------------

userSchema.pre("save", async function (next) {
    
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)

    next()
})
------------------------------------------------------




#        Custom methods in mongoose
======================================================

//  Custom methods from mongoose - To check password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}



 #       JWT
======================================================

JWT is a bearer token - which mean who bears (hols/have) the token they will be true and the data will be sent.


#        Define env variables 
=========================================================

-----------------------------------------
PORT=8000
MONGODB_URI=
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d
------------------------------------------


#    User and Video model with Hooks and JWT, decrypt
====================================================================================


-> Front end engineers can only make a form and browse a file. They don't have authority to upoload a file.

-> So Backend enginners take care of uploading files.

-> Most file handling are not done in own server (In Production)

-> They are done by Third Parties Services or commonly AWS  ( depends on how big project, how many big files are being handled, what is the rate of calculation)

-> How to handle files is very important. Not every endpoint  doen't have files. 
    
    For example you might some files from '/register' but not from '/login'

-> It's not right way to write all code in Controller. It's better way to make a sepereate a Utility Function.

-> Sometimes we make middleware and sometimes Utility deopends on our goal.

-> Same concept is used for image video pdf.

-> Whereever upload is neccesery there we apply thru middleware.

-> Middleware job is before leving meet me and go



#       Cloudinary
==============================================================

Cloudinary is a cloud-based service that allows users to manage images and videos for websites and apps. 

It's used for a variety of purposes, including: 

Storing and managing media: Cloudinary allows users to upload, store, and manage images and videos. 

Manipulating media: Cloudinary offers a range of AI-powered transformations, such as resizing, auto-tagging, and generative fill. 

Delivering media: Cloudinary delivers media through a content delivery network (CDN) that's optimized for fast loading. 

Optimizing media: Cloudinary can automatically optimize images and videos for fast loading. 

Sharing media: Cloudinary allows users to share media assets across teams. 

Workflow automation: Cloudinary offers workflow automation to boost operational efficiency. 

Real-time video transcoding: Cloudinary's video API offers real-time video transcoding. 


# Use of Multer and Cloudinary
=============================================

-> we use multer - to upload the file and save it in local server for temporary

-> Then we use cloudinary and take the fiel from local server and place it on server.

-> The reason is to save the file in local server if it failed to upload we can reupload the file.




#   Code for Cloudinary 
==========================================================

-> Go to Utils ( you can save in a folder called service)

-> create a file called cloudinary.js

->  Using multer we upload the files to our local server  

-> we give the uploaded  'local file path'  in our local server in cloudinary code  to upload it on the cloud.

-> Once the file is uploaded successfully then we remove the file from our local server.



#    Node js File System 
=====================================================================

-----------------------------------------------------------------

-> https://nodejs.org/api/fs.html


-> fsPromise.unlink(path) - delete file - this is the terminology used in files system

---------------------------------------------------------------


# Configuration of Cloudinary API Keys
==============================================
------------------------------------------
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
--------------------------------------------



# Uploading files to Cloudinary using the localFilePath from the local server
======================================================================================

const uploadOnCloudinary = async (localFilePath) => {}



#   Creating Multer - As a Middleware
=======================================================================================

-> We use multer as middleware to check for every api if they require any upload then multer will come into picture and then uplaod
-> Meet me before you leave - middleware

-> Create a new file in Middleware called multer.middleware.js

-> We store in Disk storage  not in memory storage bacuse if any big files comes the memory will get overloaded and might crash

-> DiskStorage
    The disk storage engine gives you full control on storing files to disk.

-----------------------------------------------

const storage = multer.diskStorage({

    // Destination fo the file
  
    // Name of the uploaded File

  })
  
-------------------------------------------------

-> You can make updates in SETTING  file name in future



**************************************************************************************************************************

                Till Here We completed Project Setup - This is production Level

**************************************************************************************************************************

                                    

=============================================================================================================================

                                    
                                        Here Backend Journey Starts

                From Here - We will learn Controllers - where we build the end points

=============================================================================================================================

Here We need to Build the Logic

-> We need to do practice. 

-> When there is a big problem we divide it in small portions and solve it

-> This Logic cab be build by solving LeetCode Problems, Learning Data Structures, creating real World Problems (80-90%)

----------------------------------------------------------------------------------------------------------------------------


    
-> Go to Folder - Controllers

-> create a file called user.controller.js

-------------------------------------------------------------------------------------------

import asyncHandler from Utils

reason: 
The asyncHandler function is a utility designed to simplify error handling for asynchronous route handlers in an Express.js application. Here's a breakdown of how it works and what it helps with:

Purpose
In Express.js, when using asynchronous functions (like those involving database operations or API calls), any errors thrown or returned as promises need to be properly handled. If you don’t handle errors, they can crash your application or result in unhandled promise rejections.
-----------------------------------------------------------------------------------------------------------------------------

In user.controller.js
------------------------------------------

            import { asyncHandler } from "../utils/asyncHandler.js";


            // Create a Method to register User
            const registerUser= asyncHandler( async (req,res) => {
                res.status(200).josn({
                    message: "OK"
                })
            })

            export {registerUser}


// This code is simple code just sends a resonpse ok when the register is hit. 
---------------------------------------------

We first build the basic structure all project so now we will go to the routes

-> First we need to make routes to firstly make this register URL to hit.

---------------------------------------------------------
                    In Routes
---------------------------------------------------------

-> create file user.routes.js

                    import { Router } from "express";

                    const  router = Router()

                    export default router

-------------------------------------------------

---------------------------------------------------------------------
                    Importing Routes and Controllers
---------------------------------------------------------------------

-> We import all the routers and Controllers in most of the production cases in app.js

In app.js
-----------------------------
This is how the structure is going to be in app.js

        middleware
        routes
        controllers



----------------------------------------------------
        This is how routers work
----------------------------------------------------

Flowchart:       ( app.js ) -> ( user.routes.js )  ->  ( user.controller.js )

-> all the routes are imported in app.js

Example Route:  ->  app.use("/api/v1/users", userRouter)

********* url  ->   //http://localhost:8000/api/v1/users/  *********

This will redirect the req to userRouter (which is in user.routes.js)

-> And in user.routes.js

Example Route:  ->   userRouter.route("/register").post(registerUser)

********* url  ->   http://localhost:8000/api/v1/users/register  *********

This will again redirect the post to - > registerUser( which is user.controller.js)

where you have the code for handling the request: 

            // Create a Method to register User
            const registerUser= asyncHandler( async (req,res) => {
                res.status(200).josn({
                    message: "OK"
                })
            })


----------------------------------------------------
        Postman verification of API
----------------------------------------------------

-> GO to Postman and enter the api

-> test this url using POST Method -http://localhost:8000/api/v1/users/register


Response: - 
{
    "messege": "Imam aur Chai"
}

-------------------------------------------------------------------------------





=========================================================================================

        Logic Building | Register Controller

==========================================================================================




---------------------------------
        Handling Files
----------------------------------

-> For file handling we go to routes -> userRoutes and import  multer middleware's upload 

-> Now how to use this upload. we have to apply the middleware(multer's upload) just before the POST methods. see below

----------------------------------------
    Injecting Middleware in Routes
----------------------------------------

userRouter.route("/register").post(

    // Middleware for Files
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

    // POST method which redirects to user.controller.js (/register)
    registerUser
)
-------------------------------------------


=========================================================================================

        How to use Postman for Backend

==========================================================================================

-> Collections, Environment variables



=========================================================================================

        Access Refresh Token, Middleware and Cookies in Backend

=========================================================================================

-> Now lets talk about Access and Refresh Token

-> In user.model.js we have created two methods for 'generateRefreshToken' and 'generateAccessToken'

Access tokens
-------------------------
These tokens grant access to a resource for a limited time, usually a few hours. 
They are used to authenticate API requests to access protected resources. 
For example, a calendar app needs an access token to read a user's calendar events and create new ones.


Refresh tokens
-------------------------
These tokens are used to obtain new access tokens when the current ones expire. 
The responsibility of refresh token is to request for a new access token when the existing access token is expired.
They have a longer lifespan than access tokens, and can last for hours, days, or even years. 
Refresh tokens help maintain user sessions securely and efficiently, and reduce the need for users to re-enter their login credentials. 


-------------------------------------------------------------------------------------------------------------------------------------------

-> We can work only using access token they both are same. Just the expiry time is diffrent

-> untill you have access token you can perform the authentication works 

    For Example:- If you are logged in then i will allow you upload files

    If I expire your login session (access token) after 15 min because of security reason

    In this case you have to enter password again after 15 min and login

    This is place where 'Refresh Token' comes in picture Which expiry time is more

    We store Refresh Token on server and also give it to user as well

    We usually validate the user using access token but if it's expired we check for refresh token and the give new access token to user

    In this way we can keep the user sessions for longer times

---------------------------------------------------------------------------------------------------------------------------------------------


->  Now using 'generateRefreshToken' and 'generateAccessToken' we will make Login

--------------------------
        Login
--------------------------


---------------------------
    Logout
--------------------------

-> in login we had user details which we used to check in database and login user

But here we don't have acces to any data to logout user.

Here we will design out own middle ware to logout user

Middleware - Meet me before you leave


---------------------------------------------------

-> In Middleware -> auth.middleware.js

export const verifyJWT 


---------------------------
    user.routes.js
--------------------------
import { loginUser, registerUser } from "../controllers/user.controller.js";

// Login Route
router.route("/login").post(loginUser)



//******************  Secured Routes  ********************* */


// here we need to pass the middle ware just before the method is run ( verifyJWT )
router.route("/logout").post(verifyJWT, logoutUser)

*****************************************************************


=======================================================================

       Access Token and Refresh Token in Backend

========================================================================

-> Now we will perform testing on the register, login, logout

-> -------------------- All working ----------------


Now let's talkd about access token and refresh token. they are for user not to give email and password everytime.

-> access token is short lived (1day). After that User has to give email and password. The access token is generated again and supplied.

-> Now big firms introduced about two tokens 

    1. Access Token - short lived with user ( 15min, 1 hr....) - stored on user and database

    2. Session Storage (also called as refresh Token) - store in database

    Now refresh token is in database. Now once access token expires. user will get 401 request.

    Now front end engineer can do is : 

            If user wants to access a resourse and has 401 request 
            
            -> instead of asking user to login again 

            -> write a code to ---> 
            
            
                 If 401 request comes then hit a end point and refresh your 'access token'

                 In that request send a 'refresh Token' from user will me matched with the 'refreshToken' in th database.

                 Then a new refresh token and also access token is generated


------------------------------------------------------------------------------------------------

Now we are building a end point - If 401 request comes then hit a end point and refresh your 'access token'


-> Go to user.controller.js

create a end point -->  refreshAccessToken


// Refresh Token 
router.route("/refresh-token").post(refreshAccessToken)



=======================================================================

       Writing Update COntrollers for User

========================================================================


-> now we will make subscriber model

-> models -> subscription.model.js

-> define the schema and model and export


--------------------------------------------
Now let's write controllers for Password and acount details change
----------------------------------------------

-> In user.controller.js

-> Create these methods

changeCurrenrPassword,
getCurrentUser,
updateAccountDetails

--------------------------------------------------------------
            Now Files updating
------------------------------------------------------------
-> here we have to use multer to temporary files

-> In user.controller.js
-> create these methods

   updateUserAvatar,
   updateUserCoverImage

--------------------------------------------------------



=======================================================================

       understand the Subscription Schema

========================================================================


Here we undestand 

We get Subscribers -> by check the channels in number of objects it is in

and We get Channels -> by checking number of objects where the subscriber exists


=======================================================================

       Learn MongoDB Aggregation Pipeline - Joining data

========================================================================

-> here we join subscribers and channels using aggregation pipelines

-> Learn it in english channel from hitesh

-------------------------------------------------------------------------

Now we will create a new method to get the user channel details 

In user.controller.js
------------------------------------
create getUserChannelProfile



=======================================================================

       How to write sub pipelines and routes - Nested Lookup

=======================================================================

-> here we perform Nested Lookup 

-> Here we get the-> From Users  watch history -> in result we get "Videos" (in Videos we again have "owner" which is again a user)


In user.controller.js
------------------------------------
create getWatchHistory

TODO : Try keeping the pipeline ( Sub - Pipeline - 2.1  ( Map owner with User) )

    -> Take it outside as a separtate pipeline and see what happens and check what difference it makes


-------------------------------------------------------------------------------------------------


=======================================================================

       Adding the controllers to Routes

=======================================================================

-> Now all the controllers that we have created. we will add them to the routes ( which is creating endpoints )


-------------------------------------------------------------------

// Change Password
// Make sure you verify user middleware( verifyJWT )
router.route("/change-password").post(verifyJWT, changeCurrenrPassword)


=======================================================================

       Summary of our Backend Series

=======================================================================

We will see step by step how we built this app

-> .env
-> Production Folders Setup 
-> src/db/index.js                      - setup connection with database
-> src/index.js                         - entry file - connect DB and start Listening at PORT
-> src/app.js                           - importing and declaring middleware and routes
-> Utils                                - Created ApiResponse, ApiError, asyncHandler, Cloudinary utils
-> models/user.model.js                 - Created model using mongoose and 
                                          learned about Hooks (pre, password correctioin ), 
                                          bcrypt - encrypt password ( bcrypt.compare() )
                                          JWT also about generating Access Token and Refresh Token

        -> video.model.js
        -> subscription.model.js        - Where we learned Aggregation ( SDE - 2,3 - Level )

-> controllers/user.controller.js       - We we wrote almost 10 complex controllers (real world)
                                          Multer - upload files to local storage
                                          Cloudinary - store images to cloud and get a public url and store in DB
                                          How to retrive files
                                          Register
                                          Login....
                                          DB Queries (find, findById, findAndUpdate, findAndDelete, findOne)
                                          Logout
                                          Refresh Access Token
                                          change Password with verifyJWT ( auth.middleware.js )
                                          get current user with verifyJWT and auth middleware
                                          File management
                                          Get User Channel Profile and Get Watch History ( **********Very Hard )

-> routes/ user.routes.js               - After writing the controllers routing/ generating API calls


-> We also learned about if we want data from another model ( like from videos to users model) using aggregation pipeline (where we joined the different tables)


=======================================================================

       MongoDB models for like playlist and tweet

=======================================================================

-> Here we build the models of videos and tweets and then likes and comments section as well.


