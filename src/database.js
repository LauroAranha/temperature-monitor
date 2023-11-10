import { Sequelize, DataTypes } from "sequelize";

import dotenv from 'dotenv/config.js';

import pg from 'pg'

console.log(process.env.POSTGRES_DATABASE)

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão OK");
  })
  .catch((error) => {
    console.error("Falha:", error);
  });


const Sensor = sequelize.define("sensor", {
  temperature: {
    type: DataTypes.INTEGER,
  },
  humid: {
    type: DataTypes.INTEGER,
  },
  servoOpen: {
    type: DataTypes.BOOLEAN
  },
  bombActive: {
    type: DataTypes.BOOLEAN
  }
});

sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch((error) => {
  console.error("Error synchronizing database:", error);
});

export { sequelize, Sensor };