// D:\proyectos\RESTAPI\models\Interaccion.js
import mongoose from 'mongoose';

const interaccionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Llamada', 'Email', 'Reunion', 'Visita', 'Tarea'], // Tipos de interacción
    required: true,
    trim: true,
  },
  fechaHora: {
    type: Date,
    default: Date.now, // Por defecto, la fecha y hora actual
    required: true,
  },
  descripcion: {
    type: String,
    trim: true,
    required: function() { // Descripción es requerida a menos que sea solo una 'Visita'
      return this.tipo !== 'Visita';
    }
  },
  resultado: {
  type: String,
  enum: ['Exitosa', 'No contesta', 'Pendiente', 'Cancelada', 'Reprogramada'],
  trim: true
  },
  // Referencia al cliente con el que se tuvo la interacción
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clientes', //'Cliente' es el nombre del modelo de cliente
    required: true,
  },
  // Referencia opcional a una propiedad (si la interacción es sobre una propiedad específica)
  propiedad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Propiedad', //'Propiedad' es el nombre del modelo de propiedad
    required: false, // Una interacción no siempre es sobre una propiedad
  },
  // Campo específico para tareas (si la interacción es una tarea)
  fechaVencimiento: {
    type: Date,
    required: function() { return this.tipo === 'Tarea'; } // Requerido si el tipo es 'Tarea'
  },
  completada: {
    type: Boolean,
    default: false,
    required: function() { return this.tipo === 'Tarea'; } // Requerido si el tipo es 'Tarea'
  }
}, {
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});

const Interaccion = mongoose.model('Interaccion', interaccionSchema);

export default Interaccion;