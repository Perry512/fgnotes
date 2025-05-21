import React, { useState } from "react";
import { Menu, Megaphone } from 'lucide-react';
import { UserAuth } from "../context/AuthContext";

export default function Header({toggleSidebar}) {
    const { player } = UserAuth();
    const playerData = player?.data || player;

    return (
        <header className="w-full px-4 py-3 bg-slate-800 text-slate-100 shadow-md flex items-center justify-between">
            {/* Hamburger Menu */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <span className="text-lg font-medium text-slate-300">{playerData?.tag || "Player"}</span>
            </div>

            <div className="text-lg font-semibold tracking-wide text-slate-100">
                Knowledge Check
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Megaphone size={24} />
                </button>
            </div>
        </header>
    );
}