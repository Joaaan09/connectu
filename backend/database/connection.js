const mongoose = require("mongoose");

const connection = async () => {
    try {
        const dbHost = process.env.DB_HOST || "localhost";
        const dbPort = process.env.DB_PORT || "27017";
        const dbName = process.env.DB_NAME || "mi_redsocial";
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;

        const mongoUrl = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        
        await mongoose.connect(mongoUrl);

        console.log(`Conectado a la bd: ${dbName}`);

    } catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {
    connection
}