import { pool } from "../db.js";
import { format } from "fast-csv";

export const getEmployee = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE user_id = ?",
      [userId]
    );
    if (rows.length <= 0)
      return res.status(404).json({
        message: "Employee not found",
      });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getListEmployees = async (req, res) => {
  const userId = req.query.userId;

  try {
    if (!userId) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const [employees] = await pool.query(
      "SELECT * FROM employees WHERE user_id = ?",
      [userId]
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employee-list.csv"
    );
    res.setHeader("Content-Type", "text/csv");

    const stream = format({ headers: true });
    stream.pipe(res);

    employees.forEach(async (employee) => {
      const { id, name, salary } = employee;
      stream.write({ ID: id, Nombre: name, Salary: salary });
    });

    stream.end();
  } catch (error) {
    console.error("Error al generar la lista de empleados en CSV:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE user_id = ?",
      [req.params.id]
    );

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const createEmployees = async (req, res) => {
  const { userId, name, salary } = req.body;
  try {
    const [rows] = await pool.query(
      "INSERT INTO employees(user_id, name, salary) VALUES (?, ?, ?)",
      [userId, name, salary]
    );

    res.send({
      id: rows.insertId,
      name,
      salary,
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const deleteEmployee = async (req, res) => {
  const { userId } = req.body;

  try {
    const [result] = await pool.query(
      "DELETE FROM employees WHERE user_id = ? AND id = ?",
      [userId, req.params.id]
    );
    console.log("executed");
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "employee not found" });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const { name, salary, userId } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE employees SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE user_id = ? AND id = ?",
      [name, salary, userId, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE user_id = ?",
      [userId]
    );
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
