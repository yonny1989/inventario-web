import mysql from "mysql2";

export const conexion = mysql.createConnection(process.env.MYSQL_URL);

conexion.connect((error) => {
    if (error) {
        console.log("Error MySQL:", error);
    } else {
        console.log("MySQL conectado");
    }
});