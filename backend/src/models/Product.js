const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { tyoe: String, require: true,unique:true },
    image: { tyoe: String, require: true, unique: true },
    type: { tyoe: String, require: true },
    price: { tyoe: Number, require: true },
    inStock: { tyoe: Number, require: true },
    rating: { tyoe: Number, require: true },
    description: { tyoe: String, require: true },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
