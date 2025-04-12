import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { GAMES } from "../constants/games";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

export function GamesDropdown() {
  const { session, player } = UserAuth();
  const [selectedGames, setSelectedGames] = useState([]);

  useEffect(() => {
    if (player?.games_played) {
      setSelectedGames(player.games_played);
    }
  }, [player?.games_played]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("No user session found.");
      return;
    }

    const query = await supabase
      .from('Player')
      .update({ games_played: selectedGames })
      .eq('internal_id', session.user.id);

    if (error) {
      console.error("Error updating games played:", error);
    } else {
      console.log("Games played updated successfully");
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