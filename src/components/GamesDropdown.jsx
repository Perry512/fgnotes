import React, { useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import { GAMES } from '../constants/games';

const games = Object.values(GAMES);

export function GamesDropdown() {
  const { session, player } = UserAuth();
  const [selectedGames, setSelectedGames] = useState([]);

  // 🔹 Sync local state when `player.games_played` changes
  useEffect(() => {
    if (player?.games_played) {
      setSelectedGames(player.games_played);
    }
  }, [player?.games_played]);

  // 🔹 Toggle game selection
  const handleToggle = (game) => {
    setSelectedGames((prev) => {
      return prev.includes(game)
        ? prev.filter((g) => g !== game)
        : [...prev, game];
    });
  };

  // 🔹 Save selected games to Supabase
  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("No user session found.");
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
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-700 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          Select Games
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none"
      >
        <div className="py-1">
          {games.map((game, index) => (
            <div key={index} className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGames.includes(game)}
                onChange={() => handleToggle(game)}
                className="mr-2"
              />
              {game}
            </div>
          ))}

          {/* 🔹 Save and Exit / Exit without Saving */}
          <MenuItem as="div">
            <button
              onClick={handleSave}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Save and Exit
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Exit without saving
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

export default GamesDropdown;