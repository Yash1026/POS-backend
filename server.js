import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Restaurants, order, User } from "./Models/index.js";
import moment from "moment";

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

app.get("/:restaurantId", async (request, response) => {
  console.log("aya");
  Restaurants.find({
    uuid: request.params.restaurantId,
  })
    .setOptions({ strictQuery: false })
    .then((res) => response.send(res[0]));
});
app.get("/:restaurantId/home", async (req, res) => {
  let restaurantId = req.params.restaurantId;
  const active = await order
    .find({
      status: "active",
      restaurantId: restaurantId,
      timeStamp: {
        $gte: new Date(moment().local().startOf("day").format()),
        $lt: new Date(moment().local().startOf("day").add(1, "day").format()),
      },
    })
    .setOptions({ strictQuery: false });

  const completed = await order
    .find({
      status: { $in: ["completed"] },
      restaurantId: restaurantId,
      timeStamp: {
        $gte: new Date(moment().local().startOf("day").format()),
        $lt: new Date(moment().local().startOf("day").add(1, "day").format()),
      },
    })
    .setOptions({ strictQuery: false });

  const today = await order
    .find({
      status: { $in: ["completed", "cancelled", "active"] },
      restaurantId: restaurantId,
      timeStamp: {
        $gte: new Date(moment().local().startOf("day").format()),
        $lt: new Date(moment().local().startOf("day").add(1, "day").format()),
      },
    })
    .setOptions({ strictQuery: false });

  const thisMonth = await order
    .find({
      status: { $in: ["completed", "cancelled", "active"] },
      restaurantId: restaurantId,
      timeStamp: {
        $gte: new Date(moment().local().startOf("month").format()),
        $lt: new Date(
          moment().local().startOf("month").add(1, "month").format()
        ),
      },
    })
    .setOptions({ strictQuery: false });

  res.send({
    active: active,
    completed: completed,
    today: today,
    thisMonth: thisMonth,
  });
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
  const Order = new order({
    uuid: uuidv4(),
    tableNo: req.body.tableNo,
    items: req.body.items,
    status: "active",
    amount: req.body.amount,
    note: req.body.note,
    restaurantId: req.body.restaurantId,
    timeStamp: moment().local().format(),
    orderNo: Math.floor(100000 + Math.random() * 900000),
  });
  Order.save();
  res.json({ message: "Order Placed Successfully", status: 200 });
});
app.post("/login", (req, res) => {
  User.findOne({ userName: req.body.userName }, function (err, user) {
    if (user === null) {
      return res.status(403).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).send({
          message: "User Logged In",
          user: user,
        });
      } else {
        return res.status(403).send({
          message: "Wrong Password",
        });
      }
    }
  });
});
app.post("/signup", (req, res) => {
  let newUser = new User();
  (newUser.userName = req.body.userName),
    (newUser.email = req.body.email),
    (newUser.role = "restaurant.admin"),
    (newUser.restaurantId = uuidv4());
  newUser.setPassword(req.body.password);
  newUser.save((err, User) => {
    if (err) {
      return res.status(400).send({
        message: "Failed to add user.",
      });
    } else {
      return res.status(201).send({
        message: "User added successfully.",
      });
    }
  });
});
app.listen(4000, function () {
  console.log("Server started");
});
