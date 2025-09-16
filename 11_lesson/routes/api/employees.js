import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import employeesController from "../../controllers/employeesController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.route("/")
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route("/:id")
    .get(employeesController.getEmployee);

export default router;