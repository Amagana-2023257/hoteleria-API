import { config } from "dotenv"
import { initServer } from "./configs/server.js"

config()
const startServer = async () => {
    try {
        await initServer();
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
};

startServer();