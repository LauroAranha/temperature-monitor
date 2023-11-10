import express from "express";
import { sequelize, Sensor } from "./database.js";
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(__dirname);
console.log("funciona pfv");

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views/'));

sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch((error) => {
  console.error("Error synchronizing database:", error);
});

app.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: ['temperature', 'humid', 'servoOpen', 'bombActive', 'id', 'createdAt']
    });

    res.render("home", { sensors });
    console.log(sensors);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cadastrar", async (req, res) => {
  try {
    await Sensor.create({
      temperature: req.query.temperature,
      humid: req.query.humid,
      bombActive: req.query.bombActive,
      servoOpen: req.query.servoOpen
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
