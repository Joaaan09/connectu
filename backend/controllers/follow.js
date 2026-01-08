const Follow = require("../models/follow");
const User = require("../models/user");
const mongoosePaginate = require("mongoose-pagination");
const followService = require("../services/followService");

// Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js"
    })
}

// Acción de guardar un follow (acción seguir) 
const save = async (req, res) => {
    try {
        const params = req.body;
        const identity = req.user;

        // Validar que haya un id de usuario a seguir
        if (!params.followed || params.followed.trim() === "") {
            return res.status(400).send({
                status: "error",
                message: "Debes indicar un usuario a seguir"
            });
        }

        // Crear objeto con modelo Follow
        const userToFollow = new Follow({
            user: identity.id,
            followed: params.followed
        });

        // Guardar objeto en la bbdd
        const followStored = await userToFollow.save();

        return res.status(200).send({
            status: "success",
            message: "Método dar follow",
            identity: req.user,
            follow: followStored
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "error",
            message: "Error en la petición"
        });
    }
};

// Acción de borrar un follow (acción dejar de seguir)
const unfollow = async (req, res) => {
    try {
        // Recoger el id del usuario identificado
        const userId = req.user.id;

        // Recoger el id del usuario que sigo y quiero dejar de seguir
        const followedId = req.params.id;

        // Find de las coincidencias y hacer remove
        const followDeleted = await Follow.findOneAndDelete({
            "user": userId,
            "followed": followedId
        });

        return res.status(200).send({
            status: "success",
            message: "Follow eliminado correctamente",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "error",
            message: "Error al dejar de seguir al usuario"
        });

    }
}

// Acción listado de usuarios que cualquier usuario está siguiendo (siguiendo)
const following = async (req, res) => {
    try {
        // Sacar el id del usuario identificado
        let userId = req.user.id;

        // Comprobar si me llega el id por parametro en la url
        if (req.params.id) userId = req.params.id;

        // Comprobar si me llega la página, sino la página 1
        let page = 1;

        if (req.params.page) page = req.params.page;

        // Usuarios por pagina quiero mostrar
        const itemsPerPage = 5;

        // Find a follow, popular datos de los usuarios y paginar con mongoose paginate
        const follows = await Follow.find({ user: userId }).populate("user followed", "-password -rol -__v -email").paginate(page, itemsPerPage);
        const total = await Follow.countDocuments({ user: userId });

        // Listado de usuarios de edu, y soy joan
        // Sacar un array de ids de los usuarios que me siguen y los que sigo como victor
        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).send({
            status: "succes",
            message: "Listado de usuarios que estoy siguiendo",
            follows,
            total,
            pages: Math.ceil(total / itemsPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error en el listado de usuarios que estoy siguiendo",
        });
    }

}

// Acción listado de usuarios que siguen a cualquier otro usuario (soy seguido)
const followers = async (req, res) => {

    try {
        // Sacar el id del usuario identificado
        let userId = req.user.id;

        // Comprobar si me llega el id por parametro en la url
        if (req.params.id) userId = req.params.id;

        // Comprobar si me llega la página, sino la página 1
        let page = 1;

        if (req.params.page) page = req.params.page;

        // Usuarios por pagina quiero mostrar
        const itemsPerPage = 5;

        // Find a follow, popular datos de los usuarios y paginar con mongoose paginate
        const follows = await Follow.find({ followed: userId }).populate("user followed", "-password -rol -__v -email").paginate(page, itemsPerPage);
        const total = await Follow.countDocuments({ user: userId });

        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).send({
            status: "succes",
            message: "Listado de usuarios que me siguen",
            follows,
            total,
            pages: Math.ceil(total / itemsPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error en el listado de usuarios que me siguen",
        });
    }
}

// Exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow,
    followers,
    following
}