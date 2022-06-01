import express from "express";
import posts from "./posts";

const app = express();

app.use("/posts", posts);

export default app;