import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* CONFIGURACION */

app.use(cors());
app.use(express.json());
app.use(express.static("./"));

/* CONEXION MYSQL RAILWAY */

const conexion = mysql.createConnection(process.env.MYSQL_URL);

/* CONECTAR MYSQL */

conexion.connect((error) => {

    if (error) {

        console.log("Error MySQL:", error);

    } else {

        console.log("MYSQL CONECTADO");

    }

});

/* RUTA PRINCIPAL */

app.get("/", (req, res) => {

    res.sendFile(process.cwd() + "/login.html");

});

/* REGISTRO */

app.post("/registro", async (req, res) => {

    const { nombre, correo, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO usuarios(nombre,correo,password,rol)
        VALUES(?,?,?,'usuario')
    `;

    conexion.query(
        sql,
        [nombre, correo, passwordHash],
        (error) => {

            if (error) {

                console.log(error);
                res.send("Error al registrar");

            } else {

                res.send("Usuario registrado");

            }

        }
    );

});

/* LOGIN */

app.post("/login", (req, res) => {

    const { correo, password } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE correo = ?
    `;

    conexion.query(sql, [correo], async (error, resultados) => {

        if (error) {

            console.log(error);
            res.send("Error servidor");

        } else {

            if (resultados.length > 0) {

                const usuario = resultados[0];

                const valido = await bcrypt.compare(
                    password,
                    usuario.password
                );

                if (valido) {

                    res.send("Login correcto");

                } else {

                    res.send("Contraseña incorrecta");

                }

            } else {

                res.send("Usuario no encontrado");

            }

        }

    });

});

/* GUARDAR PRODUCTOS */

app.post("/productos", (req, res) => {

    const { nombre, precio, cantidad, categoria } = req.body;

    const sql = `
        INSERT INTO productos(nombre,precio,cantidad,categoria)
        VALUES(?,?,?,?)
    `;

    conexion.query(
        sql,
        [nombre, precio, cantidad, categoria],
        (error) => {

            if (error) {

                console.log(error);
                res.send("Error guardar producto");

            } else {

                res.send("Producto guardado");

            }

        }
    );

});

/* MOSTRAR PRODUCTOS */

app.get("/productos", (req, res) => {

    const sql = `
        SELECT * FROM productos
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {

            console.log(error);
            res.send([]);

        } else {

            res.json(resultados);

        }

    });

});

/* ELIMINAR PRODUCTO */

app.delete("/productos/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM productos
        WHERE id = ?
    `;

    conexion.query(sql, [id], (error) => {

        if (error) {

            console.log(error);
            res.send("Error eliminar");

        } else {

            res.send("Producto eliminado");

        }

    });

});

/* EDITAR PRODUCTO */

app.put("/productos/:id", (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        precio,
        cantidad,
        categoria
    } = req.body;

    const sql = `
        UPDATE productos
        SET nombre=?,
            precio=?,
            cantidad=?,
            categoria=?
        WHERE id=?
    `;

    conexion.query(
        sql,
        [nombre, precio, cantidad, categoria, id],
        (error) => {

            if (error) {

                console.log(error);
                res.send("Error editar");

            } else {

                res.send("Producto actualizado");

            }

        }
    );

});

/* SERVIDOR */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

    console.log(`SERVIDOR CORRIENDO EN PUERTO ${PORT}`);

});