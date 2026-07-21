

// import imagekit from "../configs/imageKit.js";
// import { inngest } from "../inngest/index.js";
// import Story from "../models/story.js";
// import User from "../models/user.js";

// // add User Story
// export const addUserStory = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { content, media_type, background, background_color } = req.body; 
        
//         const files = req.files || []; 
//         let media_url = "";

//         // upload media to imagekit if it exists and matches type requirements
//         if ((media_type === "image" || media_type === "video") && files.length > 0) {
//             const mediaFile = files[0];
            
//             const fileBase64 = mediaFile.buffer.toString("base64");
            
//             // ✅ Pass raw Buffer directly to ImageKit instead of Base64
//             const response = await imagekit.upload({
//                 file: mediaFile.buffer,
//                 fileName: mediaFile.originalname,
//                 folder: "stories"
//             });
            
//             media_url = response.url;
//         }
        
//         const story = await Story.create({
//             user: userId,
//             content,
//             media_url, 
//             media_type,
//             background_color: background_color || background
//         });

//         await inngest.send({
//             name: "app/story-delete",
//             data: {
//                 storyId: story._id
//             }
//         });
        
//         res.json({ success: true, message: "Story added successfully", story });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // get user story
// export const getStories = async (req, res) => {
//     try {
//         const { userId } = req.auth();
        
//         const user = await User.findOne({ clerkId: userId }) || await User.findById(userId);

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         const userIds = [user._id, ...(user.connections || []), ...(user.following || [])];
        
//         const stories = await Story.find({
//             user: { $in: userIds }
//         }).populate("user").sort({ createdAt: -1 });

//         res.json({ success: true, stories });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };
import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Story from "../models/story.js";
import User from "../models/user.js";

// add User Story
export const addUserStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, media_type, background, background_color } = req.body; 
        
        const files = req.files || []; 
        let media_url = "";

        // Upload media to ImageKit if it exists
        if ((media_type === "image" || media_type === "video") && files.length > 0) {
            const mediaFile = files[0];
            
            // Format as a complete Base64 Data URI
            const fileBase64 = `data:${mediaFile.mimetype};base64,${mediaFile.buffer.toString("base64")}`;
            
            const response = await imagekit.upload({
                file: fileBase64,
                fileName: mediaFile.originalname,
                folder: "stories"
            });
            
            media_url = response.url;
        }
        
        const story = await Story.create({
            user: userId,
            content,
            media_url, 
            media_type,
            background_color: background_color || background
        });

        await inngest.send({
            name: "app/story-delete",
            data: {
                storyId: story._id
            }
        });
        
        res.json({ success: true, message: "Story added successfully", story });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// get user story
export const getStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        
        const user = await User.findOne({ clerkId: userId }) || await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const userIds = [user._id, ...(user.connections || []), ...(user.following || [])];
        
        const stories = await Story.find({
            user: { $in: userIds }
        }).populate("user").sort({ createdAt: -1 });

        res.json({ success: true, stories });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};