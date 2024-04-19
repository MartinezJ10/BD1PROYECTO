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

export const crearRegistroUsuario = async (req, res) => {
    try {
    } catch (error) {
        res.send(500).json({ error: `Error al crear registro de usuario: ${error.message}` });
    }

}

const crearDireccion = async (req, res) => {
    try {
        const pool = await makeConnection()

        let ID = Math.random() * (10000 - 10) + 10 //ELIMINAR LUEGO

        const {IdColonia, IdAldea, IdMunicipio, IdDepartamento, IdPais, Referencia} = req.body; 
        const qryDirecciones = await pool.request()
        .input("ID", sql.Int, ID)
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

        let ID = Math.random() * (10000 - 10) + 10 //ELIMINAR LUEGO
        
        console.log(req.body); 
        const idDireccion = await crearDireccion(req,res)

        const {primerNombre, segundoNombre, primerApellido, segundoApellido, numeroTelefono, email, dni, genero, fechaNacimiento} = req.body; 
        const qryPersonas = await pool.request()
        .input("ID", sql.Int, ID)
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

        console.log(qryPersonas);
        await asignarRolUsuario(req,res)
        res.redirect("/login")
    } catch (error) {
        throw new Error(`Error al crear persona: ${error.message}`);
    }
}

const asignarRolUsuario = async (req, res) => {
    try {
        const idUsuario = await crearUsuario(req,res)
        const pool = await makeConnection()

        let ID = Math.random() * (10000 - 10) + 10 //ELIMINAR LUEGO
    
        const {rol} = req.body; 
        const qryRolUsuario = await pool.request()
        .input("ID", sql.Int, ID)
        .input("IdUsuario", sql.Int, idUsuario)
        .input("IdRol", sql.Int, rol)
        .query(queries.asignarRolUsuario)

        console.log(qryRolUsuario);
    } catch (error) {
        throw new Error(`Error al asignar rol: ${error.message}`);

    }
}

const crearUsuario = async (req, res) => {
    try {
        const pool = await makeConnection()

        let ID = Math.random() * (10000 - 10) + 10 //ELIMINAR LUEGO
    
        const {usuario,contrasenia} = req.body; 
        const qryUsuarios = await pool.request()
        .input("ID", sql.Int, ID)
        .input("Usuario", sql.VarChar, usuario)
        .input("Contrasenia", sql.VarChar, contrasenia)
        .query(queries.crearUsuario)

        console.log(qryUsuarios);
        const insertedID = qryUsuarios.recordset[0].ID
        return insertedID

    } catch (error) {
        throw new Error(`Error al crear usuario: ${error.message}`);

    }
}