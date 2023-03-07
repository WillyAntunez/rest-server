const { Router } = require("express");
const { check } = require("express-validator");
const { crearProducto, actualizarProducto, obtenerProducto, obtenerProductos, borrarProducto } = require("../controllers/productos");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const { existeCategoria, existeProducto } = require('../helpers/dbValidators');

const router = Router();

router.get('/', obtenerProductos);

router.get(
    '/:id', 
    [
        check('id').custom( existeProducto ),
        validarCampos,
    ],
    obtenerProducto,
);

router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').isString(),
        check('categoria').custom( existeCategoria ),
        validarCampos,
    ],
    crearProducto,  
);

router.put(
    '/:id', 
    [
        validarJWT,
        check('id').custom( existeProducto ),
        validarCampos,
    ],
    actualizarProducto
);

router.delete(
    '/:id', 
    [
        validarJWT,
        esAdminRole,
        check('id').custom( existeProducto ),
        validarCampos,
    ],
    borrarProducto
);

module.exports = router;