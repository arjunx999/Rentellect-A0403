import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { College } from "../models/college.js";
import { User } from "../models/user.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(409).json({ msg: "Email ID is already taken" });
    }

    const normalizedCollege = college
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    let existingCollege = await College.findOne({ name: normalizedCollege });
    if (!existingCollege) {
      const newCollege = new College({ name: normalizedCollege });
      existingCollege = await newCollege.save();
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      college: existingCollege._id,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User successfully created",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
