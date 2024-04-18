import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"

export const getIndex = async (req,res) => {
    try {
        res.render('index.ejs')
    } catch (error) {
        console.error("Error en getIndex:", error);
        res.status(500).send("Ha ocurrido un error en el servidor.");
    }
}
export const validarUsuario = async (req, res) => {
    try {
        const pool = await makeConnection()
        const { Usuario, Contrasenia } = req.body;
        
        const result = await pool.request()
            .input("Usuario", sql.VarChar, Usuario)
            .input("Contrasenia", sql.VarChar, Contrasenia)
            .query(queries.validarUsuario);

        const checkRol = await pool.request()
        .input("IdUsuario", sql.Int, result.recordset[0].ID )
        .query(queries.validarRol)

        if (result.rowsAffected == 1) {
            switch (checkRol.recordset[0].IdRol) {
                case 1:
                    res.redirect('/principalCliente')
                    break;
                case 2:
                    res.redirect('/principalProductor')
                default:
                    break;
            }
        }else {
            res.redirect('/loginProductor')
        }
    } catch (error) { 
        res.status(500).json({ error: `"Error al encontrar usuario ${error}"` });
    }
}
/*
export const login = async (req, res) => {
    const pool = await makeConnection(); 
    const usuario = await pool.request().query(queries.obtenerUsuario)
    const result = usuario.recordset

    res.render('index.ejs',{
        result
    })
}
/*
export const eliminarPelicula = async (req, res) => {
    try {
        const pool = await makeConnection()
        const { id } = req.params;
        
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query(queries.eliminarPelicula);
            
            res.redirect('/');

    } catch (error) {
        res.status(500).json({ error: "Error al crear registro" });
    }
}
*/