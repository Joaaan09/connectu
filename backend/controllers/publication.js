const publication = require("../models/publication");
const Publication = require("../models/publication");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followService");

// Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/publication.js"
    })
}

// Guardar publicación
const save = async (req, res) => {
    try {
        // Recoger datos del body
        const params = req.body;

        // Si no me llegan dar respuesta negativa
        if (!params.text) return res.status(400).save({ status: "error", message: "Debes enviar el texto de la publicación" });

        // Crear y rellenar el objeto del modelo
        let newPublication = new Publication(params);
        newPublication.user = req.user.id;

        // Guardar objeto en la bbdd
        const publicationStored = await newPublication.save();

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Guardar publicación",
            publicationStored
        })

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "No se ha podido guardar la publicación"
        })
    }
}

// Sacar una publicación
const detail = async (req, res) => {
    try {
        // Sacar id de publicación de la url
        const publicationId = req.params.id;

        // Find con la condicion del id
        const publicationStored = await Publication.findById(publicationId);

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Detalles de publicación",
            publicationStored

        })

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "No existe la publicación"
        })
    }
}

// Eliminar publicaciones
const remove = async (req, res) => {
    try {
        // Sacar el id de la publicacion a eliminar
        const publicationId = req.params.id;

        // Find y luego un remove
        const publicationDeleted = await Publication.findByIdAndDelete({ "user": req.user.id, "_id": publicationId });

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Eliminar publicación",
            publicationDeleted
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar publicación",
        })
    }

}

// Listar publiaciones de un usuario
const user = async (req, res) => {
    try {
        // Sacar el id del usuario
        const userId = req.params.id;

        // Controlar la página
        let page = 1;
        if (req.params.page) {
            page = req.params.page;
        }

        const itemsPerPage = 5;

        // Find, populate, ordenar, paginar
        const publications = await Publication.find({ "user": userId }).sort("-created_at").populate("user", "-password -__v -rol -email").paginate(page, itemsPerPage)
        const total = await Publication.countDocuments({ "user": userId });

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Publicaciones del perfil de un user",
            publications,
            page,
            total,
            pages: Math.ceil(total / itemsPerPage)
        })

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en las publicaciones del perfil de un user",
        })
    }


}

// Subir ficheros
const upload = async (req, res) => {
    try {
        // Sacar publi id
        const publicationId = req.params.id;

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
        const publicationUpdated = await Publication.findByIdAndUpdate({ "user": req.user.id, "_id": publicationId }, { file: req.file.filename }, { new: true, runValidators: true });

        return res.status(200).send({
            status: "success",
            publication: publicationUpdated,
            file: req.file,

        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "error",
            message: "Error al subir el archivo",

        })
    }

};

// Devolver archivos multimedia imagenes
const media = (req, res) => {
    // Sacar el parámetro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, stats) => {
        if (error || !stats) {
            return res.status(404).send({
                status: "error",
                message: "No existe el archivo"
            });
        }

        // Devolver el archivo
        return res.sendFile(path.resolve(filePath));
    });
};

// Listar todas las publicaciones
const feed = async (req, res) => {
    try {
        // Sacar la página actual
        let page = 1;

        if (req.params.page) {
            page = req.params.page;
        }

        // Establecer numero de elementos por página
        let itemsPerPage = 5;

        // Sacar un array de id de usuarios que yo sigo como usuario identificado
        const myFollows = await followService.followUserIds(req.user.id);

        // Find a publicaciones in, ordenar, popular, paginar
        const publications = await Publication.find({
            user: myFollows.following
        }).populate("user", "-password -rol -__v -email").sort("-created_at").paginate(page, itemsPerPage);
        
        const total = await Publication.countDocuments({
            user: myFollows.following
        });


        // 
        return res.status(200).send({
            status: "succes",
            message: "Feed de publicaciones",
            myFollows: myFollows.following,
            publications,
            total,
            page,
            pages: Math.ceil(total/itemsPerPage)


        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No se han podido listar las publicaciones del feed"

        });
    }
}


// Exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}