const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if( !existeRol ) {
        throw new Error(`El rol ${ rol } no esta registrado en la BD`);
    };
}

const existeEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });

    console.log({existeEmail});

    if ( existeEmail ) {
        throw new Error('Ese correo ya está registrado');
    };
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await Usuario.findById(id);

    if( !existeUsuario ) {
        throw new Error(`El usuario con el id ${ id } no existe.`);
    };
};

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
}