import React from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

function WhiteBoard() {
    return (
        <div className="h-full-w-nav w-full">
            <Tldraw
                persistenceKey="whiteboard-demo"
                className="h-full w-full"
                inferDarkMode
            />
        </div>
    );
}

export default WhiteBoard;
