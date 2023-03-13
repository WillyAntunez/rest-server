const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivo } = require('../middlewares');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/dbValidators');


const router = Router();

router.post( '/', 
    [
        validarArchivo,
    ],
    cargarArchivo, 
);

router.put('/:coleccion/:id', 
    [
        check('id', 'El id debe de ser un id de mongo valido').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
        validarArchivo,
        validarCampos,
    ],    
    // actualizarImagen,
    actualizarImagenCloudinary,
);

router.get( '/:coleccion/:id', 
    [
        
    ],  
    mostrarImagen,
)

module.exports = router;