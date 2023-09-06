import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("projetoesp", "root", "", {
  host: "localhost",
  dialect: "mysql",
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
  temperatura: {
    type: DataTypes.INTEGER,
  },
});



export { sequelize, Sensor };