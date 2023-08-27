import { Router } from "express";

import {
  getEmployees,
  createEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getListEmployees
} from "../controllers/employees.controllers.js";

const router = Router();

router.get("/download-employee-list", getListEmployees);

router.get("/employees/:id", getEmployees);

router.get("/employees/:id", getEmployee);

router.post("/employees/", createEmployees);

router.patch("/employees/:id", updateEmployee);

router.delete("/employees/:id", deleteEmployee);

export default router;
