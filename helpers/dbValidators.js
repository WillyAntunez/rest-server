const Categoria = require('../models/categoria');
const producto = require('../models/producto');
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

const existeCategoria =  async (id) => {
    const existeCategoria = await Categoria.findById(id);

    if(!id){
        throw new Error('La categoría es obligatoria');
    }

    if(!existeCategoria){
        throw new Error(`La categoría con el id ${ id } no existe`);
    }
}

const existeProducto = async (id) => {
    
    const existeProducto = await producto.findById(id);

    if(!existeProducto) {
        throw new Error(`El producto con el id ${ id } no existe`)
    }

}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes( coleccion );

    if(!incluida) {
        throw new Error( `La coleccion ${coleccion} no es permitida, ${colecciones}` );
    };

    return true;
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}