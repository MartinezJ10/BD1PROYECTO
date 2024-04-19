import { Router } from "express";
import { getIndex, validarLogin, validarUsuario } from "../controllers/login.controller.js"
import { crearPersona, dataRegistro, obtenerAldeas, obtenerColonias, obtenerDepartamentos, obtenerMunicipios } from "../controllers/registro.controller.js";

const router = Router();

router.get('/', getIndex)

router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/registro', dataRegistro) 
router.get('/departamento',obtenerDepartamentos)
router.get('/municipio',obtenerMunicipios)
router.get('/aldea',obtenerAldeas)
router.get('/colonia',obtenerColonias)

router.get('/principalProductor',validarLogin, (req, res) => {
    res.render('principalProductor', {user:req.session.userProductor})
});

router.get('/principalCliente',validarLogin, (req, res) => {
    res.render('principalCliente', {user:req.session.userCliente})
});

router.post('/validarLogin', validarUsuario)
  
router.post('/crearUsuario', crearPersona)


export default router;
