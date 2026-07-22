

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
// export const sendMessage = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { to_user_id, text } = req.body;
//         const image = req.file;

//         let media_url = "";
//         let message_type = image ? "image" : "text";

//         if (message_type === "image" && image) {
//             // Convert buffer directly to Base64 (no fs needed)
//             const fileBase64 = image.buffer.toString("base64");

//             const response = await imagekit.upload({
//                 file: fileBase64,
//                 fileName: image.originalname,
//                 folder: "messages"
//             });

            

//             media_url = imagekit.url({
//                 path: response.filePath,
//                 transformation: [
//                     { quality: "auto" },
//                     { format: "webp" },
//                     { width: "1280" }
//                 ]
//             });
//         }

//         // Save message to database
//         const message = await Message.create({
//             from_user_id: userId,
//             to_user_id,
//             text,
//             media_url,
//             message_type
//         });

//         // Respond back immediately to the sender
//         res.json({ success: true, message });

//         // Push real-time event via SSE to recipient if connected
//         const messageWithUserData = await Message.findById(message._id).populate("from_user_id");

//         if (connections[to_user_id]) {
//             connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = "";
        let message_type = image ? "image" : "text";

        if (image) {
            // Convert buffer directly to Base64
            const fileBase64 = image.buffer.toString("base64");

            // Upload directly to ImageKit
            const response = await imagekit.upload({
                file: fileBase64,
                fileName: image.originalname || `chat_${Date.now()}`,
                folder: "messages"
            });

            // ✅ FIXED: Use response.url directly from ImageKit
            media_url = response.url;
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
        if (connections[to_user_id]) {
            const messageWithUserData = await Message.findById(message._id).populate("from_user_id");
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Chat messages
// export const getChatMessages = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         // 👈 FIX: Access via req.params or req.query instead of req.body for GET requests
//         const { to_user_id } = req.params; 

//         if (!to_user_id) {
//             return res.json({ success: false, message: "Target user ID is required" });
//         }

//         const messages = await Message.find({
//             $or: [
//                 { from_user_id: userId, to_user_id },
//                 { from_user_id: to_user_id, to_user_id: userId },
//             ]
//         }).sort({ createdAt: 1 }); // 👈 FIX: Sort 1 (oldest to newest) for proper chat reading flow

//         // Mark incoming unread messages as seen
//         await Message.updateMany({ 
//             from_user_id: to_user_id,
//             to_user_id: userId,
//             seen: false // 👈 Optimization: Only update messages that haven't been seen yet
//         }, { seen: true });
        
//         res.json({ success: true, messages });
        
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.params; // Read from URL params

        if (!to_user_id) {
            return res.json({ success: false, message: "Target user ID is required" });
        }

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany({ 
            from_user_id: to_user_id,
            to_user_id: userId,
            seen: false 
        }, { seen: true });
        
        return res.json({ success: true, messages });
        
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


// get user recent messages
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