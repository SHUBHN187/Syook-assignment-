import { Link, useNavigate } from "react-router-dom"
import "./signin.css"
import { useState } from "react"
const Signin=()=>{
    const navigate=useNavigate()
    const[user,setuser]=useState({
        email:"",
        password:""
    })
   

    const handlechange=(e)=>{
        const{name,value}=e.target
        setuser({...user,[name]:value})
    }
    const login = () => {
        fetch("https://backend-2-chat.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message)
            if (data.message === "Login Succesfull") {
                navigate("/join")
            } else if (data.message === "user not found") {
                navigate("/register")
            }
        })
        .catch(error => console.log(error.message))
    }
    
   




    return (
        <>
            <section id="signin-container">
                <h1>Sign In</h1>
                <form>
                <div id="email"> <label>Email:   </label>
                <input type="email" placeholder="Email" name="email"  value={user.email}
                onChange={handlechange}/></div>
                <div id="password">
                <label>Password:  </label>
                <input type="password" autoComplete="true" placeholder="Password" name="password"  value={user.password}
                onChange={handlechange}/>
                </div>
                </form>
                <button id="signin-button" onClick={login} >Sign In</button>
                <p>Don't have an account?</p>
<Link to={"/register"}>
<button id="signup-button">Sign Up</button>
</Link>
            </section>
 
            
        </>
    )
}
export default Signin
