const { Router } = require('express');
const controller = require('../controllers/reservas.controller');
const { autenticar, soloAdministrador } = require('../middleware/auth');

const router = Router();

// Todas las rutas exigen token
router.use(autenticar);

// GET: cualquier rol autenticado
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

// POST, PUT y DELETE: solo administrador
router.post('/', soloAdministrador, controller.crear);
router.put('/:id', soloAdministrador, controller.actualizar);
router.delete('/:id', soloAdministrador, controller.eliminar);

module.exports = router;
