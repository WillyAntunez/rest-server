const validarCampos = require('./validarCampos');
const validarJWT = require('./validarJWT');
const validarRoles = require('./validarRoles');
const validarArchivo = require('./validarArchivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo,
};