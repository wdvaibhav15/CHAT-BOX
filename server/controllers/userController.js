import User from "../models/user.js"
import fs from "fs"
import imagekit from "../configs/imageKit.js"

// get user fata using userId
export const grtUserData = async(req,res) => {
    try {
        const {usrerId} = req.auth();
        const user = await User.findById(usrerId)
        if(!user){
            return res.status(401).json({success: false, message: "User Not Found"});
        }
        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }

// update the user data 
export const updateUserData = async(req,res) => {
    try {
        const {usrerId} = req.auth();
        const { username, bio, location, full_name } = req.body; // {username, bio, location full_name}
        const tempUser = await User.findById(usrerId)

        !username && (username = tempUser.username);

        if(tempUser.username !== username){
            const user = User.findOne({username})
            if(user){
                username = tempUser.username
                return res.status(401).json({success: false, message: "Username already taken"});
            }
        }
        const updateData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0];
        const cover = req.files.cover && req.files.cover[0];
        
        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file:buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({

                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { formate: "webp" },
                    { width : "512"}
                ]
            })
            updatedData.profile_picture = url
        }

        
        // for cover progile picture
        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file:buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({

                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { formate: "webp" },
                    { width : "1280"}
                ]
            })
            updatedData.cover_picture = url
        }

        const user = await User.findByIdAndUpdate(usrerId, updateData, {new: true});
        res.json({success: true, user, message: "Profile Updated Successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }

//  find users using username , email, location, and name
export const discoverUsers = async(req,res) => {
    try {
        const { userId } = req.auth();
        const { input } = req.body;
        const allUsers = await User.find(
            {
                $or:[
                    {username: new RegExp(input, "i")},
                    {email: new RegExp(input, "i")},
                    {full_name: new RegExp(input, "i")},
                    {location: new RegExp(input, "i")}
                ]
            }
        )
        const filteredUsers = allUsers.filter(user=> user._id !== userId);
        res.json({success: true, users: filteredUsers})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }

 // follow an user 
 export const followUser = async(req,res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
         
        const user = await User.findById(userId);
        if(user.following.includes(id)){
            return res.json({success: false, message: "You are already following this user"});
        }
        user.following.push(id);
        await user.save();

        const toUser = await user.findById(id);
        toUser.followers.push(userId);
        await toUser.save();

        res.json({success: true, message: "User followed successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }

 // unfollow an user 
 export const unfollowUser = async(req,res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
         
        const user = await User.findById(userId);
        user.following = user.following.filter(user => user !== id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(user => user !== userId);
        await toUser.save();

        res.json({success: true, message: "User unfollowed successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}