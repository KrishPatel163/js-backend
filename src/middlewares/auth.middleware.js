import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler( async (req, _, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Brearer ", "")

        if(!token){
            throw new ApiError(401, "Token not found")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT)

        const user = await User.findById(decodedToken._id)

        if(!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        throw new ApiError(500, error?.message || "something went wrong while verifying the token")
    }
} )