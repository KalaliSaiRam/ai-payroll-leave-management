const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");

const {verifyToken,allowRoles}
= require("../middleware/auth.middleware");


/* Profile */

router.get(
"/profile",
verifyToken,
employeeController.getProfile
);


router.put(
"/profile",
verifyToken,
employeeController.updateProfile
);


/* Manager Team ⭐ */

router.get(
"/team",
verifyToken,
allowRoles("MANAGER"),
employeeController.getTeam
);

/* HR / Admin Routes ⭐ */

router.get(
"/all",
verifyToken,
allowRoles("HR"),
employeeController.getAllEmployees
);

router.post(
"/create",
verifyToken,
allowRoles("HR"),
employeeController.createEmployee
);


module.exports=router;