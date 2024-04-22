export const queries = {
    validarUsuario: "SELECT * FROM Usuarios WHERE Usuario = @Usuario AND Contrasenia = @Contrasenia;",
    validarRol : "SELECT IdRol FROM UsuarioRoles WHERE IdUsuario = @IdUsuario;",
    obtenerRoles: "SELECT * FROM Roles;", 
    obtenerPaises: "SELECT * FROM Paises ORDER BY Nombre;",
    obtenerDepartamentos: "SELECT * FROM Departamentos WHERE IdPais = @IdPais;",
    obtenerMunicipios: "SELECT * FROM Municipios WHERE IdDepartamento = @IdDepartamento;",
    obtenerAldeas: "SELECT * FROM Aldeas WHERE IdMunicipio = @IdMunicipio;",
    obtenerColonias: "SELECT * FROM Colonias WHERE IdAldea = @IdAldea;",
    crearDireccion: `INSERT INTO 
    Direcciones(IdColonia, IdAldea, IdMunicipio, IdDepartamento, IdPais, Referencia)  
    OUTPUT inserted.ID
    VALUES (@IdColonia, @IdAldea, @IdMunicipio, @IdDepartamento, @IdPais, @Referencia);`,
    crearPersona: `INSERT INTO 
    Personas (PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido, NumeroTelefono, Email, DNI, Genero, FechaNacimiento, IdDireccion)
    OUTPUT inserted.ID
    VALUES (@PrimerNombre, @SegundoNombre, @PrimerApellido, @SegundoApellido, @NumeroTelefono, @Email, @DNI, @Genero, @FechaNacimiento, @IdDireccion)`,
    crearUsuario: `INSERT INTO Usuarios (Usuario, Contrasenia, IdPersona)
    OUTPUT inserted.ID 
    VALUES (@Usuario, @Contrasenia, @IdPersona)`,
    asignarRolUsuario: "INSERT INTO UsuarioRoles (IdUsuario, IdRol) VALUES (@IdUsuario, @IdRol)",
    obtenerMedidas:"SELECT * FROM Medidas", 
    obtenerTipoProductos:"SELECT * FROM TipoProducto",
    obtenerDefinicionProductos: "SELECT * FROM DefinicionProducto WHERE IdTipoProducto = @IdTipoProducto",
    crearProducto: `INSERT INTO PRODUCTOS (Precio, Descripcion, Codigo, IdMedida, IdDefProducto, RutaImagen) 
    OUTPUT inserted.ID
    VALUES (@Precio, @Descripcion, @Codigo, @IdMedida, @IdDefProducto, @RutaImagen)`,
    crearProductoProductor: "INSERT INTO Producto_Productor (IdProducto,IdUsuarioProductor) VALUES (@IdProducto,@IdUsuarioProductor)",
    obtenerProductoProductor: `
    SELECT DP.Nombre Nombre, P.*  FROM Producto_Productor PP
    INNER JOIN Productos P ON PP.IdProducto = P.ID
    INNER JOIN DefinicionProducto DP ON P.IdDefProducto = DP.ID
    WHERE PP.IdUsuarioProductor = @IdUsuarioProductor`,
    obtenerProductosProductorModificada: ` 
    SELECT U.ID,Pr.ID AS ProductoID, Per.PrimerNombre, Per.PrimerApellido, Per.Email, Per.NumeroTelefono, DP.Nombre,Pr.RutaImagen, Pr.Precio, Pr.Descripcion, M.Nombre AS 'Medida'
    FROM Producto_Productor PP
    INNER JOIN Usuarios U ON PP.IdUsuarioProductor = U.ID
    INNER JOIN Personas Per ON U.IdPersona = Per.ID
    INNER JOIN Productos Pr ON PP.IdProducto = Pr.ID
    INNER JOIN DefinicionProducto DP ON Pr.IdDefProducto = DP.ID
    INNER JOIN Medidas M ON Pr.IdMedida = M.ID
    `,
    obtenerProductosProductorSeleccionada: `
    SELECT U.ID,Pr.ID AS ProductoID, Per.PrimerNombre, Per.PrimerApellido, Per.Email, Per.NumeroTelefono, DP.Nombre,Pr.RutaImagen, Pr.Precio, Pr.Descripcion, M.Nombre AS 'Medida'
    FROM Producto_Productor PP
    INNER JOIN Usuarios U ON PP.IdUsuarioProductor = U.ID
    INNER JOIN Personas Per ON U.IdPersona = Per.ID
    INNER JOIN Productos Pr ON PP.IdProducto = Pr.ID
    INNER JOIN DefinicionProducto DP ON Pr.IdDefProducto = DP.ID
    INNER JOIN Medidas M ON Pr.IdMedida = M.ID
    WHERE Pr.ID = @IdProducto
    `,
    obtenerTipoEstablecimiento: "SELECT * FROM TipoEstablecimientos",
    crearEstablecimiento: `INSERT INTO Establecimientos (IdDireccion, IdTipoEstablecimiento, HorarioApertura, HorarioCierre)
    OUTPUT inserted.ID
    VALUES (@IdDireccion, @IdTipoEstablecimiento, @HorarioApertura, @HorarioCierre);`,
    crearInventario: `INSERT INTO Inventarios(IdProducto, IdUsuarioProductor, IdTipoMovimiento, IdEstablecimiento, Cantidad, Fecha, Referencia)
    VALUES (@IdProducto, @IdUsuarioProductor, @IdTipoMovimiento, @IdEstablecimiento, @Cantidad, @Fecha, @Referencia)
    `,
    obtenerProductorEstablecimiento: `
    SELECT E.ID, P.Nombre + ',' + D.Nombre + ',' + M.Nombre + ',' + A.Nombre + ',' + C.Nombre + ',' + T.Nombre + ',' + E.HorarioApertura + ',' + E.HorarioCierre AS direccion
    FROM ProductoresEstablecimientos PE
    INNER JOIN Establecimientos E ON PE.IdEstablecimiento = E.ID
    INNER JOIN Direcciones Dir ON E.IdDireccion = Dir.ID
    INNER JOIN Paises P ON Dir.IdPais = P.ID
    INNER JOIN Departamentos D ON Dir.IdDepartamento = D.ID
    INNER JOIN Municipios M ON Dir.IdMunicipio = M.ID
    INNER JOIN Aldeas A ON Dir.IdAldea = A.ID
    INNER JOIN Colonias C ON Dir.IdColonia = C.ID
    INNER JOIN TipoEstablecimientos T ON E.IdTipoEstablecimiento = T.ID
    WHERE PE.IdUsuarioProductor = @IdUsuarioProductor;
    `,
    crearProductorEstablecimiento: `
    INSERT INTO ProductoresEstablecimientos 
    (IdUsuarioProductor, IdEstablecimiento) VALUES (@IdUsuarioProductor, @IdEstablecimiento);
    `,
    obtenerInventariosPorProductor: `
    SELECT I.ID,DP.Nombre producto, Mov.Nombre movimiento, (P.Nombre + ',' + D.Nombre + ',' + M.Nombre + ',' + A.Nombre + ',' + C.Nombre + ',' + CAST(E.IdTipoEstablecimiento AS VARCHAR) + ',' + T.Nombre) establecimiento, I.Cantidad cantidad, I.Fecha fecha, I.Referencia referencia
    FROM Inventarios I
    INNER JOIN Productos Pr ON I.IdProducto = Pr.ID
    INNER JOIN DefinicionProducto DP ON Pr.IdDefProducto = DP.ID
    INNER JOIN Usuarios U ON I.IdUsuarioProductor = U.ID
    INNER JOIN TipoMovimiento Mov ON I.IdTipoMovimiento = Mov.ID
    INNER JOIN Establecimientos E ON I.IdEstablecimiento = E.ID
    INNER JOIN Direcciones Dir ON E.IdDireccion = Dir.ID
    INNER JOIN Paises P ON Dir.IdPais = P.ID
    INNER JOIN Departamentos D ON Dir.IdDepartamento = D.ID
    INNER JOIN Municipios M ON Dir.IdMunicipio = M.ID
    INNER JOIN Aldeas A ON Dir.IdAldea = A.ID
    INNER JOIN Colonias C ON Dir.IdColonia = C.ID
    INNER JOIN TipoEstablecimientos T ON E.IdTipoEstablecimiento = T.ID
    WHERE I.IdUsuarioProductor = @IdUsuarioProductor
    `,
    inscripcionSAR:`
    INSERT INTO InscripcionSAR (FechaLimite, CAI, InicioRango, ActualRango, FinalRango, ActivoSAR, RTN, IdCaja, Establecimiento, IdTipoDocumento)
    VALUES ('2024-09-05', '35BD6A-0195F4-B34BAA-8B7D13-37791A-2D', 00000010, @ActualRango, 00100010, 'Activo', '06011969025801', 1, 1, 1);
    `,
    crearFactura:`
    DECLARE @InsertedIDs TABLE (ID INT);
    INSERT INTO Facturas 
    (IdUsuarioCliente, IdMetodoPago, IdInscripcion, N_Correlativo, NumeroFactura, Fecha, CAI, RTN, SubTotal_Exento, SubTotal_ISV15, SubTotal_ISV18, ISV15, ISV18, Total, Efectivo, Cambio)
    OUTPUT inserted.ID INTO @InsertedIDs(ID)
    VALUES (@IdCliente, 1, 1, @N_Correlativo, @NumeroFactura, @Fecha, (SELECT CAI FROM InscripcionSAR WHERE ID=1), (SELECT RTN FROM InscripcionSAR WHERE ID=1),  @SubTotal_Exento, @SubTotal_ISV15, @SubTotal_ISV18, @ISV15, @ISV18, @Total, @Efectivo, @Cambio);
     
    SELECT ID FROM @InsertedIDs; 
    `,  
    obtenerNcorrelativo:`
    SELECT ActualRango FROM InscripcionSAR;
    `,
    actualizarNcorrelativo: "UPDATE InscripcionSAR SET ActualRango = ActualRango + 1",
    obtenerFactura: "SELECT * FROM Facturas WHERE ID = @IdFactura",
    procAlmacenado_GenerarNumFactura: "EXEC CalcularNumeroFactura @idfactura",
    crearFacturaDetalle: `
    INSERT INTO FacturasDetalle (IdFactura, IdProducto, PrecioUnitario, Cantidad, Importe) 
    VALUES (@IdFactura, @IdProducto, @PrecioProducto, @Cantidad, @Importe)
    `,
    mostrarFacturaDetalles :`
    SELECT DefinicionProducto.Nombre, FacturasDetalle.PrecioUnitario, FacturasDetalle.Cantidad, Medidas.Nombre Medida, Importe FROM FacturasDetalle
    INNER JOIN Facturas ON FacturasDetalle.IdFactura = Facturas.ID
    INNER JOIN Productos ON FacturasDetalle.IdProducto = Productos.ID
    INNER JOIN DefinicionProducto ON Productos.IdDefProducto = DefinicionProducto.ID
    INNER JOIN Medidas ON Productos.IdMedida = Medidas.ID
    WHERE Facturas.ID = @IdFactura
    `,
    mostrarFacturaEncabezado:`
    SELECT Facturas.NumeroFactura, Facturas.Fecha,(Personas.PrimerNombre + ' ' + Personas.SegundoNombre + ' ' + Personas.PrimerApellido + ' ' + Personas.SegundoApellido) NombreCliente, Facturas.RTN, Facturas.CAI, Facturas.SubTotal_Exento, Facturas.SubTotal_ISV15, Facturas.SubTotal_ISV18, Facturas.ISV15, Facturas.ISV18, Facturas.Efectivo, Facturas.Cambio, Facturas.Total
    FROM Facturas
    INNER JOIN Usuarios ON Facturas.IdUsuarioCliente = Usuarios.ID
    INNER JOIN Personas ON Usuarios.IdPersona = Personas.ID
    WHERE Facturas.ID = @IdFactura
    `

    
}