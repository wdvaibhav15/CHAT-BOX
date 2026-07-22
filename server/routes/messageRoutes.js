// import express from "express";
// import { 
//     getChatMessages,
//     sendMessage,
//     sseController
//  } from "../controllers/messageController.js";
// import { protect } from "../middlewares/auth.js";
// import { upload } from "../configs/multer.js";

// const messageRouter = express.Router();


// messageRouter.get("/:userId", sseController)
// messageRouter.post("/send", upload.single("image"),protect, sendMessage )
// messageRouter.post("/get", protect, getChatMessages)


// export default messageRouter
import express from "express";
import { 
    getChatMessages,
    sendMessage,
    sseController
} from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const messageRouter = express.Router();

// 1. Separate SSE route prefix so it doesn't hijack regular requests
messageRouter.get("/sse/:userId", sseController);

// 2. Align Multer field name to match frontend ('media')
messageRouter.post("/send", upload.single("image"), protect, sendMessage);

// 3. Fix GET history route to include the target user ID param
messageRouter.get("/get/:to_user_id", protect, getChatMessages);

export default messageRouter;