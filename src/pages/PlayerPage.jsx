import React from 'react';
import GamesDropdown from '../components/GamesDropdown';
import GetPlayer from '../services/getPlayer';
import UpdatePlayer from '../services/UpdatePlayerTag';

const PlayerPage = () => {
    return (
        <div>
            <h1>Player Page</h1>
            <div className="player-container">
                <GetPlayer />
                <UpdatePlayer />
                <GamesDropdown />
            </div>
        </div>
    );
};

export default PlayerPage;