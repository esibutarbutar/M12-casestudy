import { sequelize, DataTypes } from "./model.js";

const Product = sequelize.define("products", {
  name: DataTypes.STRING,
  price: DataTypes.INTEGER,
});

export default Product;
