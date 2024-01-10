import express from "express";
import * as controllers from "./controllers.js";

const router = express.Router();

router.get("/movies", controllers.getMovies);
router.get("/movies/:id", controllers.getMovieDetails);
router.post("/movies", controllers.addMovie);
router.post("/reviews", controllers.addReview);
router.delete("/movies/:id", controllers.deleteMovie);

export default router;
