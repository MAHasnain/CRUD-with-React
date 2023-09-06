import OpenAI from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import express from "express";
import path from "path";
const __dirname = path.resolve();

const app = express();
import "dotenv/config.js";

const pinecone = new PineconeClient();
await pinecone.init ({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
})



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});
import "./config/index.mjs";

app.get("/", async (req, res) => {
  res.send("Hello World !");
});

app.get(express.static(path.join(__dirname, "./web/build")));
app.use("/", express.static(path.join(__dirname, "./web/build")));

const port = process.env.port || 5001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
