import express from "express";
import { sequelize, Sensor } from "./database.js";
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url'; // Import the 'fileURLToPath' function from the 'url' module
import path from 'path';

const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
const __dirname = path.dirname(__filename); // Get the directory name of the current module's filename

const app = express();

console.log(__dirname);
console.log("funciona pfv");

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Use __dirname to specify the views directory
app.set('views', path.join(__dirname, 'views')); // Assuming 'views' is a subdirectory in the same folder as this script

sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch((error) => {
  console.error("Error synchronizing database:", error);
});

app.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
      attributes: ['temperatura', 'umidade', 'id', 'createdAt']
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
      temperatura: req.query.temperatura,
      umidade: req.query.umidade
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
