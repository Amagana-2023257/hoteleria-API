import { hash, verify } from "argon2";
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"


const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await User.findById(uid).populate("_id name surname username email role phone")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limite = 20, desde = 0 } = req.query
        const query = { status: true }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { beforePassword, newPassword, username } = req.body

        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findOne({ username: username }).select("_id role password");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para ver este usuario"
            });
        }


        if (req.usuario.role === "USER_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro usuario que no sea el tuyo."
            });
        }

        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar la contraseña a otro admin"
            });
        }

        if (!beforePassword) {
            return res.status(404).json({
                success: false,
                message: "debes de colocar la password anterior."
            });

        }

        //Verificar la password anterior colocada en el body, con la password de la db.
        const VerifybeforePassword = await verify(existingUsername.password, beforePassword);
        if (!VerifybeforePassword) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }


        const matchOldAndNewPassword = await verify(existingUsername.password, newPassword)

        if (matchOldAndNewPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(existingUsername._id, { password: encryptedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { beforeUsername } = req.body
        const userToUpdate = await User.findById(_id)

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const existingUsername = await User.findOne({ username: beforeUsername }).select("_id role");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "USER_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para cambiar datos de otro usuario que no sea el tuyo."
            });
        }

        const data = req.body;

        /*Miramos que el usuario que esta intentando actualizar sea ADMIN_ROLE y que si quiere actualizar a otro ADMIN_ROLE
        que no sea a si mismo, no pueda hacerlo.
        */
        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar a otro admin."
            });
        }

        /*Aqui valido de que si el usuario se pone como admin o otro rol distinto a user_role
        no le deje cambiarselo, unicamente user.*/
        if (req.usuario.role !== "ADMIN_GLOBAL" && data.role && data.role !== "USER_ROLE") {
            return res.status(400).json({
                message: "Tu solamente te puedes ser: USER_ROLE"
            });
        }

        const user = await User.findByIdAndUpdate(existingUsername._id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const updateOtherUser = async (req, res) => {
    try {
        const { uid } = req.params
        const { token } = req.usuario
        const userToUpdate = await User.findById(uid)
        const data = req.body;

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const existingUsername = await User.findById(uid).select("_id role");

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar a otro admin."
            });
        }

        const user = await User.findByIdAndUpdate(userToUpdate._id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const deleteOtherUser = async (req, res) => {
    try {
        const { token } = req.usuario
        const { uid } = req.params

        const user = await User.findById(uid)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findById(uid).select("_id role");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar otro admin."
            });
        }

        await User.findByIdAndUpdate(existingUsername._id, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            existingUsername
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}


export const updateProfilePicture = async (req, res) => {
    try {
        const { _id } = req.usuario
        const userToUpdate = await User.findById(_id)

        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        let newProfilePicture = req.file ? req.file.filename : null
        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }
        const user = await User.findById(_id)
        if (user.profilePicture) {
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }
        user.profilePicture = newProfilePicture
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Foto actualizada",
            profilePicture: user.profilePicture,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}


export const createDefaultUser = async () => {
    try {
        /*Agregamos la constante de email por default antes 
        debido a que necesitamos este email para buscar si ya existe.
        */
        const defaultEmail = "admin@example.com";


        const existingUser = await User.findOne({ email: defaultEmail });

        if (existingUser) {
            console.log("El usuario administrador global ya existe. No se creará nuevamente.");
            return;
        }


        const hashedPassword = await hash("Admin1234#/SFDS=)");


        const defaultUser = new User({
            name: "Admin",
            surname: "User",
            username: "admin",
            email: defaultEmail,
            password: hashedPassword,
            phone: "12345678",
            role: "ADMIN_GLOBAL",
            status: true,
        });


        await defaultUser.save();

        //Mandamos un console log en consola para dar a entender de que se creo perfectamente.
        console.log("Usuario administrador global creado exitosamente.");
    } catch (error) {
        console.error("Error al crear el usuario administrador:", error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.usuario
        const { Password, username } = req.body

        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const existingUsername = await User.findOne({ username: username }).select("_id role password");

        if (!existingUsername) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar otro admin."
            });
        }


        if (req.usuario.role === "USER_ROLE" && req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar a otro usuario que no sea el tuyo."
            });
        }


        if (req.usuario.role === "ADMIN_GLOBAL" && existingUsername.role === "ADMIN_GLOBAL" &&
            req.usuario._id.toString() !== existingUsername._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar a otro admin"
            });
        }

        if (!Password) {
            return res.status(404).json({
                success: false,
                message: "debes de colocar la password del usuario."
            });

        }

        //Verificar la password anterior colocada en el body, con la password de la db.
        const VerifybeforePassword = await verify(existingUsername.password, Password);
        if (!VerifybeforePassword) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }

        await User.findByIdAndUpdate(existingUsername._id, { status: false }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            existingUsername
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}