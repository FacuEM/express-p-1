import express, { json } from "express";
import cors from "cors";
import { createMovieRouter } from "./routes/movies.js";
import { MovieModel } from "./models/mysql/movie.js";

const PORT = process.env.PORT ?? 1234;

const app = express();

app.use(json());
app.use(cors());
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/movies", createMovieRouter({ movieModel: MovieModel }));

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
