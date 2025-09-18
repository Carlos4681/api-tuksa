//clientes.js
import mongoose from 'mongoose';

const clientesSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  tipo_cliente: {
    type: String,
    enum: ['Comprador', 'Arrendatario', 'Inversionista'],
    default: 'Comprador'
  },
  fuente: {
    type: String,
    trim: true,
    enum: ['Web', 'Instagram', 'Facebook', 'Referido', 'Google Ads', 'Evento', 'Otro'],
    default: 'Web'
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Cerrado'],
    default: 'Activo'
  },
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Clientes = mongoose.model('Clientes', clientesSchema);

export default Clientes;
