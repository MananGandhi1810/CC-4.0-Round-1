import NavBar from "@/components/custom/NavBar.jsx";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.jsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIChat } from "@/components/custom/AIChat";

function Layout() {
    return (
        <ScrollArea className="min-h-full">
            <main>
                <NavBar />
                <Outlet />
            </main>
            <AIChat className="z-50" />
            <Toaster />
        </ScrollArea>
    );
}

export default Layout;
