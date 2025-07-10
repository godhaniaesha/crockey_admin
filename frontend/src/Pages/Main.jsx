import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";

const Main = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen h-screen flex bg-d_bg overflow-hidden">
            <Sidebar open={isOpen} setopen={setIsOpen} />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <Header open={isOpen} setopen={setIsOpen} />
                <main className="flex-1 overflow-y-auto d_main_content h-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Main;