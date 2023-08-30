import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./join.css"

const Join = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");

  return (
    <>
      <section id="main-container">
        <h1>Chat Room</h1>
        <div>
          <input placeholder="Name" type="text" className="room-inputs" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <input placeholder="Create Room" type="text" className="room-inputs" onChange={(e) => setRoom(e.target.value)} />
        </div>
        <div>
          <input placeholder="Join Room" type="text" className="room-inputs" onChange={(e) => setJoinRoom(e.target.value)} />
        </div>
        <Link onClick={(e) => ((!username || (!room && !joinRoom))) ? e.preventDefault() : null} to={`/chat?username=${username}&room=${room || joinRoom}`}>
          <button id="button-room">{room ? "Create Room" : "Join Room"}</button>
        </Link>
      </section>
    </>
  );
}

export default Join;