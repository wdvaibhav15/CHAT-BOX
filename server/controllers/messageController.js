//  import fs from "fs";
//  import imagekit from "../configs/imageKit.js";
//  import Message from "../models/message.js";
//  import User from "../models/user.js";


// // Create an empty object to store server side Event connections
// const connections = {};

// // Controller fnction for server side event endpoints
// export const sseController = (req, res) => {
//     const { userId } = req.params;
//     console.log("New client connected : ", userId);

//     //set ssv hearders
//     res.setHeader("Content-type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");
//     res.setHeader("Access-Control-Allow-Origin", "*");

//     // add the client's response object to the connections object
//     connections[userId] = res;

//     //send an initial event to the client
//     res.write("log: Connected to SSE stream\n\n");

//     //Handle clienr disconnection
//     req.on("close", () => {
//         // Remove the client's response object from the connections array
//         delete connections[userId];
//         console.log("Client disconnected");
//     })

// };


// // send message
// export const sendMessage = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { to_user_id , text } = req.body;
//         const image = req.file;

//         let media_url = "";
//         let message_type = image ? "image" : "text";

//         if(message_type === "image"){
//             const fileBuffer = fs.readFileSync(image.path);
//             const response = await imagekit.upload({
//                 file: fileBuffer,
//                 fileName: image.originalname,
                
//             });
//             media_url = imagekit.url({
//                 path: response.filePath,
//                 transformation: [
//                     { quality: "auto" },
//                     { format: "webp" },
//                     { width : "1280"}
//                 ]
//             })
//         }

//         const  message = await Message.create({
//             from_user_id: userId,
//             to_user_id,
//             text,
//             media_url,
//             message_type
//         })
//         res.json({ success: true, message });

//         // send message to to_user_id using sse
//         const messageWithUserData = await Message.findById(message._id).populate("from_user_id");
        
//         if(connections[to_user_id]){
//             connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

import imagekit from "../configs/imageKit.js";
import Message from "../models/message.js";
import User from "../models/user.js";

// Store server-side Event connections
const connections = {};

// SSE Controller
export const sseController = (req, res) => {
    const { userId } = req.params;
    console.log("New client connected:", userId);

    // Set standard SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Store client connection
    connections[userId] = res;

    // Initial connection event
    res.write(`data: ${JSON.stringify({ message: "Connected to SSE stream" })}\n\n`);

    // Handle client disconnect
    req.on("close", () => {
        delete connections[userId];
        console.log(`Client disconnected: ${userId}`);
    });
};

// Send Message Controller
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = "";
        let message_type = image ? "image" : "text";

        if (message_type === "image" && image) {
            // Convert buffer directly to Base64 (no fs needed)
            const fileBase64 = image.buffer.toString("base64");

            const response = await imagekit.upload({
                file: fileBase64,
                fileName: image.originalname,
                folder: "messages"
            });

            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1280" }
                ]
            });
        }

        // Save message to database
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            media_url,
            message_type
        });

        // Respond back immediately to the sender
        res.json({ success: true, message });

        // Push real-time event via SSE to recipient if connected
        const messageWithUserData = await Message.findById(message._id).populate("from_user_id");

        if (connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Chat messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        // 👈 FIX: Access via req.params or req.query instead of req.body for GET requests
        const { to_user_id } = req.params; 

        if (!to_user_id) {
            return res.json({ success: false, message: "Target user ID is required" });
        }

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).sort({ createdAt: 1 }); // 👈 FIX: Sort 1 (oldest to newest) for proper chat reading flow

        // Mark incoming unread messages as seen
        await Message.updateMany({ 
            from_user_id: to_user_id,
            to_user_id: userId,
            seen: false // 👈 Optimization: Only update messages that haven't been seen yet
        }, { seen: true });
        
        res.json({ success: true, messages });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// get user recent messages

// export const getUserRecentMessages = async(req, res) => {
//     try {
//         const { userId } = req.auth();
        
//         const messages = await Message.find({to_user_id: userId}).populate("from_user_id to_user_id").sort({createdAt: -1});
//         res.json({success: true, messages})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message})
//     }
// }
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Find all messages where the logged-in user is either sender OR recipient
        const messages = await Message.find({
            $or: [
                { from_user_id: userId },
                { to_user_id: userId }
            ]
        })
        .populate("from_user_id to_user_id")
        .sort({ createdAt: -1 });

        // Map to hold only the most recent message per conversation partner
        const recentMessagesMap = new Map();

        messages.forEach((msg) => {
            // Determine who the other person in the chat is
            const partnerId = msg.from_user_id._id.toString() === userId 
                ? msg.to_user_id._id.toString() 
                : msg.from_user_id._id.toString();

            // Since messages are sorted newest first, keep only the first encountered message for each partner
            if (!recentMessagesMap.has(partnerId)) {
                recentMessagesMap.set(partnerId, msg);
            }
        });

        // Convert the map values back to an array
        const recentMessages = Array.from(recentMessagesMap.values());

        res.json({ success: true, messages: recentMessages });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};