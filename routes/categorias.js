const { Router } = require("express");
const { check } = require("express-validator");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/dbValidators");
const { validarCampos } = require("../middlewares/validarCampos");
const { validarJWT } = require("../middlewares/validarJWT");
const { esAdminRole } = require("../middlewares/validarRoles");

const router = Router();

/* 
    {{URL}}/api/categories
*/

// Obtener todas las categorias - public
router.get('/', obtenerCategorias);

// Obtener una categoría por id
router.get('/:id',
    [
        check('id', 'El id no es valido ').isMongoId(),
        check('id').custom( existeCategoria ),
        validarCampos,
    ],    
    obtenerCategoria
);

// Crear una nueva categoría - privado - cualquier persona con un token valido
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ], 
    crearCategoria,
);

// Actualizar una nueva categoría - privado - cualquier persona con un token valido
router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'El id no es valido ').isMongoId(),
        check('id').custom( existeCategoria ),
        validarCampos,
    ],
    actualizarCategoria
);

// Borrar una categoria - admin
router.delete('/:id', 
    [
        validarJWT,
        esAdminRole,
        check('id', 'El id no es valido ').isMongoId(),
        check('id').custom( existeCategoria ),
        validarCampos,
    ], 
    borrarCategoria,
);

module.exports = router;

