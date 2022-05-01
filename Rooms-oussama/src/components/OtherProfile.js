import React, { useContext, useEffect, useState } from "react"
import Navbar from "./Navbar"
import cover from "../images/post1.jpg"
import { AiFillEdit } from "react-icons/ai"
import RoomCard from "./RoomCard"
import Post from "./Post"
import { Posts, Rooms } from "../dummyData"
import axios from "axios"
import { AuthContext } from "../Context/authContext"
import AddPost from "./AddPost"

export default function OtherProfile(props) {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    function userName(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return(users[i].username)
            }
        }
    }
    function userImg(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return(users[i].profilePicture)
            }
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/user/allusers");
        setUsers(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        );
        };
        fetchUsers();
    }, []);

    const Rooms1 = Rooms.filter(x=>{
        for(let i=0;i<x.roomers.length;i++){
            if(x.roomers[i].id==props.userId){
                return(
                    <RoomCard 
                        img={x.roomImg}
                        title={x.roomTitle}
                        roomers={x.roomers}
                        className="profile-col"
                    />
                )
            }
        }
    })
    const roomCards = Rooms1.map(x=>{
        for(let i=0;i<x.roomers.length;i++){
            if(x.roomers[i].id==props.userId){
                return(
                    <RoomCard 
                        key={x.roomId}
                        img={x.roomImg}
                        title={x.roomTitle}
                        roomers={x.roomers}
                        className="profile-col"
                    />
                )
            }
        }
    })
    
    useEffect(() => {
        const fetchPosts = async () => {
        const res = await axios.get("http://localhost:5000/api/posts/timeline/" + props.userId);
        setPosts(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        );
        };
        fetchPosts();
    }, [props.userId]);
    const otherPosts = posts.map(x=>{
        return(
           <Post 
                key={x._id}
                // post={x}
                desc={x.desc}
                img={x.photo}
                date={x.createdAt}
                userId={x.userId}
                room={x.room}
                roomers={x.roomers}
                vote={x.likeCount}
                comments={x.comments}
                handleUserId={props.handleUserId}
                />
    )})

    return(
        <div className="profile">
            <Navbar />
            <div className="profile-card">
                <div className="profile-images">
                    <AiFillEdit className="profile-cover-edit"/>
                    <img className="profile-cover" src={cover} />
                    <img className="profile-pic" src={cover} />
                    <AiFillEdit className="profile-pic-edit"/>
                </div>
                <div className="profile-name">
                    <h1>{userName(props.userId)}</h1>
                </div>
                <div className="profile-desc">
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Fusce justo elit, volutpat sit amet cursus non, convallis vel nibh. 
                    Suspendisse potenti. 
                    Sed accumsan sapien faucibus metus pellentesque, sit amet accumsan diam imperdiet. 
                    Morbi eget nisl tempus, molestie est vel, vehicula lorem. Nulla facilisi.
                    </p>
                </div>
            </div>
            <div className="profile-rooms">
                <h1 className="rooms-title">Rooms</h1>
                <div className="profile-room-grid">
                    {roomCards.length!=0
                        ? roomCards
                        : <h1 className="how-empty">How Empty</h1>
                    }
                </div>
                {roomCards.length!=0
                    ? <div><button className="allrooms-button">See all Rooms</button></div>
                    : <div><button className="allrooms-button">See new Rooms</button></div>
                }
            </div>
            {otherPosts}
        </div>
    )
} 