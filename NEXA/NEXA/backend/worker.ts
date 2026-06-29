import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { iniciarMQTT } from "./services/mqtt";

console.log("🚀 NEXA worker arrancando...");
iniciarMQTT();

process.on("uncaughtException", (err) => console.error("[worker] Error no capturado:", err));
process.on("unhandledRejection", (reason) => console.error("[worker] Promise rechazada:", reason));
