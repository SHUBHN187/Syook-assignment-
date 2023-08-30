import { Link } from "react-router-dom"
import "./headerbar.css"
const Headerbar = ({ room }) =>
(

    <section id="main-container-header">
        <div id="second-container">
            <img src={require("../../images/wireless-symbol.png")} alt="header-live-icon" />
            <h3 id="heading">{room}</h3>
            <div id="cancel-button">
                <Link to={"/"} >
                    <img src={require("../../images/close.png")} alt="header-cancel-button" />
                </Link>
            </div>

        </div>
    </section>

)

export default Headerbar