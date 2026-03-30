// D:\proyectos\RESTAPI\controllers\interaccionController.js
import Interaccion from '../models/Interaccion.js';
import Clientes from '../models/Clientes.js'; // Necesario para verificar si el cliente existe
import Propiedad from '../models/Propiedad.js'; // Necesario para verificar si la propiedad existe


// --- CREAR UNA NUEVA INTERACCION ---
export const nuevaInteraccion = async (req, res, next) => {
  const { tipo, descripcion, resultado, cliente, propiedad, fechaVencimiento, fechaHora, completada } = req.body;

  if (!tipo || !cliente) {
    return res.status(400).json({ mensaje: 'El tipo de interacción y el cliente son obligatorios.' });
  }

  try {
    const clienteExistente = await Clientes.findById(cliente);
    if (!clienteExistente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }
  } catch (error) {
    return res.status(400).json({ mensaje: 'ID de cliente inválido.' });
  }

  if (propiedad) {
    try {
      const propiedadExistente = await Propiedad.findById(propiedad);
      if (!propiedadExistente) {
        return res.status(404).json({ mensaje: 'Propiedad no encontrada.' });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: 'ID de propiedad inválido.' });
    }
  }

  const interaccion = new Interaccion({
    tipo,
    fechaHora: fechaHora || new Date(), // Si no viene, usa fecha actual
    descripcion,
    resultado,
    cliente,
    propiedad,
    fechaVencimiento: tipo === 'Tarea' ? fechaVencimiento : undefined,
    completada: tipo === 'Tarea' ? (completada || false) : undefined,
  });

  try {
    await interaccion.save();
    res.status(201).json({ mensaje: 'Interacción agregada exitosamente', interaccion });
  } catch (error) {
    console.error('Error al crear interacción:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ mensaje: 'Datos de interacción inválidos.', detalles: error.message });
    }
    res.status(500).json({ mensaje: 'Hubo un error al agregar la interacción.' });
    next(error);
  }
};

// ◙ Mostrar todas las interacciones
const mostrarInteracciones = async (req, res, next) => {
  try {
    // Utilizamos .find({}) para obtener todos los documentos
    const interacciones = await Interaccion.find({})
      .populate('cliente', 'nombre apellido') // Incluimos info del cliente
      .populate('propiedad', 'titulo') // Incluimos info de la propiedad si existe
      .sort({ fechaHora: -1 }); // ⬅️ APLICAMOS EL ORDEN DESCENDENTE

    res.status(200).json(interacciones);
  } catch (error) {
    console.error('Error al obtener todas las interacciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener las interacciones.' });
    next(error);
  }
};


// --- OBTENER INTERACCIONES DE UN CLIENTE ESPECÍFICO ---
export const mostrarInteraccionesCliente = async (req, res, next) => {
  try {
    const { idCliente } = req.params;
    const interacciones = await Interaccion.find({ cliente: idCliente }).populate('propiedad').sort({ fechaHora: -1 });

    if (interacciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron interacciones para este cliente.' });
    }
    res.status(200).json(interacciones);
  } catch (error) {
    console.error('Error al obtener interacciones del cliente:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ mensaje: 'ID de cliente inválido.' });
    }
    res.status(500).json({ mensaje: 'Error al obtener interacciones.' });
    next(error);
  }
};

// --- Obtener Interacción por ID ---
export const mostrarInteraccion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interaccion = await Interaccion.findById(id)
      .populate('cliente')
      .populate('propiedad');

    if (!interaccion) {
      return res.status(404).json({ mensaje: 'Interacción no encontrada.' });
    }
    res.status(200).json(interaccion);
  } catch (error) {
    console.error('Error al obtener interacción por ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ mensaje: 'ID de interacción inválido.' });
    }
    res.status(500).json({ mensaje: 'Error al obtener la interacción.' });
    next(error);
  }
};

// --- Actualizar Interacción ---
export const actualizarInteraccion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cliente, propiedad } = req.body;

    if (cliente) {
        const clienteExistente = await Clientes.findById(cliente); // Usar 'Cliente'
        if (!clienteExistente) return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }
    if (propiedad) {
        const propiedadExistente = await Propiedad.findById(propiedad);
        if (!propiedadExistente) return res.status(404).json({ mensaje: 'Propiedad no encontrada.' });
    }

    const interaccionActualizada = await Interaccion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!interaccionActualizada) {
      return res.status(404).json({ mensaje: 'Interacción no encontrada.' });
    }

    res.status(200).json({ mensaje: 'Interacción actualizada exitosamente', interaccion: interaccionActualizada });
  } catch (error) {
    console.error('Error al actualizar interacción:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ mensaje: 'ID de interacción inválido.' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ mensaje: 'Datos de actualización inválidos.', detalles: error.message });
    }
    res.status(500).json({ mensaje: 'Error al actualizar la interacción.' });
    next(error);
  }
};

// --- Eliminar Interacción ---
export const eliminarInteraccion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interaccionEliminada = await Interaccion.findByIdAndDelete(id);

    if (!interaccionEliminada) {
      return res.status(404).json({ mensaje: 'Interacción no encontrada.' });
    }

    res.status(200).json({ mensaje: 'Interacción eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar interacción:', error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ mensaje: 'ID de interacción inválido.' });
    }
    res.status(500).json({ mensaje: 'Error al eliminar la interacción.' });
    next(error);
  }
};

// --- Obtener Tareas Pendientes y Vencidas ---
export const mostrarTareasPendientes = async (req, res, next) => {
  try {
    const ahora = new Date();

    const tareas = await Interaccion.find({
      tipo: 'Tarea',
      completada: false,
    })
      .populate('cliente', 'nombre email telefono')
      .populate('propiedad', 'titulo direccion ciudad')
      .sort({ fechaVencimiento: 1, fechaHora: 1 });

    if (tareas.length === 0) {
      return res.status(200).json({ mensaje: 'No hay tareas pendientes o vencidas por el momento.' });
    }

    const tareasPendientesActuales = [];
    const tareasVencidas = [];

    tareas.forEach(tarea => {
      if (tarea.fechaVencimiento && tarea.fechaVencimiento < ahora) {
        tareasVencidas.push(tarea);
      } else {
        tareasPendientesActuales.push(tarea);
      }
    });

    res.status(200).json({
      mensaje: 'Tareas obtenidas exitosamente.',
      tareasPendientes: tareasPendientesActuales,
      tareasVencidas: tareasVencidas,
    });
  } catch (error) {
    console.error('Error al obtener tareas pendientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener tareas pendientes o vencidas.' });
    next(error);
  }
};


export default {
 nuevaInteraccion,
 mostrarInteraccionesCliente,
 actualizarInteraccion,
 eliminarInteraccion,
 mostrarTareasPendientes,
 mostrarInteraccion, 
 mostrarInteracciones
};
