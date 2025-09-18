import Clientes from '../models/Clientes.js';

// ◙ Agregar nuevo cliente
const nuevoCliente = async (req, res, next) => {
  const cliente = new Clientes(req.body);
  try {
    await cliente.save();
    res.json({ mensaje: 'Se agregó un nuevo cliente ✅' });
  } catch (error) {
    // Verificar si el error es por clave duplicada (email único)
    if (error.code === 11000) {
      return res.status(400).json({ error: "El correo ya se encuentra registrado" });
    }
    console.log(error);
    next();
  }
};

// ◙ Mostrar todos los clientes
const mostrarClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.find({});
    res.json(clientes);
  } catch (error) {
    console.log(error);
    next();
  }
};

// ◙ Mostrar cliente por ID
const mostrarCliente = async (req, res, next) => {
  const cliente = await Clientes.findById(req.params.idCliente);

  if (!cliente) {
    res.json({ mensaje: 'El cliente requerido no existe 🔎' });
    return next();
  }

  res.json(cliente);
};

// ◙ Actualizar cliente por ID
const actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findOneAndUpdate(
      { _id: req.params.idCliente },
      req.body,
      { new: true, runValidators: true } // <-- runValidators asegura que se validen reglas del schema
    );
    
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json(cliente);

  } catch (error) {
    // Detectar error de correo duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado en otro cliente"
      });
    }

    console.log(error);
    res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    next(error);
  }
};



// ◙ Eliminar cliente por ID
const eliminarCliente = async (req, res, next) => {
  try {
    await Clientes.findByIdAndDelete({ _id: req.params.idCliente });
    res.json({ mensaje: 'Cliente eliminado🧹' });
  } catch (error) {
    console.log(error);
    next();
  }
};

// Exporta todas las funciones en un objeto como exportación por defecto
export default {
  nuevoCliente,
  mostrarClientes,
  mostrarCliente,
  actualizarCliente,
  eliminarCliente
};