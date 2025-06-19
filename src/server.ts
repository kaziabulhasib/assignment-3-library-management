import { Server } from "http";
import app from "./app";

let server: Server;

const PORT = 5000;

async function main() {
  server = app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`);
  });
}

main();
