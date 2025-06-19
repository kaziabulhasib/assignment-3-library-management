import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let server: Server;

const PORT = 5000;
const uri = process.env.URI as string;
async function main() {
  try {
    await mongoose.connect(uri);
    console.log("server connect to db with help of mongoose");
    server = app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
