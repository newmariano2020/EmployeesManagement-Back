import { Router } from "express";
import { getUsers , createUsers, deleteUser,updateUser, getUser} from "../controllers/users.controllers.js";
import { loginUser } from "../controllers/login.controllers.js";


const router = Router();

router.post("/login", loginUser)


router.get('/users/:email', getUser)
router.get("/users", getUsers);
router.post("/users", createUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id",updateUser);

export default router;
