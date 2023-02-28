const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
// const { validationResult } = require('express-validator');

const usuariosGet = async (req, res) => {
    const { limite = 5, desde = 0 } = req.query;

    const query = {estado: true}

    const [count, usuarios] = await Promise.all([
        Usuario.countDocuments( query ), 
        Usuario.find( query )
        .skip( Number(desde) )
        .limit( Number(limite) )
    ]);

    res.json({
        count,
        usuarios,
    });
};

const usuariosPut = async (req, res) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos
    if( password ) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    };

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
};

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt );
    
    // Guardar en DB
    await usuario.save();

    res.json( usuario );
};

const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
};