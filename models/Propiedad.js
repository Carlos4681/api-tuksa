//Propiedad.js
import mongoose from 'mongoose';

const propiedadSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo_inmueble: {
    type: String,
    enum: ['Apartamento', 'Casa', 'Oficina', 'Local', 'Lote', 'Finca']
  },
  estado_inmueble: {
    type: String,
    enum: ['Disponible', 'Vendido', 'Alquilado', 'Reservado', 'Inactivo'],
    default: 'Disponible'
  },
  precio_venta: {
    type: Number
  },
  precio_alquiler: {
    type: Number
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  ciudad: {
    type: String,
    required: true,
    trim: true
  },
  habitaciones: {
    type: Number
  },
  sanitarios: {
    type: Number
  },
  fotos: [{
    type: String
  }]
  
}, {
  timestamps: true
});

const Propiedad = mongoose.model('Propiedad', propiedadSchema);

export default Propiedad;