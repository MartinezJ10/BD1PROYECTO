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
            
            console.log(req.body);
            console.log(result.rowsAffected[0]);
            
        if (result.rowsAffected[0] === 1) {

            const checkRol = await pool.request()
            .input("IdUsuario", sql.Int, result.recordset[0].ID )
            .query(queries.validarRol)

            console.log(checkRol.recordset[0].IdRol);

            switch (checkRol.recordset[0].IdRol) {
                case 1:
                    req.session.userCliente = result.recordset[0]
                    res.redirect('/principalCliente')
                    break;
                case 2:
                    req.session.userProductor = result.recordset[0] 
                    res.redirect('/principalProductor')
                default:
                    break;
            }
        }else {
            console.log("LOGIN FAILED");
            res.redirect('/login')
        }
    } catch (error) { 
        res.status(500).json({ error: `"Error al encontrar usuario ${error}"` });
    }
}

export const validarLogin = async (req,res,next) => {
    if (req.session.userCliente || req.session.userProductor) {
        next()
    }else{
        let err = new Error("Usuario no completo su Login")
        console.log(err);
        res.redirect("/login")
    }
}

/*
export const crearUsuario = async (req, res) => {
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
*/