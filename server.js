import RestaurantSchema from "./Schemas/index.js";
import FoodItemschema from "./Schemas/index.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Console } from "console";
const app = express();
app.use(bodyParser.json());
app.use(cors());
mongoose
  .connect("mongodb://127.0.0.1:27017/ordersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));
mongoose.pluralize(null);
const Restaurants = mongoose.model("restaurants", RestaurantSchema);
const foodItem = mongoose.model("menu", FoodItemschema, "menu");
app.get("/:restroId/:tabNo", async (request, response) => {
  Restaurants.find({
    uuid: request.params.restroId,
  })
    .setOptions({ strictQuery: false })
    .then((res) => response.send(res[0]));
});
app.post("/addFoodItem", (req, res) => {
  const Item = new foodItem({
    uuid: uuidv4(),
    name: req.body.name,
    price: req.body.price,
    imageUrl: "",
    shortDescription: req.body.shortDescription,
    rating: "",
    vegOrNonVeg: "",
  });
  Item.save();
  res.json({ message: "New item created." });
});
app.listen(4000, function () {
  console.log("Server started");
});
