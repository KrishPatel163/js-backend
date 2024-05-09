import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullName, email, password, avatar, coverImage} = req.body

    // console.log(username, fullName, email, password, avatar, coverImage)
    console.log(req)
    res.status(200).json({
        message: "ok",
    })
})

export {
    registerUser,
}