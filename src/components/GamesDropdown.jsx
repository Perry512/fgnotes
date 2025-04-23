import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { GAMES } from "../constants/games";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

export function GamesDropdown() {
  const { session, player, loading } = UserAuth();
  const [selectedGames, setSelectedGames] = useState([]);

  console.log("Player status GamesDropdown: ", player);
  
  useEffect(() => {
    if (player.games_played) {
      setSelectedGames(player.games_played);
    }
  }, [player?.games_played]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("GamesDropdown: No user session found.");
      return;
    }

    const { error } = await supabase
      .from('Player')
      .update({ games_played: selectedGames })
      .eq('internal_id', session.user.id);

    if (error) {
      console.error("Error updating games played:", error);
    } else {
      console.log("Games played updated successfully");
    }

    if (!loading && !player) {
      return <p>Loading player data...</p>;
    }

  };

  return (
    <MultiSelectDropdown
      label="Select Games"
      options={Object.values(GAMES)}
      selected={selectedGames}
      onChange={setSelectedGames}
      onSave={handleSave}
    />
  );
}

export default GamesDropdown;