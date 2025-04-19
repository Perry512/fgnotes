import { UserAuth } from "../context/AuthContext";

export default function GetPlayer() {
    const { player, loading } = UserAuth();

    console.log("Player status: ", player);

    if (loading || !player) {
        return <p>Loading player data...</p>
    }

    const playerData = player.data || player;

    return (
        <div>
            <h1>Player Profile</h1>
            {playerData ? (
                <div className="border p-4">
                    <h2 className="text-lg font-bold">{playerData.tag}</h2>
                    <p><strong>Games Played:</strong> {playerData.games_played.join(", ")}</p>
                    <p><strong>Created At:</strong> {new Date(playerData.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(playerData.updated_at).toLocaleString()}</p>
                </div>
            ) : (
                <p>No player data found.</p>
            )}
        </div>
    );
}