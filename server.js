import express, { request } from "express";
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

  const thisWeek = await order
    .find({
      status: { $in: ["completed", "cancelled"] },
      restaurantId: restaurantId,
      timeStamp: {
        $gte: new Date(moment().local().startOf("week").format()),
        $lt: new Date(moment().local().endOf("week").format()),
      },
    })
    .setOptions({ strictQuery: false });

  const thisMonth = await order
    .find({
      status: { $in: ["completed", "cancelled"] },
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
    thisWeek: thisWeek,
    thisMonth: thisMonth,
  });
});

app.post("/changeOrderStatus", (req, res) => {
  var myquery = { uuid: req.body.orderId };
  var newvalues = { $set: { status: req.body.status } };
  order.updateOne(myquery, newvalues, (err, response) => {
    if (response.modifiedCount == 1) {
      res.json({ message: "Order Status Updated Successfully", status: 200 });
    } else {
      res
        .status(501)
        .send({ message: "Order Status Update Failed", status: 501 });
    }
  });
});
app.post("/updateFoodItem", async (req, res) => {
  Restaurants.updateOne(
    { uuid: req.body.restaurantId },
    {
      $set: {
        "menu.$[].foodItems.$[xxx].category": req.body.category,
        "menu.$[].foodItems.$[xxx].name": req.body.name,
        "menu.$[].foodItems.$[xxx].price": req.body.price,
        "menu.$[].foodItems.$[xxx].shortDescription": req.body.shortDescription,
        "menu.$[].foodItems.$[xxx].imageUrl": req.body.imageUrl,
        "menu.$[].foodItems.$[xxx].veg": req.body.veg,
      },
    },
    { arrayFilters: [{ "xxx.uuid": req.body.foodItemId }] },
    (err, response) => {
      if (response.modifiedCount == 1) {
        res.json({ message: "Food Item Updated Successfully", status: 200 });
      } else {
        res
          .status(501)
          .send({ message: "Food Item Update Failed", status: 501 });
      }
    }
  );
});
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
