import { User } from "../models/user.js";
import { Message } from "../models/message.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("college", "name");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
    5;
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ timestamp: -1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    const contacts = [];
    const seen = new Set();

    for (let msg of messages) {
      let otherUser =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;

      if (otherUser && !seen.has(otherUser._id.toString())) {
        seen.add(otherUser._id.toString());
        contacts.push({ id: otherUser._id, name: otherUser.name });
      }
    }

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rentedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("rented_books");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const books = user.rented_books;
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const ownerBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("listed_books");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listedBooks = user.listed_books;

    const activeRentals = listedBooks.filter((book) => book.isRented === true);
    const availableBooks = listedBooks.filter(
      (book) => book.isRented === false
    );
    res.status(200).json({
      activeRentals,
      availableBooks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
