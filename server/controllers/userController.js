import Connection from "../models/connection.js"
import User from "../models/user.js"
import fs from "fs"
import imagekit from "../configs/imageKit.js"
import Post from "../models/post.js"

// get user data using userId
export const getUserData = async(req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json({success: false, message: "User Not Found"});
        }
        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// update the user data 

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);

    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    username = username?.trim() || tempUser.username;

    if (tempUser.username !== username) {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const updatedData = {
      username,
      bio: bio ?? tempUser.bio,
      location: location ?? tempUser.location,
      full_name: full_name ?? tempUser.full_name,
    };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    if (profile) {
      const response = await imagekit.upload({
        file: profile.buffer.toString("base64"),
        fileName: profile.originalname,
        folder: "/chat-box/profile",
        useUniqueFileName: true,
      });

      const profileUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });

      updatedData.profile_picture = profileUrl;
    }

    if (cover) {
      const response = await imagekit.upload({
        file: cover.buffer.toString("base64"),
        fileName: cover.originalname,
        folder: "/chat-box/cover",
        useUniqueFileName: true,
      });

      const coverUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });

      updatedData.cover_photo = coverUrl;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

// find users using username , email, location, and name
export const discoverUsers = async(req, res) => {
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
        const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);
        res.json({success: true, users: filteredUsers})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// follow an user 
export const followUser = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
          
        const user = await User.findById(userId);
        if(user.following.includes(id)){
            return res.json({success: false, message: "You are already following this user"});
        }
        user.following.push(id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers.push(userId);
        await toUser.save();

        res.json({success: true, message: "User followed successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// unfollow an user 
export const unfollowUser = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
          
        const user = await User.findById(userId);
        user.following = user.following.filter(uid => uid.toString() !== id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.followers = toUser.followers.filter(uid => uid.toString() !== userId);
        await toUser.save();

        res.json({success: true, message: "User unfollowed successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// send connection request
export const sendConnectionRequest = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // check if user has sent more than 20  connection requests in the lasta 23 hours 
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const connectionRequests = await Connection.find({from_user_id: userId, createdAt: {$gte: last24Hours}});
        if(connectionRequests.length >= 20){
            return res.json({success: false, message: "You have sent too many connection requests in the last 24 hours"});
        }
        // check if users are already connected or not
        const connection = await Connection.findOne({
           $or:  [
            {form_user_id: userId, to_user_id: id},
            {form_user_id: id, to_user_id: userId},
            ]
        });

        if(!connection){
            const newConnection = await Connection.create({
                form_user_id: userId,
                to_user_id: id
            })

            await inngest.send({
                name: "app/connection-request",
                data: {
                    connectionId: newConnection._id
                }
            })


            return res.json({success: true, message: "Connection request sent successfully"})
        }else if (connection && connection.status === "accepted"){
            return res.json({success: false, message: "You are already connected with this user"});
        }
        return res.json({success: false, message: "connection request is pending"});
        

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// get user connection
export const getUserConnections = async(req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId).populate( "connections followers following")

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = (await Connections.find({
            to_user_id: userId,
            status: "pending"
        }).populate("from_user_id")).map(connection => connection.from_user_id);

        res.json({success: true, connections, followers, following, pendingConnections})

       } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Accept connection Requests
export const acceptConnectionRequest = async(req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;
        const connection = await Connection.findOne({
            from_user_id: id,
            to_user_id: userId
        })
        if(!connection){
            return res.json({success: false, message: "Connection not found"});
        }

        const user = await User.findById(userId);
        user.connectionRequests.push(id);
        await user.save()

        const toUser = await User.findById(id);
        toUser.connections.push(userId);
        await toUser.save()

        connection.status = "accepted";
        await connection.save();

        res.json({ success: true, message: "Connection accepted successfully" });
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
// get user profiles
export const getUserProfiles = async(req, res) => {
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId)
        if(!profile){
            return res.json({success: false, message: "Profile not found"});
        }
        const posts = await Post.find({user: profileId}).populate("user");
        res.json({success: true, profile, posts})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}