import pool from "./database.js";

export const getMovies = async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMovieDetails = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movieDetailsResult = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [movieId]
    );

    if (movieDetailsResult.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const movieDetails = movieDetailsResult.rows[0];

    const reviewsResult = await pool.query(
      "SELECT * FROM movie_reviews WHERE movie_id = $1",
      [movieId]
    );
    const reviews = reviewsResult.rows;

    res.json({
      movieDetails: {
        name: movieDetails.name,
        release_date: movieDetails.release_date,
        average_rating: movieDetails.average_rating,
      },
      reviews: reviews.map((review) => ({
        reviewer_name: review.reviewer_name,
        rating: review.rating,
        review_comments: review.review_comments,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addMovie = async (req, res) => {
  const { name, release_date } = req.body;
  if (name === "" || release_date === "") {
    return res.status(400).json({ message: "send all required parameters" });
  }
  const result = await pool.query(
    "INSERT INTO movies (name, release_date) VALUES ($1, $2) RETURNING *",
    [name, release_date]
  );

  res.status(201).json(result.rows[0]);
};

export const addReview = async (req, res) => {
  const { movie_id, reviewer_name, rating, review_comments } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO movie_reviews (movie_id, reviewer_name, rating, review_comments) VALUES ($1, $2, $3, $4) RETURNING *",
      [movie_id, reviewer_name, rating, review_comments]
    );

    const averageRatingResult = await pool.query(
      "SELECT AVG(rating) as new_average FROM movie_reviews WHERE movie_id = $1",
      [movie_id]
    );

    console.log(
      "AVERAGE ---> ",
      parseFloat(averageRatingResult.rows[0].new_average)
    );

    await pool.query(
      "UPDATE movies SET average_rating = COALESCE($1, average_rating) WHERE id = $2",
      [parseFloat(averageRatingResult.rows[0].new_average), movie_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM movies WHERE id = $1", [
      movieId,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
