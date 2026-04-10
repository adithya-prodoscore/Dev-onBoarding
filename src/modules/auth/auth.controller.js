import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Local Imports
import User from "./auth.model.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
    },
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({
    username,
  });

  if (!foundUser)
    return res.status(404).json({
      message: "User not found",
    });

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return res.status(400).json({ message: "Username or Password Incorrect" });

  const accessToken = jwt.sign(
    { username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  foundUser.refreshToken.push(newRefreshToken);
  await foundUser.save();

  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
};

// Refresh endpoint
export const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "Cookie not found" });

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });

  // Scenario - User logged out refresh token deleted/ but even after that someone gives that token
  if (!foundUser) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      await User.findOneAndUpdate(
        { username: decoded.username },
        { refreshToken: [] },
      );
    } catch (err) {
      console.log("Invalid Refresh Token");
    }

    return res.status(403).json({ message: "Unauthorized" });
  }

  // New Refresh Token Array
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken,
  );

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    foundUser.refreshToken = newRefreshTokenArray;
    await foundUser.save();
    return res.sendStatus(403);
  }

  const accessToken = jwt.sign(
    { username: decoded.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { username: decoded.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await foundUser.save();

  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
};
