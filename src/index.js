import express from "express";
import api from "./api";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;

const { sequelize } = require("../models");

// cors설정
const corsOptions = {
  origin : "http://localhost:3001/api/posts"
}

app.use(cors(corsOptions))

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("DB 연결 완료");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api", api);

  
app.listen(port, () => {
    console.log(`${port} Server 연결 완료`);
  });

