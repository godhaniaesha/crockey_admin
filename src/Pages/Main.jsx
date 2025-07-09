import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";

const Main = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-d_bg">
            <Sidebar open={isOpen} setopen={setIsOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header open={isOpen} setopen={setIsOpen} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto d_main_content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Main;