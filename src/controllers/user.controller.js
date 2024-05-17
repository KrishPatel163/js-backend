import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        // console.log("access Token: ", accessToken)
        // console.log("refresh Token: ", refreshToken)

        user.refreshToken = refreshToken;
    
        await user.save({ validateBeforeSave: false })
    
        return {accessToken, refreshToken} 
        
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal Server while making access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    let coverImage // To store the uploaded coverImage
    try {
        // Get user detail from frontend
        const {username, fullName, email, password} = req.body
    
        // Check for validations
        if(
            [username, fullName, email, password].some((fields) => fields?.trim() === "")
        ){
            throw new ApiError(400, "All fields are required")
        }
    
        // Check if the user already exists or not
        const existingUser = await User.findOne({
            $or: [ {username},{email} ]
        })
    
        if(existingUser) { throw new ApiError(409, "User already exists with that username or email") }
    
        // Check for the incoming image, Avatar and coverImage
        const avatarFilePath = req.files?.avatar[0]?.path
    
        if(!avatarFilePath){
            throw new ApiError(400, "Avatar file is required")
        }
    
        let coverImageLocalPath;
        console.log(req.files)
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
            coverImage = await uploadToCloudinary(coverImageLocalPath)
        }
        
        const avatar = await uploadToCloudinary(avatarFilePath)
        if(!avatar){
            throw new ApiError(400, "avatar file is required")
        }
        // Create new user
        const user = await User.create({
            username: username.toLowerCase(),
            email: email,
            password:password,
            fullName: fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
    } catch (error) {
        console.log(error)
    }

})

const loginUser = asyncHandler( async (req, res) => {
    try {
        // Get the data from the form
        const {username, email, password} = req.body
    
        // Validate if they are present or not
    
        if(!username && !email){ throw new ApiError(401, "Username or Email is required for login") }
    
        // Find if the user exists or not
    
        const user = await User.findOne(
            { $or: [{username}, {email}] }
        )
        // Show error if the user doesnt exists
    
        if(!user) { throw new ApiError(400, "No user found") }
    
        // Compare the hashed password with the one in storage
    
        const correctPassword = await user.isPasswordCorrect(password)
    
        // Show error if the password is not correct
    
        if(!correctPassword) { throw new ApiError(401, "password is not correct") }
    
        // Generate access and refresh tokens
        const {accessToken, refreshToken}  = await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        const cookieOptions = {
            httpOnly: true,
            secure: true
        }
    
        return res
                .status(200)
                .cookie("accessToken", accessToken, cookieOptions)
                .cookie("refreshToken", refreshToken, cookieOptions)
                .json(
                    new ApiResponse(200,
                        {
                        user: {
                            loggedInUser
                        },
                        accessToken: accessToken,
                        refreshToken, refreshToken 
                    },
                    "User Logged In successfully")
                )
    } catch (error) {
        
    }
})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(
                new ApiResponse(200, { },"user Logged out successfully")
            )
})
export {
    registerUser,
    loginUser,
    logoutUser
}