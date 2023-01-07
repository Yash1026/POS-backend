import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Restaurants, order } from "./Models/index.js";
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

app.get("/:restaurantId/:tabNo", async (request, response) => {
  Restaurants.find({
    uuid: request.params.restaurantId,
  })
    .setOptions({ strictQuery: false })
    .then((res) => response.send(res[0]));
});
app.get("/:restaurantId/:tabNo/getActiveOrders", async (request, response) => {
  Restaurants.find({
    active: true,
  })
    .setOptions({ strictQuery: false })
    .then((res) => response.send(res));
});
// app.post("/addFoodItem", (req, res) => {
//   const Item = new foodItem({
//     uuid: uuidv4(),
//     name: req.body.name,
//     price: req.body.price,
//     imageUrl: "",
//     shortDescription: req.body.shortDescription,
//     rating: "",
//     vegOrNonVeg: "",
//   });
//   Item.save();
//   res.json({ message: "New item created." });
// });
app.post("/placeOrder", (req, res) => {
  console.log(req.body);
  const Order = new order({
    uuid: uuidv4(),
    tableNo: req.body.tableNo,
    items: req.body.items,
    active: true,
    amount: req.body.amount,
    note: req.body.note,
    restaurantId: req.body.restaurantId,
  });
  Order.save();
  res.json({ message: "Order Placed Successfully", status: 200 });
});
app.listen(4000, function () {
  console.log("Server started");
});
