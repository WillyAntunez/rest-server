const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();


router.post( 
    '/login',  
    [
        check('correo', 'No enviaste un correo valido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos,
    ],
    login,
);

router.post( 
    '/google',  
    [
        check('id_token', 'id_token de google es necesario').not().isEmpty(),
        validarCampos,
    ],
    googleSignIn,
);

module.exports = router;