import { Router } from "express";
import { createUserAccount, loginuser } from "../controller/user.controller.js";




const router = Router()


router.
    route("/")
    .post(createUserAccount)

    router.route("/login").post(loginuser)



export default router