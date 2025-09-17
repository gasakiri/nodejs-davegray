import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import employeesController from "../../controllers/employeesController.js";
import ROLES_LIST from "../../config/roles.js"
import verifyRoles from "../../middleware/verifyRoles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.route("/")
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id")
    .get(employeesController.getEmployee);

export default router;