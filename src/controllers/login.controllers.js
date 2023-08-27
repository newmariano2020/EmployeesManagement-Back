import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
 
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    

    if (user.length === 0) {
      return res.status(401).json({ message: "Email no encontrado" });
    }

    
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password no encontrado" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user[0].id }, "secreto", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", token, id: user[0].id });
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
