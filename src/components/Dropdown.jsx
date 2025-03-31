import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GAMES } from '../constants/games';

const games = Object.values(GAMES);

export function Dropdown() {
  const [selectedGames, setSelectedGames] = useState([]);

  const handleToggle = (game, event) => {
    event.stopPropagation();
    setSelectedGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    );
  };

  const handleExit = () => {
    console.log('Selected Games:', selectedGames);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          Select Games
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none"
      >
        <div className="py-1">
          {games.map((game, index) => (
            <MenuItem key={index} as="div">
              <label
                className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                onClick={(e) => handleToggle(game, e)}
              >
                <input
                  type="checkbox"
                  checked={selectedGames.includes(game)}
                  readOnly
                  className="mr-2"
                />
                {game}
              </label>
            </MenuItem>
          ))}
          <MenuItem as="div">
            <button
              onClick={handleExit}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              EXIT
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

export default Dropdown;