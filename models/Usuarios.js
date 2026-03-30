import mongoose from 'mongoose';

const usuariosSchema = new mongoose.Schema({
    email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
},
    nombre: {
    type: String,
    required: 'Ingresa tu nombre',
    trim: true
},
    password:{
        type: String,
        required: true
}

});

const Usuarios = mongoose.model('Usuarios', usuariosSchema);

export default Usuarios;