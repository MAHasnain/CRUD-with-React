import OpenAI from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { customAlphabet, nanoid } from "nanoid";
import express from "express";
const nanoid = customAlphabet("1234567890", 20);
import path from "path";
const __dirname = path.resolve();
import "dotenv/config.js";
import Cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use (Cors());


const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
const upsertRequest = {
  vectors: [
    {
      id: nanoid(),
      values: vector,
      metadata: {
        title,
        body, 
      },
    },
  ],
  namespace: process.env.PINECONE_NAME_SPACE,
};

const upsertResponse = await index.upsert({upsertRequest});



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});
import "./config/index.mjs";
import morgan from "morgan";

app.get("/", async (req, res) => {
  res.send("Hello World !");
});

app.get(express.static(path.join(__dirname, "./web/build")));
app.use("/", express.static(path.join(__dirname, "./web/build")));

const port = process.env.port || 5001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
