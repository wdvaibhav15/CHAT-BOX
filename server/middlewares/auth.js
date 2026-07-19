// export const protect = async (req, res, next) => {
//     try {
//         const {userId} = await req.auth();
//         if(!userId){
//             return res.status(401).json({success: false, message: "Unauthorized"})
//         }
//         next()
//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }
// }
import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
    try {
        // Clerk attaches auth state using getAuth(req) 
        const { userId } = getAuth(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}