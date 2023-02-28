
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/dbValidators');

const { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole 
} = require('../middlewares');

const router = Router();

router.get( '/', usuariosGet );

router.put( 
    '/:id', 
    [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos,
    ], 
    usuariosPut 
);

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe contener más de 6 caracteres').isLength({ min: 6 }),
        check('correo', 'El correo no es valido').isEmail(),
        check('rol').custom( esRoleValido ),
        check('correo').custom( existeEmail ),
        validarCampos,
    ],
    usuariosPost,
);

router.delete( '/:id', 
    [
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos,
    ],
    usuariosDelete 
);

module.exports = router;
