import { UserAuth } from "../context/AuthContext";
import { usePlayer } from "../hooks/usePlayer";

export default function GetPlayer() {
    const { session } = UserAuth();
    console.log("Session in GetPlayer: ", session.user.id);
    const { player, loading, error } = usePlayer(session?.user?.id, {useData: false});

    console.log("Player status: ", player, "\nLoading status: ", loading, "\nError status: ", error);

    if ( loading || !player || player.loading) {
        return <p>Loading player data...</p>
    }

    if (error) {
        console.error("Error fetching player data: ", error);
        return <p>Error fetching player data: {error.message}</p>;
    }

    return (
        <div>
            <h1>Player Profile</h1>
            {player ? (
                <div className="border p-4">
                    <h2 className="text-lg font-bold">{player?.tag}</h2>
                    <p><strong>Games Played:</strong> {player?.games_played.join(", ")}</p>
                    <p><strong>Created At:</strong> {new Date(player.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(player.updated_at).toLocaleString()}</p>
                </div>
            ) : (
                <p>No player data found.</p>
            )}
        </div>
    );
}