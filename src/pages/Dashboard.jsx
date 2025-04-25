import React, { useState } from "react";
import NotesPage from "./NotesPage";
import SignOut from "../components/SignOut";
import WelcomeBanner from "../components/WelcomeBanner";
import PlayerPage from "./PlayerPage";
import DashboardLayout from "./DashboardLayout";

const Dashboard = () => {
    const [activePage, setActivePage] = useState("notes");

    const renderPage = () => {
        switch (activePage) {
            case "notes":
                return <NotesPage />;
            case "player":
                return <PlayerPage />;
            default:
                return <NotesPage />;
        }
    };

    return (
        <DashboardLayout setActivePage={setActivePage}>
        <div className="flex flex-col justify-items-center my-4 w-full"> 
            <h1> Dashboard </h1>
            <WelcomeBanner />
            <div>
                {renderPage()}
                <SignOut />
            </div>
        </div>
        </DashboardLayout>
    )
}

export default Dashboard;