import express from "express";
import { login, createUser, resetPassword, changePassword } from "../controller/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/userValidator.js";
const router = express.Router()

router.post("/register", registerValidator, createUser);
router.post("/login", loginValidator, login);
router.post('/reset-password', resetPassword)
router.post('/change-password/:token', changePassword)


export default  router