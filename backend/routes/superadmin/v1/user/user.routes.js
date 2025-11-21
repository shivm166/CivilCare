import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, getUserWithSocietyCount, updateUser } from "../../../../controllers/superadmin/users.controllers.js";

const router = Router()

router.route("/").get(getUserWithSocietyCount)

router.route("/:id")
                .get(getUserById)
                .patch(updateUser)
                .delete(deleteUser)

export default router