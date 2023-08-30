import React, { useEffect, useState } from "react"
import queryString from "query-string"
import io from "socket.io-client"
import Headerbar from "../headerbar/headerbar";
import Input from "../input/input";
import "./chat.css"
import Messages from "../messages/messages";
let socket;
const Chat = ({ location }) => {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setmessages] = useState([])
  const URL = 'http://localhost:5000'
  useEffect(() => {
    const { username, room } = queryString.parse(location.search)
    socket = io(URL)
    setUsername(username)
    setRoom(room)
    socket.emit('join', { username, room }, () => {

    })
    return () => {
      socket.emit('disconnection')
      socket.off()
    }

  }, [URL, location.search])
  useEffect(() => {
    socket.on('message', (message) => {
      setmessages([...messages, message])
    })
  }, [messages])


  const sendmessage = (e) => {
    e.preventDefault()
    if (message) {
      socket.emit('sendmessage', message, () => setMessage(""))
    }
  }
  console.log(message, messages)
  return (
    <div className="outerContainer">
      <div className="container">
        <Headerbar room={room} />
        <Messages messages={messages} username={username} />
        <Input message={message} sendmessage={sendmessage} setMessage={setMessage} />
        
       
      </div>
    </div>
  )
}
export default Chat