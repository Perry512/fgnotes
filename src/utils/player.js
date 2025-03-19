import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Player(playerObject) {
    const [player , setPlayer] = useState([]);
    const [playerInternalID, setPlayerInternalID] = useState("");
    const [tag, setTag] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [cfnId, setCfnID] = useState("");
    const [gamesPlayed, setGamesPlayed] = useState("");
    const [playerEmail, setPlayerEmail] = useState("");
    
    useEffect(() => {
        getPlayerData();
    }, []);

     async function getPlayerData() {
        const { data, error } = await supabase
        .from("Player")
        .select("*");

        if (error) {
            console.error("Error fetching player data: ", error);

            return;

        }

        if (data && data.length > 0) {

            const playerData = data[0];

            setPlayer(playerData);
            setPlayerInternalID(playerData.internal_ID);
            setTag(playerData.tag);
            setCreatedAt(playerData.created_at);
            setCfnID(playerData.cfn_id);
            setGamesPlayed(playerData.games_played);
            setPlayerEmail(playerData.player_email);

        } else {

            setPlayer(["NULL"]);

        }

    }

    return player;

}