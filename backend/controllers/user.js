// Importar dependencias y módulos
const user = require("../models/user");
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path")
const followService = require("../services/followService");
const Follow = require("../models/follow");
const Publication = require("../models/publication");
const { count } = require("console");
const validate = require("../helpers/validate");

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js",
        usuario: req.user
    });
}

// Registro de usuarios
const register = async (req, res) => {
    try {
        // Recoger datos de la petición
        let params = req.body;

        // Comprobar que me llegan bien (+ validación)
        if (!params.name || !params.email || !params.password || !params.nick) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar",
            });
        }

        // Validación avanzada
        validate(params);

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Control de usuarios duplicados
        const users = await User.find({
            $or: [
                { email: user_to_save.email },
                { nick: user_to_save.nick }
            ]
        });

        if (users && users.length >= 1) {
            return res.status(200).json({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña (por ejemplo con bcrypt)
        bcrypt.hash(user_to_save.password, 10, async (error, pwd) => {
            user_to_save.password = pwd;

            // Guardar usuario en la bbdd
            const userStored = await user_to_save.save();
            console.log(pwd)

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });
        })




    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error en el registro del usuario"
        });
    }
};


const login = async (req, res) => {
    try {
        // Recoger los parámteros body
        let params = req.body;

        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Buscar en la bbdd si existe
        const userLogin = await User.findOne({ email: params.email }); //.select({"password": 0});
        if (!userLogin) {
            return res.status(404).send({ status: "error", message: "No existe el usuario" });
        }

        // Comprobar su contraseña
        const pwd = bcrypt.compareSync(params.password, userLogin.password);
        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "La contraseña no es correcta"
            })
        }

        // Conseguir token
        const token = jwt.createToken(userLogin);

        // Datos usuarios
        return res.status(200).send({
            status: "succes",
            message: "Te has identificado correctamente",
            userLogin: {
                id: userLogin._id,
                name: userLogin.name,
                nick: userLogin.nick
            },
            token
        })



    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al hacer login"
        })
    }

}

const profile = async (req, res) => {
    // Recibir el parámetro del id de usuario por url
    const id = req.params.id;

    try {
        // Consulta para sacar los datos de usuario
        const userProfile = await User.findById(id).select({ password: 0, rol: -0 });
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe o hay un error"
            })
        }

        // Info de seguimiento
        const followInfo = await followService.followThisUser(req.user.id, id);

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            user: userProfile,
            following: followInfo.following,
            follower: followInfo.follower
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al cargar el perfil del usuario"
        })
    }
}

const list = async (req, res) => {
    try {
        const page = req.params.page ? parseInt(req.params.page) : null;
        const itemsPerPage = 5;

        let users;
        let total;
        let pages;

        if (page) {
            // 🔹 Modo paginado
            total = await User.countDocuments();
            users = await User.find()
                .sort('_id')
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .exec();

            pages = Math.ceil(total / itemsPerPage);
        } else {
            // 🔹 Sin paginar: devolver todos
            users = await User.find().select("-password -email -rol -__v ").sort('_id').exec();
            total = users.length;
            pages = 1;
        }

        if (!users || users.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles"
            });
        }

        // Sacar un array de ids de los usuarios que me siguen y los que sigo como victor
        let followUserIds = await followService.followUserIds(req.user.id);
        return res.status(200).send({
            status: "success",
            users,
            total,
            page: page || "all",
            itemsPerPage: page ? itemsPerPage : "all",
            pages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al listar usuarios",
            error: error.message
        });
    }
};

const update = async (req, res) => {
    // Recoger info del usuario a actualizar
    const userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.imagen;

    // Comprobar si el usuario ya existe
    try {

        // Control de usuarios duplicados
        let users = await User.find({
            $or: [
                { email: userToUpdate.email },
                { nick: userToUpdate.nick }
            ]
        });

        let userIsset = false;
        users.forEach(user => {
            if (userToUpdate && user.id != userIdentity.id) {
                userIsset = true;
            }

        });

        if (userIsset) {
            return res.status(200).json({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10)
            userToUpdate.password = pwd;
        }else{
            delete userToUpdate.password;
        }

        // Buscar y actualizar
        try {
            let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
            if (!userUpdated) {
                // Devolver respuesta
                return res.status(404).send({
                    status: "error",
                    message: "Error al actualizar"
                });
            }

            // Devolver respuesta
            return res.status(200).send({
                status: "success",
                message: "Método de actualizar usuario",
                userUpdated
            });

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Método de actualizar usuario",
            });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error en el registro del usuario"
        });
    }
};

const upload = async (req, res) => {

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye imagen"
        })
    }

    // Conseguir el nombre de archivo
    let image = req.file.originalname;

    // Sacar la extensión del archivo
    const imagenSplit = image.split("\.");
    const extension = imagenSplit[1];

    // Comprobar extensión 
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero no válida"
        })
    }

    // SI si es correcta guardar imagen en la bbdd
    const userUpdated = await User.findByIdAndUpdate(req.user.id, { image: req.file.filename }, { new: true, runValidators: true });
    if (!userUpdated) {
        return res.status(404).json({
            status: "error",
            mensaje: "Error en la subida del avatar"
        });
    }

    return res.status(200).send({
        status: "succes",
        user: userUpdated,
        file: req.file,

    });

};

const avatar = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {
        if (!exists) {
            return res.status(400).send({
                status: "error",
                message: "No existe el archivo"
            })
        }
        // Devolver un file
        return res.sendFile(path.resolve(filePath))
    })

}

const counters = async (req, res) => {
    let userId = req.user.id;

    if(req.params.id){
        userId = req.params.id
    }

    try {
        const following = await Follow.countDocuments({"user": userId});
        const followed = await Follow.countDocuments({"followed" : userId});
        const publications = await Publication.countDocuments({"user" : userId});

        return res.status(200).send({
            userId,
            following: following,
            followed: followed,
            publications: publications
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al cargar contadores"
        })
    }
}


// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar,
    counters
}