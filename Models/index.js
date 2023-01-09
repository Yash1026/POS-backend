import mongoose from "mongoose";
import {
  RestaurantSchema,
  FoodItemschema,
  OrderSchema,
  UserSchema,
} from "../Schemas/index.js";

export const Restaurants = mongoose.model("restaurants", RestaurantSchema);
export const foodItem = mongoose.model("menu", FoodItemschema, "menu");
export const order = mongoose.model("orders", OrderSchema);
export const User = mongoose.model("User", UserSchema);
