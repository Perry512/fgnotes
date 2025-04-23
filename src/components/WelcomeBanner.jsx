import React from "react";
import { getCachedPlayer } from "../utilities/playerUtils";
import { UserAuth } from "../context/AuthContext";

const WelcomeBanner = () => {
    const { session, player } = UserAuth();
    const playerData = player?.data || player;

    return (
        <h2>
            Welcome, { playerData?.tag || session?.user?.email || "Guest" }
        </h2>
    )
}

export default WelcomeBanner;