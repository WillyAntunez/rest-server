const  { response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/googleVerify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo',
            });
        };

        // Verificar si el usuario esta activo en la DB
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password',
            });
        };
        
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync( JSON.stringify(password), usuario.password);

        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password',
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({correo});
        
        if( !usuario ) {
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );

            await usuario.save();
        };

        // Si el usuario en DB 
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        };

        // Generar JWT

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
        });
    };
};


module.exports = {
    login,
    googleSignIn,
}