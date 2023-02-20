const { response, request } = require('express');

const usuariosGet = (req, res) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        msg: 'get API - controlador',
        q, nombre, apikey
    });
};

const usuariosPut = (req, res) => {
    
    const id = req.params.id;

    console.log({id});

    res.json({
        msg: 'Put API - controlador',
    });
};

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body;
    
    res.json({
        msg: 'Post API - controlador',
        nombre,
        edad
    });
};

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'Delete API - controlador',
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
};