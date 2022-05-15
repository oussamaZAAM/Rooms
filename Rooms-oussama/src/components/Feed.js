import React, { useContext, useState, useEffect } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "./Navbar";
import Post from "./Post";
// import { postCall } from "../apiCalls";
import axios from "axios"
import { AuthContext } from "../Context/authContext";
import AddPost from "./AddPost";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";

export default function Feed() {
  const showStyle = {display: "flex", flexDirection: "column"}
  const hideStyle = {display: "none"}
  const [notifStyle, setNotifStyle] = useState(hideStyle);
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgifClicked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const { user } = useContext(AuthContext);

  function handleNotif() {
    setIsNotifClicked(true)
    setIsMsgifClicked(false)
    setNotifStyle(prev=>(prev.display==="none" ? showStyle : hideStyle))
  }

  //Amener tous les publications du "backend"
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.date) - new Date(p1.date);
        })
      );
    };
    fetchPosts();
    const fetchLikes = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
      const likeNotif = []
      res.data.forEach(post=>{
           likeNotif.push(post.likes)
      })
      setLikeNotes(
        likeNotif.flat().sort((p1, p2) => {
          return new Date(p2[1]) - new Date(p1[1]);
        })
      );
    };
    fetchLikes();
    const fetchDislikes = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
      const dislikeNotif = []
      res.data.forEach(post=>{
           dislikeNotif.push(post.dislikes)
      })
      setDislikeNotes(
        dislikeNotif.flat().sort((p1, p2) => {
          return new Date(p2[1]) - new Date(p1[1]);
        })
      );
    };
    fetchDislikes();
  }, [user._id]);
  const likesNotif = likeNotes.map(x=>{
    return(
      <Notification 
        x={x}
        type={"like"}
      />
    )
  })
  const dislikesNotif = dislikeNotes.map(x=>{
    return(
      <Notification 
        x={x}
        type={"dislike"}
      />
    )
  })
  //Envoyer les publications chacune a sa composante avec ses "props"
  const myPosts = posts.map(x=>{
    if(!Array.isArray(x)){    
      return(
          <Post 
              key={x._id}
              id={x._id}
              desc={x.desc}
              img={x.photo}
              date={x.date}
              userId={x.userId}
              room={x.room}
              like={x.likes}
              disLike={x.dislikes}
              comments={x.comments}
              post={x}
              roomers={x.roomers}
              sharer={x.sharer}
              shareDesc={x.shareDesc}
              shareDate={x.shareDate}
          />
      )
    } else {
      return (x.map(x=>{
        return (
            <Post 
                key={x._id}
                id={x._id}
                desc={x.desc}
                img={x.photo}
                date={x.date}
                userId={x.userId}
                room={x.room}
                like={x.likes}
                disLike={x.dislikes}
                comments={x.comments}
                post={x}
            />
        )
      }))
    }})
  return(
        <>
            <Navbar handleNotif={handleNotif} />
            {isNotifClicked &&
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <div style={notifStyle} className="notification">
                <div className="notif-bell"><MdNotificationsActive /></div>
                {likesNotif}
                {dislikesNotif}
              </div>
              </motion.dev>
              </AnimatePresence>
            }
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="feed">
                <AddPost /> 
                {myPosts.length!==0 && myPosts }
            </div>
            </motion.dev>
            </AnimatePresence>
        </>
    )
}