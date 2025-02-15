import { Globe } from "@/components/ui/globe";

export function Hero() {
    return (
        <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl h-full-w-nav">
            <div className="flex flex-col items-center text-gray-500">
                <span className="pointer-events-none whitespace-pre-wrap bg-clip-text text-center text-8xl font-semibold leading-none z-10">
                    Dream Scale
                </span>
                <span className="text-4xl z-10 text-center">Scale Your Startup Beyond Your Dreams</span>
            </div>
            <Globe className="md:scale-100 scale-75" />
        </div>
    );
}
