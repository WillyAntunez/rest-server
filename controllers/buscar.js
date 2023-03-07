const { response } = require("express");
const { isValidObjectId } = require("mongoose");

const Categoria = require("../models/categoria");
const Producto = require("../models/producto");
const Role = require("../models/role");
const Usuario = require('../models/usuario');

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = isValidObjectId( termino );

    if( esMongoId ) {
        const usuario = await Usuario.findById( termino );

        return res.json( { 
            results: (usuario) ? [ usuario ] : [],
        } );
    };

    const regexp = new RegExp( termino, 'i' );

    const usuarios = await Usuario
        .find({ 
            $or: [ { nombre: regexp  }, { correo: regexp } ],
            $and: [ {estado: true} ],
        })

    res.json( { 
        results: usuarios,
    });

};

const buscarCategoria = async (termino = '', res = response ) => {

    const isMongoId = isValidObjectId( termino );

    if( isMongoId ) {
        const categoria = await Categoria.findById( termino );
        
        return res.json({
            results: (categoria) ? [categoria] : [],
        });
    }


    const regexp = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre: regexp, status: true });

    res.json({
        results: categorias
    });
}

const buscarProducto = async (termino = '', res = response) => {
    const isMongoId = isValidObjectId(termino);

    if( isMongoId ) {
        const producto = await Producto.findById( termino );

        return res.json({
            results: (producto) ? [ producto ] : [],
        });
    }

    const regexp = new RegExp( termino, 'i' );

    const productos = await Producto.find( { nombre: regexp, status: true } );

    res.json({
        results: productos,
    });
};

const buscarRol = async (termino = '', res = response) => {

    const isMongoId = isValidObjectId( termino );

    if( isMongoId ){
        const rol = await Role.findById( termino );
        
        return res.json( {
            results: ( rol ) ? [ rol ]: [],
        } );
    }

    const regexp = new RegExp( termino, 'i' );

    const roles = await Role.find( { rol: regexp  } );

    res.json({
        results: roles,
    });
}


const buscar = async (req, res=response) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${ coleccionesPermitidas }`,
        });
    };

    switch (coleccion) {
        case 'usuarios':
            await buscarUsuarios( termino, res );
            break;

        case 'categoria':
            await buscarCategoria( termino, res );
            break;

        case 'productos':
            await buscarProducto( termino, res );
            break;

        case 'roles':
            await buscarRol( termino, res );
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
            break;
    };

};


module.exports = {
    buscar
};