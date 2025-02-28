/** @format */

import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import StoryReel from "../story/StoryReel";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res =
        username !== user._id
          ? await axios.get("/posts/profile/" + username)
          : await axios.get("posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      {/* <StoryReel/> */}
      <div className="feedWrapper">
        {username === user.username ? <Share /> : ""}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
