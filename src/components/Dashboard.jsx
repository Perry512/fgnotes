import React, { useState } from "react";
import GetPlayer from "../services/getPlayer";
import UpdatePlayer from "../services/UpdatePlayerTag";
import GamesDropdown from "../components/GamesDropdown";
import PostNote from "./PostNote";
import FetchPlayerTag from "./FetchPlayer";
import DisplayNotesFull from "./DisplayNotesFull";
import SignOut from "./SignOut";

const Dashboard = () => {

    return (
        <div className="flex flex-col justify-items-center"> 
            <h1> Dashboard </h1>
            <FetchPlayerTag />
            <div>
                <SignOut />
                <DisplayNotesFull />
                <PostNote />
                <GamesDropdown />
                <GetPlayer />
                <UpdatePlayer />
            </div>
        
        </div>
    )
}

export default Dashboard;