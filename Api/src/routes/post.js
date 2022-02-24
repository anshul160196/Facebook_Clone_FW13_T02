const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
//create a post

router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(200).send(newPost);
  } catch (err) {
    res.status(500).send(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send("post has been update");
    } else {
      res.status(403).send("you can update only your post");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send("post has been delete");
    } else {
      res.status(403).send("you can delete only your post");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// like or dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("The post has been disliked");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});
// get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.send(userPost.concat(...friendPosts));
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
