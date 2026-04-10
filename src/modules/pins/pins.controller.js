import pool from "../../shared/database/db.js";

export const createPin = async (req, res) => {
  const { title, body, image_link, author_id } = req.body;

  const [result] = await pool.query(
    "INSERT INTO pins (title, body, image_link, author) VALUES (?, ?, ?, ?)",
    [title, body, image_link, author_id],
  );

  return res.status(201).json({
    id: result.insertId,
    title,
    body,
    image_link,
    author_id,
  });
};

export const getPins = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pins.*, users.username AS author
      FROM pins
      LEFT JOIN users ON pins.author_id = users.id
      ORDER BY pins.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pins" });
  }
};

export const getPinById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT pins.*, users.username AS author
      FROM pins
      LEFT JOIN users ON pins.author_id = users.id
      WHERE pins.id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Pin not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pin" });
  }
};

export const updatePin = async (req, res) => {
  const { id } = req.params;
  const { title, body, image_link } = req.body;

  try {
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

    res.json({ message: "Pin updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update pin" });
  }
};

export const deletePin = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM pins WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pin not found" });
    }

    res.json({ message: "Pin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete pin" });
  }
};
