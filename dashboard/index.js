import express from "express";
import { sequelize, Sensor } from "./connection.js"; // Import the database connection

import { engine } from 'express-handlebars'

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.findAll({
        attributes: ['temperatura', 'id','createdAt']
    });
 
    res.render("home", { sensors });
       console.log(sensors)
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cadastrar/:temperatura", (req, res) => {
  Sensor.create({
    temperatura: req.params.temperatura,
  }).then(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("server OK");
});