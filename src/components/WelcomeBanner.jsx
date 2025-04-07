import React from "react";
import { getCachedPlayer } from "../utilities/playerUtils";
import { UserAuth } from "../context/AuthContext";

const WelcomeBanner = () => {
    const { session } = UserAuth();
    const player = getCachedPlayer();

    return (
        <h2>
            Welcome, {player?.tag || session?.user?.email || "Guest" }
        </h2>
    )
}

export default WelcomeBanner;