export const queries = {
    validarUsuario: "SELECT * FROM Usuarios WHERE Usuario = @Usuario AND Contrasenia = @Contrasenia",
    validarRol : "SELECT IdRol FROM UsuarioRoles WHERE IdUsuario = @IdUsuario"
}