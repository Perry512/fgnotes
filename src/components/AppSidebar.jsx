import { Badge, Sidebar, SidebarCTA, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiOutlineUser, HiClipboardList } from "react-icons/hi";

export function AppSidebar({ open, setOpen, setActivePage }) {  
    if(!open) return null;

    return (
        <Sidebar aria-label="Sidebar" className="w-64 h-screen flex flex-row-reverse" >
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem 
                        icon={HiClipboardList}
                        onClick={() => {setActivePage("notes")}}
                    >
                        Notes
                    </SidebarItem>
                    <SidebarItem 
                        icon={HiOutlineUser}
                        onClick={() => {setActivePage("player")}}
                    >
                        Player Info
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
            <SidebarCTA>
                <div className="mb-3 flex items-center">
                    <Badge color="warning"> Beta </Badge>
                    <button 
                        aria-label="Close" 
                        type="button" 
                        className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    >
                        <svg
                            aria-hidden
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                            </svg>
                    </button>
                </div>
                <div className="mb-3 flex">
                    This application is very much still in development, please mind the dust!
                </div>
            </SidebarCTA>
        </Sidebar>
    )
}