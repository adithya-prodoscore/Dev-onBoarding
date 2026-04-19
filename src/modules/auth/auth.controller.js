import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Local Imports
import pool from "../../shared/database/db.js";
import validate from "./auth.validations.js";

export const register = async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { username, password } = value;

  const [existing] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
  );

  if (existing.length > 0) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
  );

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: result.insertId,
      username,
    },
  });
};

export const login = async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = value;

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  const foundUser = rows[0];

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(400).json({ message: "Username or Password Incorrect" });
  }

  const accessToken = jwt.sign(
    { id: foundUser.id, username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" },
  );

  const refreshToken = jwt.sign(
    { id: foundUser.id, username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
    [foundUser.id, refreshToken],
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
};

export const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  const [rows] = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [refreshToken],
  );

  if (rows.length === 0) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);

    return res.sendStatus(403);
  }

  const accessToken = jwt.sign(
    { id: decoded.id, username: decoded.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, username: decoded.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await pool.query("UPDATE refresh_tokens SET token = ? WHERE token = ?", [
    newRefreshToken,
    refreshToken,
  ]);

  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken });
};

export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // 204 - No contnet

  const refreshToken = cookies.jwt;

  await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [
    refreshToken,
  ]);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
