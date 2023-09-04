import express from "express";
import path from "path";
const __dirname = path.resolve();

const app = express();


app.get('/', async (req, res)=> {
    res.send('Hello World !');
})

app.get (express.static(path.join(__dirname, "./web/build")))
app.use ('/', express.static(path.join(__dirname, "./web/build")))

const port = process.env.port || 5001;
app.listen (port, ()=>{
    console.log(`Example app listening on port ${port}`)
})
