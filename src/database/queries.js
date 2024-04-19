export const queries = {
    validarUsuario: "SELECT * FROM Usuarios WHERE Usuario = @Usuario AND Contrasenia = @Contrasenia",
    validarRol : "SELECT IdRol FROM UsuarioRoles WHERE IdUsuario = @IdUsuario",
    obtenerRoles: "SELECT * FROM Roles", 
    obtenerPaises: "SELECT * FROM Pais ORDER BY Nombre",
    obtenerDepartamentos: "SELECT * FROM Departamento WHERE IdPais = @IdPais",
    obtenerMunicipios: "SELECT * FROM Municipio WHERE IdDepartamento = @IdDepartamento",
    obtenerAldeas: "SELECT * FROM Aldea WHERE IdMunicipio = @IdMunicipio",
    obtenerColonias: "SELECT * FROM Colonia WHERE IdAldea = @IdAldea",
}