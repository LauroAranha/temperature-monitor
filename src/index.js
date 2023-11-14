import express from 'express';
import pool from './database.js';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views/'));

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

app.get("/dashboard", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensors ORDER BY createdAt LIMIT 10');
    const sensors = result.rows;
    res.json(sensors)
    console.log(sensors);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/current", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensors ORDER BY createdAt LIMIT 1');
    const sensors = result.rows;
    res.json(sensors)
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
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
