const validarCampos = require('./validarCampos');
const validarJWT = require('./validarJWT');
const validarRoles = require('./validarRoles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
};