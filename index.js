import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 6969;

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Stock Screener server is running on ${PORT}`);
});
