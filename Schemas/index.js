import mongoose from "mongoose";
import crypto from "crypto";
export const FoodItemschema = new mongoose.Schema({
  uuid: String,
  name: String,
  price: Number,
  imageUrl: String,
  shortDescription: String,
  rating: Number,
  veg: Boolean,
});
var MenuSchema = new mongoose.Schema({
  category: String,
  foodItems: [FoodItemschema],
});

export const RestaurantSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  menu: [MenuSchema],
  rating: Number,
  address: String,
});

export const OrderSchema = new mongoose.Schema({
  uuid: String,
  tableNo: String,
  items: Array,
  status: String,
  amount: Number,
  note: String,
  restaurantId: String,
  timeStamp: Date,
  orderNo: Number,
});
export const UserSchema = mongoose.Schema({
  userName: String,
  email: String,
  role: Array,
  hash: String,
  salt: String,
});
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};
UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};
