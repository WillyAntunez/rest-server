const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log('DB online')

    } catch (error) {

        console.log(error);
        throw new Error('Error al iniciar la base de datos.');

    };
};


module.exports = {
    dbConnection,
};