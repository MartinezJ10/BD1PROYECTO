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

        res.json(colonias)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar colonias ${error}"` });
    }
}

export const crearRegistroUsuario = async (req, res) => {
    try {
    } catch (error) {
        res.send(500).json({ error: `Error al crear registro de usuario: ${error.message}` });
    }

}

const crearDireccion = async (req, res) => {
    try {
        const pool = await makeConnection()

        const {IdColonia, IdAldea, IdMunicipio, IdDepartamento, IdPais, Referencia} = req.body; 
        const qryDirecciones = await pool.request()
        .input("IdColonia", sql.Int, IdColonia)
        .input("IdAldea", sql.Int, IdAldea)
        .input("IdMunicipio", sql.Int, IdMunicipio)
        .input("IdDepartamento", sql.Int, IdDepartamento)
        .input("IdPais", sql.Int, IdPais)
        .input("Referencia", sql.VarChar, Referencia)
        .query(queries.crearDireccion)
        
        const insertedID = qryDirecciones.recordset[0].ID
        return insertedID

    } catch (error) {
        throw new Error(`Error al crear dirección: ${error.message}`);
    }
}

export const crearPersona = async (req, res) => {
    try {
        const pool = await makeConnection()

        const idDireccion = await crearDireccion(req,res)

        const {primerNombre, segundoNombre, primerApellido, segundoApellido, numeroTelefono, email, dni, genero, fechaNacimiento} = req.body; 
        const qryPersonas = await pool.request()
        .input("PrimerNombre", sql.VarChar, primerNombre)
        .input("SegundoNombre", sql.VarChar, segundoNombre)
        .input("PrimerApellido", sql.VarChar, primerApellido)
        .input("SegundoApellido", sql.VarChar, segundoApellido)
        .input("NumeroTelefono", sql.VarChar, numeroTelefono)
        .input("Email", sql.VarChar, email)
        .input("DNI", sql.VarChar, dni)
        .input("Genero", sql.Char, genero)
        .input("FechaNacimiento", sql.Date, fechaNacimiento)
        .input("IdDireccion", sql.Int, idDireccion)
        .query(queries.crearPersona)

        const insertedID = qryPersonas.recordset[0].ID
        const idUsuario = await crearUsuario(req,res,insertedID)
        await asignarRolUsuario(req,res,idUsuario)
        
        res.redirect("/login")

    } catch (error) {
        throw new Error(`Error al crear persona: ${error.message}`);
    }
}

const asignarRolUsuario = async (req, res,idUsuario) => {
    try {
        const pool = await makeConnection()

        const {rol} = req.body; 
        const qryRolUsuario = await pool.request()
        .input("IdUsuario", sql.Int, idUsuario)
        .input("IdRol", sql.Int, rol)
        .query(queries.asignarRolUsuario)

        } catch (error) {
        throw new Error(`Error al asignar rol: ${error.message}`);

    }
}

const crearUsuario = async (req, res,idPersona) => {
    try {
        const pool = await makeConnection()

        const {usuario,contrasenia} = req.body; 
        const qryUsuarios = await pool.request()
        .input("Usuario", sql.VarChar, usuario)
        .input("Contrasenia", sql.VarChar, contrasenia)
        .input("IdPersona", sql.Int, idPersona)
        .query(queries.crearUsuario)

        const insertedID = qryUsuarios.recordset[0].ID
        return insertedID

    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);

    }
}

const crearCliente = async (req,res) => {
    try {
        
    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);

    }
}

const crearProductor = async (req,res) => {
    try {
        
    } catch (error) {
        throw new Error(`Error al crear Productor: ${error.message}`);

    }
}