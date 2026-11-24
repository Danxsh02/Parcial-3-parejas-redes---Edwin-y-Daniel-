// CAPA DE PRESENTACIÓN: rutas de habitaciones (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/habitaciones.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /habitaciones  y  GET /habitaciones?ids=1,3
router.get('/:id', controller.obtener);   // GET /habitaciones/:id

module.exports = router;
