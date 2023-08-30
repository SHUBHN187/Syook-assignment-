import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Join from "./components/Join/join"
import Chat from "./components/Chat/chat";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/signup";
const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Signin />}></Route>
                    <Route path="/register" element={<Signup />}></Route>
                    <Route  path="/login" element={<Signin />}></Route>
                    <Route path="/join" element={<Join />}></Route>
                    <Route path="/chat" element={<Chat location={window.location} />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default App