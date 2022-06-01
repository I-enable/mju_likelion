import express from "express";
import api from "./api";


const app = express();
const port = 3000;

const { sequelize } = require("../models");

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

