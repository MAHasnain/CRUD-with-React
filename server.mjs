import OpenAI from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { customAlphabet } from "nanoid";
import express from "express";
const nanoid = customAlphabet("1234567890", 20);
import path from "path";
const __dirname = path.resolve();
import "dotenv/config.js";
import Cors from "cors";
import morgan from "morgan";
import "./config/index.mjs";

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(
  Cors([
    "http://localhost:5000",
    "127.0.0.1",
    "http://localhost:3001",
    "https://ewrer234234.appspot.app.com",
  ])
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

// const pinecone = new Pinecone({
//   environment: process.env.PINECONE_ENVIRONMENT,
//   apiKey: process.env.PINECONE_API_KEY,
// });

const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

app.get("/api/v1/stories", async (req, res) => {
  console.log("Get run ");
  const queryText = "";

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: queryText,
  });
  const vector = response?.data[0]?.embedding;
  console.log("vector: ", vector);
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const queryResponse = await index.query({
    queryRequest: {
      vector: vector,
      // id: "vec1",
      topK: 100,
      includeValues: true,
      includeMetadata: true,
      // namespace: process.env.PINECONE_NAME_SPACE
    },
  });

  queryResponse.matches.map((eachMatch) => {
    console.log(
      `score ${eachMatch.score.toFixed(1)} => ${JSON.stringify(
        eachMatch.metadata
      )}\n\n`
    );
  });
  console.log(`${queryResponse.matches.length} records found `);

  res.send(queryResponse.matches);
  console.log("Donw", queryResponse.matches);

  // const queryText = "";

  // const response = await openai.embeddings.create({
  //   model: "text-embedding-ada-002",
  //   input: queryText,
  // });

  // const vector = response?.data[0]?.embedding;
  // // console.log(vector);

  // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  // const queryResponse = await index.query({
  //   queryRequest: {
  //     vector: vector,
  //     topK: 100,
  //     includeValue: true,
  //     includeMetaData: true,
  //     // namespace: process.env.PINECONE_NAME_SPACE,
  //   },
  // });
  // queryResponse.matches.map((eachMatch) => {
  //   console.log(
  //     `score ${eachMatch.score.toFixed(1)} => ${JSON.stringify(
  //       eachMatch.metadata
  //     )}\n\n`
  //   );
  // });
  // console.log(`${queryResponse.matches.length} records found `);
  // res.send(queryResponse.matches);
});

app.get("/api/v1/search", async (req, res) => {
  const queryText = req.query.q;

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: queryText,
  });
  const vector = response?.data[0]?.embedding;
  console.log("vector : ", vector);

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  // const queryResponse = await index.query({
  //   queryRequest: {
  //     vector: vector,
  //        // id: "vec1",
  //     topK: 20,
  //     includeValues: false,
  //     includeMetaData: true,
  //     // namespace: process.env.PINECONE_NAME_SPACE,
  //   },
  // });
  const queryResponse = await index.query({
    queryRequest: {
      vector: vector,
      // id: "vec1",
      topK: 20,
      includeValues: false,
      includeMetadata: true,
      // namespace: process.env.PINECONE_NAME_SPACE
    }
  });
  queryResponse.matches.map((eachMatch) => {
    console.log(
      `score ${eachMatch.score.toFixed(3)} => ${JSON.stringify(
        eachMatch.metadata
      )}\n\n`
    );
  });
  console.log(`${queryResponse.matches.length} records found `);

  res.send(queryResponse.matches);
  // const queryText = req.query.q;

  // const response = await openai.embeddings.create({
  //   model: "text-embedding-ada-002",
  //   input: queryText,
  // });
  // const vector = response?.data[0]?.embedding
  // console.log("vector: ", vector);
  // // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

  // const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  // const queryResponse = await index.query({
  //   queryRequest: {
  //     vector: vector,
  //     // id: "vec1",
  //     topK: 20,
  //     includeValues: false,
  //     includeMetadata: true,
  //     // namespace: process.env.PINECONE_NAME_SPACE
  //   }
  // });

  // queryResponse.matches.map(eachMatch => {
  //   console.log(`score ${eachMatch.score.toFixed(3)} => ${JSON.stringify(eachMatch.metadata)}\n\n`);
  // })
  // console.log(`${queryResponse.matches.length} records found `);

  // res.send(queryResponse.matches)

});

///  post request
app.post("/api/v1/story", async (req, res) => {
  const startTime = new Date();
  console.log("req.body:", req.body);

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: `${req.body?.title} ${req.body?.body}`,
  });
  const vector = response?.data[0].embedding;

  const responseTime = new Date() - startTime;
  console.log("response?.data :", response?.data);
  console.log("vector :", vector);

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const upsertRequest = {
    vectors: [
      {
        id: nanoid(),
        values: vector,
        metadata: {
          title: req.body?.title,
          body: req.body?.body,
        },
      },
    ],
    // namespace: process.env.PINECONE_NAME_SPACE,
  };
  console.log(upsertRequest);

  try {
    const upsertResponse = await index.upsert({ upsertRequest });
    console.log("upsertResponse :", upsertResponse);

    const responseTime = new Date() - startTime;
    res.send({
      message: "story created succesfully",
    });
  } catch (e) {
    console.log("error :", e);
    res.status(500).send({
      message: "failed to create story, please try later",
    });
  }
});

app.put("/api/v1/story/:id", async (req, res) => {
  console.log("req.params.id:", req.params.id);
  console.log("req.body:", req.body);

  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: `${req.body?.title} ${req.body?.body}`,
  });

  console.log("response?.data", response?.data);
  const vector = response?.data[0].embedding;
  console.log("vector", vector);

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const upsertRequest = {
    vectors: [
      {
        id: req.params.id,
        values: vector,
        metadata: {
          title: req.body?.title,
          body: req.body?.body,
        },
      },
    ],
    // namespace: process.env.PINECONE_NAME_SPACE,
  };

  try {
    const upsertResponse = await index.upsert({ upsertRequest });
  } catch (e) {
    console.log("error :", e);
    res.status(500).send({
      message: "failed to create story, please try later",
    });
  }
});

app.delete("/api/v1/story/:id", async (req, res) => {
  console.log("req.params.id:", req.params.id);
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const deleteResponse = await index.delete1({
      ids: [req.params.id],
      // namespace: process.env.PINECONE_NAME_SPACE 
      
    })
    console.log("deleteResponse: ", deleteResponse);

    res.send({
      message: "story deleted successfully"
    });

  } catch (e) {
    console.log("error: ", e)
    res.status(500).send({
      message: "failed to create story, please try later"
    });
  }
});

app.get(express.static(path.join(__dirname, "./web/build")));
app.use("/", express.static(path.join(__dirname, "./web/build")));

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
