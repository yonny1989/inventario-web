import mysql from "mysql2";

export const conexion = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "YONNY8820",

    database: "inventario"

});

conexion.connect((error) => {

    if(error){

        console.log(error);

    } else {

        console.log("MySQL conectado");

    }

});