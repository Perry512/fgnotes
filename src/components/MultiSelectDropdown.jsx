import { useState, useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const MultiSelectDropdown = ({
  label,
  options,
  selected,
  onChange,
  onSave,
  closeOnSave = true,
  chevron = true,
}) => {
  const menuRef = useRef();

  const toggleOption = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <MenuButton className="inline-flex justify-between items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-700 ring-1 shadow-xs ring-gray-300 hover:bg-gray-50">
        {label}
        { chevron && <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />}
      </MenuButton>

      <MenuItems
        ref={menuRef}
        className="right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none"
      >
        <div className="py-2 px-2 max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center py-1 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="border-t px-4 py-2">
          <MenuItem as="div">
            {({ close }) => (
              <button
                onClick={() => {
                  onSave();
                  if (closeOnSave) close();
                }}
                className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded"
              >
                Save and Exit
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};