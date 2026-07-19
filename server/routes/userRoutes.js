import express from "express";
import { 
    getUserData, 
    updateUserData, 
    discoverUsers, 
    followUser, 
    unfollowUser, 
    sendConnectionRequest, 
    acceptConnectionRequest, 
    getUserConnections} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";

const userRoutes = express.Router();

userRoutes.get("/data", protect, getUserData)
userRoutes.post("/update", upload.fields([{name: "profile", maxCount: 1}, {name: "cover", maxCount: 1}]), protect, updateUserData)

userRoutes.post("/discover", protect, discoverUsers)
userRoutes.post("/follow", protect, followUser)
userRoutes.post("/unfollow", protect, unfollowUser)

userRoutes.post("/connect", protect, sendConnectionRequest)
userRoutes.post("/accept", protect, acceptConnectionRequest)
userRoutes.get("/connections", protect, getUserConnections)

export default userRoutes