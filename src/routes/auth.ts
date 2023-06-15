import { Router } from "express";
import { authLogin, authValidate } from "../controllers/auth";

const router = Router();

router.post("/login", authLogin);

router.post("/authenticate", authValidate);

export default router;