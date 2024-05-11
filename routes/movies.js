import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
  const router = Router();

  const movieController = new MovieController({ movieModel });

  router.get("/", movieController.getAll);

  router.get("/:id", movieController.getById);

  router.post("/", movieController.create);

  router.patch("/:id", movieController.update);

  router.delete("/:id", movieController.delete);
};
