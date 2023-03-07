const Categoria = require("../models/categoria");

const obtenerCategorias = async ( req, res ) => {

    const { limite = '5', desde = '0' } = req.query; 

    const categoriasPromise = Categoria.find()
        .where({estado: true})
        .limit( limite )
        .skip( desde )
        .populate('usuario', 'nombre');

    const countPromise = Categoria.countDocuments()
        .where({estado: true});

    const [categorias, total] = await Promise.all( [categoriasPromise, countPromise] );

    res.json({
        total,
        categorias
    })

}


const obtenerCategoria = async (req, res) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    if( !categoria.estado ){
        return res.status(400).json({
            msg: 'La categoría no existe'
        })
    }

    res.json({
        categoria,
    })
};

const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`,
        });
    };

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
        categoria,
    });

};

const actualizarCategoria = async (req, res) => {

    const id = req.params.id;
    const nombre  = req.body.nombre.toUpperCase();

    const categoria = await Categoria.findById(id);
    
    if(!categoria.estado) {
        return res.status(400).json({
            msg: 'La categoria no existe',
        });
    };

    categoria.nombre = nombre;

    await categoria.save();

    res.json({
        categoria
    })

}

const borrarCategoria = async (req, res) => {

    const id = req.params.id;

    const categoria = await Categoria.findById(id);
    
    if(!categoria.estado) {
        return res.status(400).json({
            msg: 'La categoria no existe',
        });
    };

    categoria.estado = false;

    await categoria.save()

    res.json({
        categoria,
    })

}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
};