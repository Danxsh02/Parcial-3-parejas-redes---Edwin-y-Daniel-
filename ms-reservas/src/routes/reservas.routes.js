const { Router } = require('express');
const controller = require('../controllers/reservas.controller');
const { verificarToken, requiereRol } = require('../middleware/auth');

const router = Router();

// Todas las rutas exigen token
router.use(verificarToken);

// GET: cualquier rol autenticado
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

// POST, PUT y DELETE: solo administrador
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;