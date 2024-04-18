import { Router } from "express";
import { getIndex, validarLogin, validarUsuario } from "../controllers/login.controller.js"

const router = Router();

router.get('/', getIndex)
/*
router.get('/loginCliente', (req, res) => {
    res.render('loginCliente');
});
*/

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/registro', (req, res) => {
    res.render('registro');
});

router.get('/principalProductor',validarLogin, (req, res) => {
    res.render('principalProductor', {user:req.session.userProductor});
});

router.get('/principalCliente',validarLogin, (req, res) => {
    res.render('principalCliente', {user:req.session.userCliente});
});

router.post('/validarLogin', validarUsuario);
//router.post('/crearUsuario', crearUsuario)
export default router;
