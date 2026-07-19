import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/post.js";
import User from "../models/user.js";


//add posts
 export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {content, post_type } = req.body;
        const images = req.files;
        let image_urls = [];
        if(images.length){
            image_urls = await Promise.all(
                image.map(async(image)=>{
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts"
                    })
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: "auto" },
                            { format: "webp" },
                            { width : "1280"}
                        ]
                    })
                    return url
                })
            )
        }
        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({success: true, message: "Post added successfully"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
 }

 // get posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)

        //user connections and followings
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: userIds}}).populate("user").sprt({createdAt: -1});

        res.json({success: true, posts})


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// like posts
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postid } = req.body;

        const post = await Post.findById(postId)
        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({success: true, message: "Post unliked successfully"})
        }else{
            post.likes_count.push(userId)
            await post.save()
            res.json({success: true, message: "Post liked successfully"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
