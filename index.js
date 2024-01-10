import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 6969;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", router);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Stock Screener server is running on ${PORT}`);
});
