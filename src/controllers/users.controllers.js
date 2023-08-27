import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      req.params.email,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({
        message: "User not found",
      });
      
    res.json(rows[0]);
    
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const createUsers = async (req, res) => {
  const { name, password, email, avatar } = req.body;

  try {
    const [userExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (userExists.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al verificar el usuario en la base de datos" });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const [rows] = await pool.query(
      "INSERT INTO users(name, password, email, avatar) VALUES (?, ?, ?, ?)",
      [name, hashedPassword, email, avatar]
    );
    

    const createEmployeeQuery = `
    INSERT INTO employees (user_id, name, salary)
    VALUES (?, 'EditMe', 0)
  `;
    await pool.query(createEmployeeQuery, [rows.insertId]);

    const token = jwt.sign({ userId: rows.insertId }, "secreto", {
      expiresIn: "1h",
    });
    console.log(token);
    res.status(201).json({
      message: "Registro exitoso",
      id: rows.insertId,
      name,
      avatar,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.body.user_id

  try {
    try {
      await pool.query(
        "DELETE FROM employees WHERE user_id = ?",
        [userId]
      );
      console.log("Employees Deleted");
      } catch (error) {
        return res.status(500).json({ message: "something went wrong" });
      }
    const [result] = await pool.query("DELETE FROM users WHERE email = ?", [
      req.params.id,
    ])
    console.log("User Deleted");
    ;
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "user not found" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" , error});
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, avatar } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE users SET name = IFNULL(?, name), email = IFNULL(?, email) , avatar = IFNULL(?, avatar) WHERE id = ?",
      [name, email, avatar, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
