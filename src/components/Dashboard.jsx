import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GetPlayer from "../services/getPlayer";
import UpdatePlayer from "../services/UpdatePlayer";

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const navigate = useNavigate();

    console.log(session);

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await signOut()
            navigate("/");
        } catch (error) {
            setError("An unexpected error occured")
        }
    };
    
    console.log(session.user);

    return (
        <div> 
            <h1> Dashboard </h1>
            <h2> Welcome, {session?.user?.email} </h2>
            <div>
                <p 
                    onClick={handleSignOut}
                    className="hover:cursor-pointer border inline-block px-4 py-3 mt-4" 
                >
                    Signout 
                </p>
                <GetPlayer />
                <UpdatePlayer />
            </div>
        
        </div>
    )
}

export default Dashboard;