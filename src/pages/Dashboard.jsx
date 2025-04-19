import React, { useState } from "react";
import NotesPage from "./NotesPage";
import SignOut from "../components/SignOut";
import WelcomeBanner from "../components/WelcomeBanner";
import PlayerPage from "./PlayerPage";
import Header from "../components/Header";
import DashboardLayout from "./DashboardLayout";

const Dashboard = () => {

    return (
        <DashboardLayout>
        <div className="flex flex-col justify-items-center my-4 w-full"> 
            <h1> Dashboard </h1>
            <WelcomeBanner />
            <div>
                <NotesPage />
                <PlayerPage />
                <SignOut />
            </div>
        </div>
        </DashboardLayout>
    )
}

export default Dashboard;