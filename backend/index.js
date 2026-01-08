// Importar dependencias
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Mensaje bienvenida
console.log("API NODE para RED SOCIAL arrancada");

// Conexión a  bbdd
connection();

// Crear servidor node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); // Cualquier dato que llegue con el formato url enconded lo codificara como un objeto js

// Servir archivos estáticos
app.use("/uploads", express.static("./uploads"));

// Cargar conf rutas
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Joan",
            "web": "joancoll.com"
        }
    )
})

// Poner el servidor a escuhcar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto)
})