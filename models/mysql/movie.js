import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3307,
  password: "",
  database: "moviesdb",
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    let query =
      "SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) id FROM movie m";
    const params = [];

    if (genre) {
      query += " INNER JOIN movie_genres mg ON m.id = mg.movie_id";
      query += " INNER JOIN genre g ON mg.genre_id = g.id";
      query += " WHERE g.name = ?";
      params.push(genre);
    }

    const [movies] = await connection.query(query, params);
    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  }

  static async create({ input }) {
    const { title, year, director, duration, poster, rate, genres } = input;

    const [result] = await connection.query(
      `INSERT INTO movie (title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, year, director, duration, poster, rate]
    );

    const movieId = result.insertId;

    if (genres && genres.length > 0) {
      const genreValues = genres.map((genre) => [movieId, genre]);
      await connection.query(
        `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
        [genreValues]
      );
    }

    return movieId;
  }

  static async delete({ id }) {
    await connection.query(`DELETE FROM movie WHERE id = UUID_TO_BIN(?)`, [id]);

    await connection.query(
      `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?)`,
      [id]
    );

    return true;
  }

  static async update({ id, input }) {
    const { title, year, director, duration, poster, rate, genres } = input;

    await connection.query(
      `UPDATE movie SET title=?, year=?, director=?, duration=?, poster=?, rate=? WHERE id = UUID_TO_BIN(?)`,
      [title, year, director, duration, poster, rate, id]
    );

    await connection.query(
      `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?)`,
      [id]
    );

    if (genres && genres.length > 0) {
      const genreValues = genres.map((genre) => [id, genre]);
      await connection.query(
        `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
        [genreValues]
      );
    }

    return true;
  }
}
