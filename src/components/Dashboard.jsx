import React, { useState } from "react";
import GetPlayer from "../services/getPlayer";
import UpdatePlayer from "../services/UpdatePlayerTag";
import GamesDropdown from "../components/GamesDropdown";
import NotesPage from "../pages/NotesPage";
import SignOut from "./SignOut";
import WelcomeBanner from "./WelcomeBanner";

const Dashboard = () => {

    return (
        <div className="flex flex-col justify-items-center"> 
            <h1> Dashboard </h1>
            <WelcomeBanner />
            <div>
                <SignOut />
                <NotesPage />
                <GamesDropdown />
                <GetPlayer />
                <UpdatePlayer />
            </div>
        
        </div>
    )
}

export default Dashboard;