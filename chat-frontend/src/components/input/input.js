
import "./input.css"
const Input = ({ message, sendmessage, setMessage }) =>
(
    <section id="main-container-input">
        <form id="form" onSubmit={(e) => sendmessage(e)}>
            <input type="text" placeholder="Type Your Message......." value={message} className="chat-input" onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? sendmessage(e) : null} />
            <input type="submit" value="Send" />
        </form>
    </section>

)

export default Input