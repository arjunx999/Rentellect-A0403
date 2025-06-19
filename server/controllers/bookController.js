import { Book } from "../models/book";

export const listBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, author, price, isbn, rental_time } = req.body;
    const imageUrls = req.files.map((file) => file.path);

    const newBook = new Book({
      owner: userId,
      title,
      author,
      price,
      isbn,
      rental_time,
      photos: imageUrls,
    });

    const savedBook = await newBook.save();

    res
      .status(200)
      .json({ message: "Book listing successfull", book: savedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const book = Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book listing not found" });
    }
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition } = req.body;

    const book = Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book listing not found" });
    }

    book.condition = condition;
    const updatedBook = await book.save();

    res.status(200).json({
      message: "Condition saved successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("owner", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("owner", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
