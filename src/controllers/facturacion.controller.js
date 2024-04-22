import { sql,makeConnection } from "../database/database.js";
import {queries} from "../database/queries.js"

export const mostrarCarrito = async (req,res) => {
    try {
        const pool = await makeConnection()

        const IdFactura = req.session.facturaID
  
        const qryMostrarFacturaDetalle = await pool.request()
        .input("IdFactura", sql.Int, IdFactura)
        .query(queries.mostrarFacturaDetalles);

        const productosCarrito = qryMostrarFacturaDetalle.recordset

        res.render("carrito", {productos:productosCarrito})

    } catch (error) {
        console.error(`Error al obtener facturaDetatlle: ${error}`);
        res.status(500).json({ error: "Error al obtener facturaDetatlle" });
        
    }
}

export const agregarProductoCarrito = async (req,res) => {
    try {
        const pool = await makeConnection()
        const {ProductoID,PrecioProducto,cantidad} = req.body
        const IdFactura = req.session.facturaID
        const importe = cantidad*PrecioProducto

        const qryCrearFacturaDetalle = await pool.request()
        .input("IdFactura", sql.Int, IdFactura)
        .input("IdProducto", sql.Int, ProductoID)
        .input("PrecioProducto", sql.Decimal, PrecioProducto)
        .input("Cantidad", sql.Int, cantidad)
        .input("Importe", sql.Decimal, importe)
        .query(queries.crearFacturaDetalle);

        res.redirect("/mostrarCarrito")

    } catch (error) {
        console.error(`Error al generar facturaDetatlle: ${error}`);
        res.status(500).json({ error: "Error al generar facturaDetatlle" });
    }

}

export const mostrarFactura = async (req,res) => {
    try {
        const pool = await makeConnection()
        const IdFactura = req.session.facturaID

        const qryMostrarFacturaEnca = await pool.request()
        .input("IdFactura", sql.Int, IdFactura)
        .query(queries.mostrarFacturaEncabezado);

        const facturaEnca = qryMostrarFacturaEnca.recordset[0]

        const qryMostrarFacturaDetalle = await pool.request()
        .input("IdFactura", sql.Int, IdFactura)
        .query(queries.mostrarFacturaDetalles);
 
        const facturaDetalles = qryMostrarFacturaDetalle.recordset
 
        console.log(facturaEnca);
        res.render('factura',{facturaEnca,facturaDetalles})

    } catch (error) {
        console.error(`Error al generar mostrarFactura: ${error}`);
        res.status(500).json({ error: "Error al generar mostrarFactura" });
    }
}

export const generarFactura = async (req,res) => {
    try {
        const pool = await makeConnection()

        const defaultNumericValue = 0;
        const defaultTextValue = "1";
        const fechaHoy = new Date();

        const qryActualizarCorrelativo = await pool.request()
        .query(queries.actualizarNcorrelativo)

        const qryNcorrelativo = await pool.request()
        .query(queries.obtenerNcorrelativo)
        const Ncorrelativo = qryNcorrelativo.recordset[0].ActualRango;

        const idCliente = req.session.userCliente.ID;   

        const qryGenerarFactura = await pool.request()
            .input("IdCliente", sql.Int, idCliente)
            .input("N_Correlativo", sql.Int, Ncorrelativo)
            .input("NumeroFactura", sql.VarChar, defaultTextValue)
            .input("Fecha", sql.Date, fechaHoy)
            .input("SubTotal_Exento", sql.Decimal, defaultNumericValue)
            .input("SubTotal_ISV15", sql.Decimal, defaultNumericValue)
            .input("SubTotal_ISV18", sql.Decimal, defaultNumericValue)
            .input("ISV15", sql.Decimal, defaultNumericValue)
            .input("ISV18", sql.Decimal, defaultNumericValue)
            .input("Total", sql.Decimal, defaultNumericValue)
            .input("Efectivo", sql.Decimal, defaultNumericValue)
            .input("Cambio", sql.Decimal, defaultNumericValue)
            .query(queries.crearFactura);

        const IdFactura = qryGenerarFactura.recordset[0].ID
        
        const qryProcAlm_GenerarNumFactura = await pool.request()
        .input("idfactura",sql.Int,IdFactura)
        .query(queries.procAlmacenado_GenerarNumFactura)

        req.session.facturaID = IdFactura  

    } catch (error) {
        console.error(`Error al generar factura: ${error}`);
        res.status(500).json({ error: "Error al generar factura" });
    } 
}