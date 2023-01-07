import mongoose from "mongoose";
export const FoodItemschema = new mongoose.Schema({
  uuid: String,
  name: String,
  price: Number,
  imageUrl: String,
  shortDescription: String,
  rating: String,
  vegOrNonVeg: String,
});

export const RestaurantSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  menu: Array,
  rating: Number,
  address: String,
});

export const OrderSchema = new mongoose.Schema({
  uuid: String,
  tableNo: String,
  items: Array,
  active: Boolean,
  amount: Number,
  note: String,
  restaurantId: String,
});
