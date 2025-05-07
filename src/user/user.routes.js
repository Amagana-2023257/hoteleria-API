import { Router } from "express"
import { getUserById, getUsers, updatePassword, updateUser, updateProfilePicture, deleteUser, updateOtherUser, deleteOtherUser } from "./user.controller.js"
import { getUserByIdValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator, deleteValidator, getUserValidator, updateOtherUserValidator, deleteOtherUserValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()


/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing users
 */

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the user
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "John"
 *                     surname:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "12345678"
 *                     role:
 *                       type: string
 *                       enum: [USER_ROLE, ADMIN_ROLE]
 *                       example: "USER_ROLE"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/findUser/:uid", getUserByIdValidator, getUserById)

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limite
 *         description: Number of users per page (optional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: desde
 *         description: Starting index for pagination (optional)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109f1"
 *                       name:
 *                         type: string
 *                         example: "Juan"
 *                       surname:
 *                         type: string
 *                         example: "Perez"
 *                       username:
 *                         type: string
 *                         example: "juanperez"
 *                       email:
 *                         type: string
 *                         example: "juanperez@gmail.com"
 *                       phone:
 *                         type: string
 *                         example: "58496741"
 *                       role:
 *                         type: string
 *                         enum: ["USER_ROLE", "ADMIN_ROLE"]
 *                         example: "USER_ROLE"
 *                       status:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Internal server error
 */

router.get("/",getUserValidator, getUsers)



/**
 * @swagger
 * /updatePassword:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username1"
 *               beforePassword:
 *                 type: string
 *                 example: "12345678ASddadaw$%s"
 *               newPassword:
 *                 type: string
 *                 example: "12345678AADS$asdfasf%"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Incorrect current password or new password does not meet requirements
 *       403:
 *         description: Unauthorized to update this user's password
 *       404:
 *         description: User not found or current password not provided
 *       500:
 *         description: Internal server error
 */

router.patch("/updatePassword", updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               beforeUsername:
 *                 type: string
 *                 example: "currentUsername"
 *               name:
 *                 type: string
 *                 example: "NewName"
 *               surname:
 *                 type: string
 *                 example: "NewSurname"
 *               username:
 *                 type: string
 *                 example: "newUsername"
 *               email:
 *                 type: string
 *                 example: "newEmail@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *               role:
 *                 type: string
 *                 enum: [CLIENT_ROLE, ADMIN_ROLE]
 *                 example: "CLIENT_ROLE"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data or role not allowed
 *       403:
 *         description: Unauthorized to update this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put("/updateUser", updateUserValidator, updateUser)

/**
 * @swagger
 * /updateUser/{uid}:
 *   put:
 *     summary: Update another user's details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "UpdatedName"
 *               surname:
 *                 type: string
 *                 example: "UpdatedSurname"
 *               username:
 *                 type: string
 *                 example: "updatedUsername"
 *               email:
 *                 type: string
 *                 example: "updatedEmail@example.com"
 *               phone:
 *                 type: string
 *                 example: "12345678"
 *               role:
 *                 type: string
 *                 enum: [ADMIN_GLOBAL, ADMIN_HOTEL, USER_ROLE, ADMIN_SERVICE]
 *                 example: "ADMIN_HOTEL"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data or role not allowed
 *       403:
 *         description: Unauthorized to update this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/updateUser/:uid", updateOtherUserValidator, updateOtherUser)


/**
 * @swagger
 * /updateProfilePicture:
 *   patch:
 *     summary: Actualiza la foto de perfil de un usuario
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: profilePicture
 *         type: file
 *         required: true
 *         description: La nueva foto de perfil del usuario
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada con éxito
 *       400:
 *         description: El archivo no es válido o no se pudo procesar
 *       500:
 *         description: Error al actualizar la foto de perfil
 */
router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture)

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Delete a user (set status to inactive)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               Password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User deleted successfully (status set to inactive)
 *       400:
 *         description: Incorrect password provided
 *       403:
 *         description: Unauthorized to delete this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteUser", deleteValidator, deleteUser)

/**
 * @swagger
 * /deleteUser/{uid}:
 *   delete:
 *     summary: Delete another user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Unauthorized to delete this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/deleteUser/:uid", deleteOtherUserValidator, deleteOtherUser)


export default router