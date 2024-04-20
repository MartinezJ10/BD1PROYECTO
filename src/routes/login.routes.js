import { Router } from "express";
import { getIndex, logout, validarLogin, validarUsuario } from "../controllers/login.controller.js"
import { crearPersona, dataRegistro, obtenerAldeas, obtenerColonias, obtenerDepartamentos, obtenerMunicipios } from "../controllers/registro.controller.js";
import { crearProductoProductor, dataProductos, obtenerDefinicionProductos, obtenerProductos } from "../controllers/productos.controller.js";
import multer from 'multer'

// CONFIG PARA MULTER 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/productos/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

const router = Router();
// RUTAS PARA LOGIN
router.get('/', getIndex)

router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/logout', logout)

router.get('/principalProductor',validarLogin, (req, res) => {
    res.render('principalProductor', {user:req.session.userProductor})
});

router.get('/principalCliente',validarLogin, obtenerProductos); 

router.post('/validarLogin', validarUsuario)
  
router.post('/crearUsuario', crearPersona)

//RUTAS PARA GENERAR DIRECCIONES
router.get('/registro', dataRegistro) 
router.get('/departamento',obtenerDepartamentos)
router.get('/municipio',obtenerMunicipios)
router.get('/aldea',obtenerAldeas)
router.get('/colonia',obtenerColonias)

//RUTAS PARA CREAR PRODUCTOS

router.get('/agregarProductos', dataProductos)

router.get('/definicionProducto', obtenerDefinicionProductos)

router.post('/crearProducto', upload.single('rutaImagen'),crearProductoProductor)

export default router;
