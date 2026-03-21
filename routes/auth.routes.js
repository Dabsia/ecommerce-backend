import express from "express";
import { login, createUser, resetPassword } from "../controller/auth.controller.js";

const router = express.Router()

router.post("/register", createUser);
router.post("/login", login);
router.post('/reset-password', resetPassword)


export default  router