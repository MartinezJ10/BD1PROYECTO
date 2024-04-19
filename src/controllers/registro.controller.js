import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"

export const dataRegistro = async (req, res) => {
    try {
        const pool = await makeConnection()
        const qryPaises = await pool.request().query(queries.obtenerPaises)
        const qryRoles = await pool.request().query(queries.obtenerRoles)

        const paises = qryPaises.recordset
        const roles = qryRoles.recordset

        res.render('registro.ejs',{
            paises,roles
        })
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar direcciones ${error}"` });
    }
}

export const obtenerDepartamentos = async (req,res) => {
    try {
        const pool = await makeConnection()
        const idPais = req.query.pais; 
        const qryDeptos = await pool.request()
        .input("IdPais", sql.Int, idPais)
        .query(queries.obtenerDepartamentos)

        const deptos = {deptos: qryDeptos.recordset}

        console.log(deptos);
        res.json(deptos)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar direcciones ${error}"` });
    }
}

export const obtenerMunicipios = async (req,res) => {
    try {
        const pool = await makeConnection()
        const idDepto = req.query.departamento; 
        const qryMunicipios = await pool.request()
        .input("IdDepartamento", sql.Int, idDepto)
        .query(queries.obtenerMunicipios)

        console.log(qryMunicipios);

        const municipios = {municipios: qryMunicipios.recordset}
        console.log(municipios);

        res.json(municipios)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar direcciones ${error}"` });
    }
}

export const obtenerAldeas = async (req,res) => {
    try {
        const pool = await makeConnection()
        const idMuni = req.query.municipio; 
        const qryAldeas = await pool.request()
        .input("IdMunicipio", sql.Int, idMuni)
        .query(queries.obtenerAldeas)

        const aldeas = {aldeas: qryAldeas.recordset}
        console.log(aldeas);

        res.json(aldeas)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar direcciones ${error}"` });
    }
}

export const obtenerColonias = async (req,res) => {
    try {
        const pool = await makeConnection()
        const idAldea = req.query.aldea; 
        const qryColonias = await pool.request()
        .input("idAldea", sql.Int, idAldea)
        .query(queries.obtenerColonias)

        const colonias = {colonias: qryColonias.recordset}
        console.log(colonias);

        res.json(colonias)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar colonias ${error}"` });
    }
}




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
