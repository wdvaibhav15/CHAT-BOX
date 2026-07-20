// import express from "express";
// import { protect } from "../middlewares/auth.js";
// import { addUserStory, getStories } from "../controllers/storyController.js";

// const storyRouter = express.Router();

// storyRouter.post("/create", upload.single("media"), protect, addUserStory)
// storyRouter.get("/get", protect, getStories)

// export default storyRouter
import express from "express";
import { protect } from "../middlewares/auth.js";
import { addUserStory, getStories } from "../controllers/storyController.js";
import { upload } from "../configs/multer.js"; // 👈 FIX: Added curly braces around upload

const storyRouter = express.Router();

// Changed to upload.array to match the req.files expected by your controller logic
storyRouter.post("/create", upload.array("media"), protect, addUserStory);
storyRouter.get("/get", protect, getStories);

export default storyRouter;