import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"
import { crearDireccion } from "./registro.controller.js";

export const dataEstablecimiento = async (req, res) => {
    try {
        const pool = await makeConnection()
        const qryPaises = await pool.request().query(queries.obtenerPaises)
        const qryTipoEstablecimiento = await pool.request().query(queries.obtenerTipoEstablecimiento)

        const paises = qryPaises.recordset
        const tiposEstablecimiento = qryTipoEstablecimiento.recordset
        
        res.render('crearEstablecimiento.ejs', {paises, tiposEstablecimiento})
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar Establecimientos ${error}"` });
    }
}
export const crearEstablecimiento = async (req,res) => {
    try {
        const pool = await makeConnection()

        const idDireccion = await crearDireccion(req,res)
        const {tipoEstablecimiento, horarioApertura, horarioCierre} = req.body; 
        console.log(req.body);
        const qryEstablecimientos = await pool.request()
        .input("IdDireccion", sql.Int, idDireccion)
        .input("IdTipoEstablecimiento", sql.Int, tipoEstablecimiento)
        .input("HorarioApertura", sql.VarChar, horarioApertura)
        .input("HorarioCierre", sql.VarChar, horarioCierre)
        .query(queries.crearEstablecimiento) 
        
        //req.session.establecimientoID = qryEstablecimientos.recordset[0].ID

        console.log(qryEstablecimientos);
        res.redirect("/principalProductor")

    } catch (error) {
        res.status(500).json({ error: `"Error al crear Establecimientos ${error}"` });

    }
}