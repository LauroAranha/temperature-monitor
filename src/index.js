import express from 'express';
import pool from './database.js';

const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensors');
    const sensors = result.rows;
    res.render("home", { sensors });
    console.log(sensors);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cadastrar", async (req, res) => {
  try {
    const { temperature, humid, bombActive, servoOpen } = req.query;
    const query = 'INSERT INTO sensors (temperature, humid, bombActive, servoOpen) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [temperature, humid, bombActive, servoOpen]);

    // Send a success response
    res.status(200).send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);

    // Send an error response
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
