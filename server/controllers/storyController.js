
// import imagekit from "../configs/imageKit.js";
// import { inngest } from "../inngest/index.js";
// import Story from "../models/story.js";
// import User from "../models/user.js";

// // add User Story
// export const addUserStory = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { content, media_type, background_color } = req.body;
        
//         // Multer processes files into an array under req.files
//         const files = req.files || []; 
//         let media_url = "";

//         // upload media to imagekit if it exists and matches type requirements
//         if ((media_type === "image" || media_type === "video") && files.length > 0) {
//             const mediaFile = files[0]; // Extract the primary file from the array
            
//             // Convert memory buffer straight to a base64 string
//             const fileBase64 = mediaFile.buffer.toString("base64");
            
//             const response = await imagekit.upload({
//                 file: fileBase64,
//                 fileName: mediaFile.originalname,
//                 folder: "stories" // Clean organization for your media folder structures
//             });
            
//             media_url = response.url;
//         }
        
//         // create story
//         await Story.create({
//             user: userId,
//             content,
//             media_url, // Fixed mismatch: now accurately references media_url string variables
//             media_type,
//             background_color
//         });

//         // schedule story deletion after 24 hours
//         await inngest.send({
//             name: "app/story-delete",
//             data: {
//                 storyId: story._id
//             }
//         })
        
//         res.json({ success: true, message: "Story added successfully" });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // get user story
// export const getStories = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         // user connections and followings
//         const userIds = [userId, ...(user.connections || []), ...(user.following || [])];
        
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
        // Read 'background' or 'background_color' to handle both frontend & backend names
        const { content, media_type, background, background_color } = req.body; 
        
        // Multer processes files into an array under req.files
        const files = req.files || []; 
        let media_url = "";

        // upload media to imagekit if it exists and matches type requirements
        if ((media_type === "image" || media_type === "video") && files.length > 0) {
            const mediaFile = files[0]; // Extract the primary file from the array
            
            // Convert memory buffer straight to a base64 string
            const fileBase64 = mediaFile.buffer.toString("base64");
            
            const response = await imagekit.upload({
                file: fileBase64,
                fileName: mediaFile.originalname,
                folder: "stories" // Clean organization for your media folder structures
            });
            
            media_url = response.url;
        }
        
        // ✅ FIXED: Save the created document instance into the 'story' variable
        const story = await Story.create({
            user: userId,
            content,
            media_url, 
            media_type,
            background_color: background_color || background
        });

        // ✅ FIXED: Now 'story._id' exists and won't crash!
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
        
        // Find user by Clerk ID or Mongo ID
        const user = await User.findOne({ clerkId: userId }) || await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // user connections and followings
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