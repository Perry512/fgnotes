import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { GAMES } from "../constants/games";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { usePlayer } from "../hooks/usePlayer";
import { updatePlayerGamesPlayed } from "../utilities/updatePlayerGamesPlayed";
import { Spinner } from "flowbite-react";

export function GamesDropdown() {
  const { session, loading: sessionLoading, player } = UserAuth();
  const { loading: playerLoading, error: playerError } = usePlayer(session, {
    useData: true,
  });
  const [selectedGames, setSelectedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Player status GamesDropdown: ", player);

  useEffect(() => {
    if (player?.games_played) {
      setSelectedGames(player.games_played);
    }
  }, [player?.games_played]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("GamesDropdown: No user session found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { error } = await updatePlayerGamesPlayed(
      player?.internal_id,
      selectedGames
    );

    if (error) {
      console.error("Error updating games played:", error);
      setError(error);
    } else {
      console.log("Games played updated successfully");
    }

    setLoading(false);

    if (loading || !player || playerLoading || sessionLoading) {
      return <Spinner />;
    }

    if (error || playerError) {
      return (
        <p className="text-red-500">{error?.message || playerError?.message}</p>
      );
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
