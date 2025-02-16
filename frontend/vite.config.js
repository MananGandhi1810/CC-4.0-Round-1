import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig((mode) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            "process.env.SERVER_URL": JSON.stringify(
                "https://cc-backend.mpst.me",
            ),
            "process.env.GOOGLE_API_KEY": JSON.stringify(
                env.REACT_APP_GOOGLE_API_KEY,
            ),
        },
    };
});
