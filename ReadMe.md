# YouTube Backend Project

This repository contains the backend implementation of a YouTube-like application built with **Node.js**, **Express.js**, and **MongoDB**. It integrates several production-level packages for enhanced functionality and maintainability.

## Features
- User authentication with JWT and bcrypt
- File uploads using Multer and Cloudinary
- Modular architecture for scalability
- Aggregation pipelines for MongoDB queries
- Middleware for error handling and file management

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Cloudinary** for media management
- **Multer** for file uploads

## Dependencies
```bash
bcrypt
cloudinary
cookie-parser
cors
dotenv
express
jsonwebtoken
mongoose
mongoose-aggregate-paginate-v2
multer
```

## Getting Started
Follow the steps below to set up and run the project on your local machine.

### Prerequisites
- Node.js installed on your system
- MongoDB Atlas account for database setup

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Shaik-36/youtube-backend-app.git
    cd youtube-backend-app
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```plaintext
      PORT=8000
      MONGODB_URI=<Your MongoDB URI>
      CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
      CLOUDINARY_API_KEY=<Your Cloudinary API Key>
      CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
      ACCESS_TOKEN_SECRET=<Your Access Token Secret>
      ACCESS_TOKEN_EXPIRY=1d
      REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
      REFRESH_TOKEN_EXPIRY=10d
      ```
4. **Start the server:**
    ```bash
    npm start
    ```
    The server will start on the port specified in the `.env` file (default is 8000).

## Project Structure
```plaintext
.
├── public/               # Static assets (if any)
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # API controllers
│   ├── middlewares/      # Middleware functions
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app setup
│   └── index.js          # Application entry point
├── .env.sample           # Example environment variables
├── package.json          # Node.js dependencies
├── README.md             # Project documentation
└── ...
```

## Database Setup
### MongoDB Atlas
1. Visit [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new cluster and obtain your connection URI.
3. Update the `MONGODB_URI` in your `.env` file.

### Database Connection
You can connect to the database using one of the following approaches:

**Approach 1: In `index.js`**
```javascript
import mongoose from "mongoose";
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
})();
```

**Approach 2: Modular DB File**
1. Create a `db` folder in `src/`.
2. Add a `db.js` file to manage the connection:
    ```javascript
    import mongoose from "mongoose";

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
      } catch (error) {
        console.error("Database connection error", error);
        throw error;
      }
    };

    export default connectDB;
    ```
3. Import and call this function in `index.js`.

## API Endpoints
### User Endpoints
- **POST** `/api/v1/users/register` - Register a new user
- **POST** `/api/v1/users/login` - User login
- **POST** `/api/v1/users/logout` - User logout (secured with middleware)
- **POST** `/api/v1/users/refresh-token` - Refresh access token
- **POST** `/api/v1/users/change-password` - Change user password (secured)

### File Uploads
- Middleware with Multer handles temporary file uploads.
- Uploaded files are stored in Cloudinary.

## Error Handling
The application uses custom middleware for error handling. Common error types include:
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **500:** Internal Server Error

## Testing APIs
Use [Postman](https://www.postman.com/) or any API client to test the endpoints. Example:
- URL: `http://localhost:8000/api/v1/users/register`
- Method: `POST`
- Body:
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```

## Additional Features
- **JWT Authentication:** Bearer tokens for access and refresh tokens.
- **Cloudinary Integration:** Upload and manage files in the cloud.
- **Aggregation Pipelines:** Efficient data queries in MongoDB.
- **Multer Middleware:** Disk storage for temporary files.

---

This project lays the foundation for a robust backend application and can be scaled for production-level deployments.

