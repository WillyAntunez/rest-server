const Categoria = require("../models/categoria");
const Producto = require("../models/producto");


// Crear un producto - privado - cualquier persona con un token valido
const crearProducto = async (req, res) => {
    let {nombre, categoria, precio = 0, descripcion = '', disponible = true, } = req.body;
    nombre = nombre.toUpperCase();

    const uid = req.usuario._id;

    const data = {
        nombre,
        estado: true,
        usuario: uid,
        precio,
        categoria,
        descripcion,
        disponible,
    }

    data.nombre = data.nombre.toUpperCase();

    let producto = await Producto.findOne( { nombre } );

    if(producto){
        return res.status(400).json({
            msg: `Ya existe un producto con el nombre ${nombre}`
        });
    }

    producto = new Producto( data );
    
    try {
        await producto.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error interno del servidor, consulte al administrador',
        });    
    }

    res.json({
        producto,
    });
};

// obtener productos - paginado, populate, no borrado + count
const obtenerProductos = async (req, res) => {

    const { limite = '10', desde = '0' } = req.query;

    const productosPromise = Producto.find()
        .limit( limite )
        .skip( desde )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .where({ estado: true });

    const countPromise = Producto.countDocuments()
        .where({ estado: true });

    const [productos, total] = await Promise.all([
        productosPromise,
        countPromise,
    ])

    res.json({
        total,
        productos,
    });
}

// obtener producto por id
const obtenerProducto =  async (req, res) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    if( !producto.estado ){
        return res.status(400).json({
            msg: 'El producto no existe',
        });
    };

    res.json({
        producto,
    });
}


const actualizarProducto = async (req, res) => {

    let {nombre, categoria, precio = 0, descripcion = '', disponible = true, } = req.body;

    const id = req.params.id;

    let producto;

    if(nombre){
        nombre = nombre.toUpperCase();

        let producto = await Producto.findOne( { nombre } );
    
        if(producto && producto.id !== id){
            return res.status(400).json({
                msg: `Ya existe un producto con el nombre ${nombre}`
            });
        }
    }

    const data = {
        nombre,
        precio,
        categoria,
        descripcion,
        disponible,
    }

    producto = await Producto.findById( id );

    if(!producto.estado){
        return res.status(400).json({
            msg: `No existe un producto con el id: ${id}`,
        });
    }

    if(categoria && categoria !== producto.categoria){
        const categoriaDB = await Categoria.findById(categoria);

        if(!categoriaDB){
            return res.status(400).json({
                msg: 'La categoría que enviaste no existe',
            });
        }
    }else{
        data.categoria = producto.categoria;
    }

    producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        producto
    });
}

const borrarProducto = async (req, res) => {

    const id = req.params.id;

    const producto = await Producto.findById(id);

    if( !producto.estado ){
        return res.status(400).json({
            msg: 'El producto no existe',
        });
    };

    producto.estado = false;

    await producto.save();

    res.json({
        producto,
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
};
