import mongoose from "mongoose";
const FoodItemschema = new mongoose.Schema({
  uuid: String,
  name: String,
  price: Number,
  imageUrl: String,
  shortDescription: String,
  rating: String,
  vegOrNonVeg: String,
});

const RestaurantSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  menu: Array,
  rating: Number,
  address: String,
});

export default { RestaurantSchema, FoodItemschema };
