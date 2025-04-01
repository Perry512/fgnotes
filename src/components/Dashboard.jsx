import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GetPlayer from "../services/getPlayer";
import UpdatePlayer from "../services/UpdatePlayerTag";
import GamesDropdown from "../components/GamesDropdown";
import { getPlayerTag } from "../utilities/getPlayerTag";
import PostNote from "./PostNote";
import FetchPlayerTag from "./FetchPlayer";

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();
    const getTag = getPlayerTag(session);

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await signOut()
            navigate("/");
        } catch (error) {
            setError("An unexpected error occured");
        }
    };
    
    console.log(getTag);

    return (
        <div> 
            <h1> Dashboard </h1>
            <FetchPlayerTag />
            <div>
                <p 
                    onClick={handleSignOut}
                    className="hover:cursor-pointer border inline-block px-4 py-3 mt-4" 
                >
                    Signout 
                </p>
                <PostNote />
                <GamesDropdown />
                <GetPlayer />
                <UpdatePlayer />
            </div>
        
        </div>
    )
}

export default Dashboard;