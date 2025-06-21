import { User } from "../models/user";
import { Message } from "../models/message";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "name email");

    // Extract unique user IDs
    const userMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;

      userMap.set(otherUser._id.toString(), otherUser);
    });

    const uniqueUsers = Array.from(userMap.values());

    res.status(200).json(uniqueUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
