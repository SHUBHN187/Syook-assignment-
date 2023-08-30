import ScrollToBottom from "react-scroll-to-bottom"
import Message from "../message/message"
import "./messages.css"
const Messages=({messages,username})=>

  (
        <>
<ScrollToBottom className="messages">
    {messages.map((message,i)=><div key={i}><Message message={message} username={username} /></div>)}
</ScrollToBottom>
        </>
    )

export default Messages