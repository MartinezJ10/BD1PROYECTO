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
    obtenerProductoProductor: `SELECT P.* FROM Producto_Productor PP
    JOIN Productos P ON PP.IdProducto = P.ID
    WHERE PP.IdUsuario_productor = @IdUsuario_productor`,
    obtenerProductos: `SELECT * FROM Productos`

}