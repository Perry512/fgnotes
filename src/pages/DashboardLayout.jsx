import React, { useState } from "react";
import Header from "../components/Header";
import { AppSidebar } from "../components/AppSidebar";

export default function DashboardLayout({ children, setActivePage }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {sidebarOpen && (
                <div className="w-64 shrink-0">
                    <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} setActivePage={setActivePage} />
                </div>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
