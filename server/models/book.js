import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
    min: 2,
    max: 50,
  },
  author: {
    type: String,
    require: true,
    min: 2,
    max: 50,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isbn: {
    type: String,
    required: true,
  },
  rental_time: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  condition: {
    type: String,
    enum: ["good", "fair", "poor"],
    default: "good",
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  isRented: {
    type: Boolean,
    default: false,
  },
});

export const Book = mongoose.model("Book", bookSchema);
