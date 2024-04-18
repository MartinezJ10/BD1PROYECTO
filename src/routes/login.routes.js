import { Router } from "express";
import { getIndex, validarUsuario } from "../controllers/login.controller.js"

const router = Router();

router.get('/', getIndex)

router.get('/loginCliente', (req, res) => {
    res.render('loginCliente');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/principalProductor', (req, res) => {
    res.render('principalProductor');
});

router.get('/principalCliente', (req, res) => {
    res.render('principalCliente');
});
router.post('/validarLogin', validarUsuario);

export default router;
