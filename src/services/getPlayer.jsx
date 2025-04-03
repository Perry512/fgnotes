import { UserAuth } from "../context/AuthContext";

export default function GetPlayer() {
    const { player } = UserAuth();

    // console.log("Player status: ", player);
    return (
        <div>
            <h1>Player Profile</h1>
            {player ? (
                <div className="border p-4">
                    <h2 className="text-lg font-bold">{player.tag}</h2>
                    <p><strong>Games Played:</strong> {player.games_played.join(", ")}</p>
                    <p><strong>Created At:</strong> {new Date(player.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(player.updated_at).toLocaleString()}</p>
                </div>
            ) : (
                <p>No player data found.</p>
            )}
        </div>
    );
}