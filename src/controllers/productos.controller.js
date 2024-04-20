import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"

export const dataProductos = async (req, res) => {
    try {
        const pool = await makeConnection()
        const qryMedidas = await pool.request().query(queries.obtenerMedidas)
        const qryTipoProductos = await pool.request().query(queries.obtenerTipoProductos)
 
        const medidas = qryMedidas.recordset
        const tipoProductos = qryTipoProductos.recordset

        res.render('crearProducto.ejs',{
            medidas,tipoProductos, 
        })
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar direcciones ${error}"` });
    }
}

const crearProducto = async (req, res) => {
   try {
    const pool = await makeConnection()

    console.log(req.body);
    
    const {precio, descripcion, codigo, medida, definicionProducto} = req.body; 
    const rutaImagen = req.file.path.replace(/^public\\/, ''); //PARA QUE FUNCIONE EL STATIC

    const qryProducto = await pool.request()
    .input("Precio", sql.Decimal, precio)
    .input("Descripcion", sql.VarChar, descripcion)
    .input("Codigo", sql.VarChar, codigo)
    .input("IdMedida", sql.Int, medida)
    .input("IdDefProducto", sql.Int, definicionProducto)
    .input("RutaImagen", sql.VarChar, rutaImagen)
    .query(queries.crearProducto)

    const insertedID = qryProducto.recordset[0].ID
    return insertedID 
   } catch (error) { 
    res.status(500).json({ error: `"Error al crear producto ${error}"` });

   }
}

export const crearProductoProductor = async (req, res) => {
    try {
        const pool = await makeConnection()

        console.log(req.session);
        const IdUsuarioProductor = req.session.userProductor.ID; 
        const IdProducto = await crearProducto(req,res)
        
        const qryProductoProductor = await pool.request()
        .input("IdProducto", sql.Int, IdProducto)
        .input("IdUsuarioProductor", sql.Int, IdUsuarioProductor)
        .query(queries.crearProductoProductor)

        res.redirect("/principalProductor")
    } catch (error) {
        res.status(500).json({ error: `"Error al crear Producto-Productor ${error}"` });

    }
}

export const obtenerDefinicionProductos = async (req, res) => {
    try {
        const pool = await makeConnection()
        const idTipoProducto = req.query.tipo; 
        const qryDefinicioProductos = await pool.request()
        .input("IdTipoProducto", sql.Int, idTipoProducto)
        .query(queries.obtenerDefinicionProductos)

        const productos = {dfnProductos: qryDefinicioProductos.recordset}

        res.json(productos)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar DefinicionProductos ${error}"` });
    }
}


export const obtenerProductos = async (req,res) => {
    try {
        const pool = await makeConnection()

        const qryObtenerProductos = await pool.request()
        .query(queries.obtenerProductos)
        
        const qryObtenerTipoProductos = await pool.request()
        .query(queries.obtenerTipoProductos)

        const data = {
            productos: qryObtenerProductos.recordset,
            tipoProductos: qryObtenerTipoProductos.recordset,
            user:req.session.userCliente
        }
        console.log(data);
        res.render('principalCliente',data)

    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar DATAINICIALCLIENTE ${error}"` });

    }
}