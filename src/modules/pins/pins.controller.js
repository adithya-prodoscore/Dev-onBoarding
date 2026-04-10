import pool from "../../shared/database/db.js";
import { createValidate, updateValidate } from "./pins.validate.js";

export const createPin = async (req, res) => {
  const { error, value } = createValidate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { userId } = req.user;
  const { title, body, image_link } = value;

  const [result] = await pool.query(
    "INSERT INTO pins (title, body, image_link, author) VALUES (?, ?, ?, ?)",
    [title, body, image_link, userId],
  );

  return res.status(201).json({
    id: result.insertId,
    title,
    body,
    image_link,
    author: userId,
  });
};

// Get a Pin (Public Endpoint)
export const getPins = async (req, res) => {
  const [rows] = await pool.query(`
      SELECT pins.*, users.username AS author
      FROM pins
      LEFT JOIN users ON pins.author = users.id
      ORDER BY pins.created_at DESC
    `);

  return res.status(200).json(rows);
};

// Get a Pin by ID (Public Endpoint)
export const getPinById = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const [rows] = await pool.query(
    `
      SELECT pins.*, users.username AS author
      FROM pins
      LEFT JOIN users ON pins.author = users.id
      WHERE pins.id = ?
      `,
    [id],
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Pin not found" });
  }

  return res.status(200).json(rows[0]);
};

// Update a Pin
export const updatePin = async (req, res) => {
  const { error, value } = updateValidate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { title, body, image_link } = value;

  const [result] = await pool.query(
    `
      UPDATE pins
      SET title = ?, body = ?, image_link = ?
      WHERE id = ?
      `,
    [title, body, image_link, id],
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Pin not found" });
  }

  return res.status(200).json({ message: "Pin updated successfully" });
};

export const deletePin = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const [result] = await pool.query("DELETE FROM pins WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Pin not found" });
  }

  return res.json({ message: "Pin deleted successfully" });
};
