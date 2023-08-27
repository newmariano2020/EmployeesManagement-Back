import express from "express";
import indexRoutes from "./routes/index.routes.js";
import employeesRoutes from "./routes/employees.routes.js";
import cors from "cors";
import  usersRoutes from './routes/users.routers.js';
import Joi from "joi";
import sanitizeHtml from "sanitize-html"; 
import helmet from 'helmet';



const app = express();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:8000'
}));
app.use(express.json());

const validateAndSanitizeData = (req, res, next) => {
  if (req.body.avatar === null){
    return res.status(400).json({message:'Avatar no puede ser null'})
  } 
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    avatar: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Datos no válidos' });
  }

  
  req.body = {
    name: sanitizeHtml(value.name),
    password: value.password,
    email: sanitizeHtml(value.email),
    avatar: sanitizeHtml(value.avatar) 
  };

  next();
};
app.use(indexRoutes);
app.use("/api", employeesRoutes),validateAndSanitizeData;
app.use("/api", usersRoutes, validateAndSanitizeData);
app.use((req, res, next) => {
  res.status(404).json({ message: "endpoint not found" });
});

export default app;