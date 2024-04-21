import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"

export const dataProductos = async (req, res) => {
    try {
        const pool = await makeConnection()
        const qryMedidas = await pool.request().query(queries.obtenerMedidas)
        const qryTipoProductos = await pool.request().query(queries.obtenerTipoProductos)
        
        const IdUsuarioProductor = req.session.userProductor.ID 

        const qryEstablecimientoProductor = await pool.request()
        .input("IdUsuarioProductor", sql.Int, IdUsuarioProductor)
        .query(queries.obtenerProductorEstablecimiento)

        const medidas = qryMedidas.recordset
        const establecimientos = qryEstablecimientoProductor.recordset
        const tipoProductos = qryTipoProductos.recordset

        res.render('crearProducto.ejs',{
            medidas,tipoProductos, establecimientos
        })
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar dataProductos ${error}"` });
    }
}

const crearProducto = async (req, res) => {
   try {
    const pool = await makeConnection()

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

        const IdUsuarioProductor = req.session.userProductor.ID; 
        const IdProducto = await crearProducto(req,res)

        const qryProductoProductor = await pool.request()
        .input("IdProducto", sql.Int, IdProducto)
        .input("IdUsuarioProductor", sql.Int, IdUsuarioProductor)
        .query(queries.crearProductoProductor)
        
        await crearInventario(req,res,IdProducto)

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

export const obtenerProductoProductor = async (req,res) => {
    try {
        const pool = await makeConnection()
        const IdUsuarioProductor = req.session.userProductor.ID; 

        const qryObtenerProductoProductor = await pool.request()
        .input("IdUsuarioProductor",sql.Int, IdUsuarioProductor)
        .query(queries.obtenerProductoProductor)

        const data = {
            productosProductor:qryObtenerProductoProductor.recordset,
            user:req.session.userProductor
        } 
        res.render('principalProductor.ejs', data)
    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar producto-productor ${error}"` });
    }
}

export const obtenerProductos = async (req,res) => {
    try {
        const pool = await makeConnection() 

        const qryObtenerProductos = await pool.request()
        .query(queries.obtenerProductosProductorModificada)
        
        const qryObtenerTipoProductos = await pool.request()
        .query(queries.obtenerTipoProductos) 
        const data = {
            productos: qryObtenerProductos.recordset,
            tipoProductos: qryObtenerTipoProductos.recordset,
            user:req.session.userCliente
        }

        res.render('principalCliente',data)

    } catch (error) {
        res.status(500).json({ error: `"Error al encontrar obtenerProductos ${error}"` });

    }
}

export const obtenerProductoSeleccionado = async (req,res) => {
    try{
    const pool = await makeConnection() 

    const IdProducto = req.query.IdProducto

    const qryObtenerProductoSeleccionado = await pool.request()
    .input("IdProducto",sql.Int, IdProducto)
    .query(queries.obtenerProductosProductorSeleccionada)
 
    const producto = qryObtenerProductoSeleccionado.recordset[0]
  
    res.render('verProducto.ejs',{ producto })

} catch (error) {
    res.status(500).json({ error: `"Error al encontrar obtenerProductos ${error}"` });

}
}

const crearInventario = async (req,res,IdProducto) => {
    try {
        const pool = await makeConnection()
        const {cantidad,descripcion,IdEstablecimiento} = req.body

        const IdUsuarioProductor = req.session.userProductor.ID 
        const fechaActual = new Date();
        const qryInventario = await pool.request()
        .input("IdProducto", sql.Int, IdProducto)
        .input("IdUsuarioProductor", sql.Int, IdUsuarioProductor)
        .input("IdTipoMovimiento", sql.Int, 1)
        .input("IdEstablecimiento", sql.Int, IdEstablecimiento)
        .input("Cantidad", sql.Int, cantidad)
        .input("Fecha", sql.Date, fechaActual)
        .input("Referencia", sql.VarChar, descripcion)
        .query(queries.crearInventario)

        res.redirect("/principalProductor")

    } catch (error) {
        res.status(500).json({ error: `"Error al crear Inventario ${error}"` });

    }
}

export const obtenerInventarios = async (req,res) => {
    try {
        const pool = await makeConnection()

        const IdUsuarioProductor = req.session.userProductor

        const qryObtenerInventario = await pool.request()
        .input("IdUsuarioProductor", sql.Int, IdUsuarioProductor.ID)
        .query(queries.obtenerInventariosPorProductor)

        console.log(qryObtenerInventario);
        console.log(IdUsuarioProductor);
        const inventarios = qryObtenerInventario.recordset

        res.render("inventario",{inventarios,IdUsuarioProductor})

    } catch (error) {
        res.status(500).json({ error: `"Error al obtenere Inventario ${error}"` });

    }
}
