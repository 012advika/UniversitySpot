import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); //grab all the posts from database and display it in the frontend
router.get("/:userId/posts", verifyToken, getUserPosts); // To grab a specific user's post based on userId

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); //To line or unlike post

export default router;
