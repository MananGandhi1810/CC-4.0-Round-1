import * as React from "react";

const ChatMessageList = React.forwardRef(
    ({ className, children, smooth = false, ...props }, _ref) => {
        return (
            <div className="relative w-full h-full">
                <div
                    className={`flex flex-col w-full h-full p-4 overflow-y-auto ${className}`}
                    {...props}
                >
                    <div className="flex flex-col gap-6">{children}</div>
                </div>
            </div>
        );
    },
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
