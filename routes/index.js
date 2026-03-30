//routes/index.js
import express from 'express';
import clienteController from '../controllers/clienteController.js';
import propiedadesController from '../controllers/propiedadesController.js';
import  interaccionController from '../controllers/interaccionController.js';
import usuariosController from '../controllers/usuariosController.js';

//middleware para proteger rutas
import auth from '../middleware/auth.js'

const router = express.Router();

//RUTAS PUBLICAS
// --------------------------------Usuarios------------------------------------

router.post('/crear-cuenta',usuariosController.registrarUsuario)
router.post('/iniciar-sesion',usuariosController.autenticarUsuario)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// A PARTIR DE AQUÍ TODO REQUIERE AUTENTICACIÓN
router.use(auth);
// ---------------------------------CLIENTES------------------------------------
//Agregar nuevos clientes
router.post('/clientes', clienteController.nuevoCliente);

//Obtener todos los clientes
router.get('/clientes', clienteController.mostrarClientes);

//Mostrar cliente por ID
router.get('/clientes/:idCliente', clienteController.mostrarCliente);

//Actualizar cliente
router.put('/clientes/:idCliente', clienteController.actualizarCliente);

//Eliminar cliente
router.delete('/clientes/:idCliente', clienteController.eliminarCliente);


//-----------------------------------PROPIEDADES-------------------------------
//Agregar nuevas propiedades
router.post(
  '/propiedades',
  propiedadesController.subirArchivo,
  propiedadesController.nuevaPropiedad
);
//Mostrar toda las propiedades
router.get('/propiedades', propiedadesController.mostrarPropiedades);
//Mostrar las propiedades por su id
router.get('/propiedades/:idPropiedad', propiedadesController.mostrarPropiedad);

//Actualizar propiedades
router.put('/propiedades/:idPropiedad',
     propiedadesController.subirArchivo,propiedadesController.actualizarPropiedad ); 
//Eliminar propiedades
router.delete('/propiedades/:idPropiedad', propiedadesController.eliminarPropiedad);


// --------------------------------INTERACCIONES------------------------------------ 
//Obtener todos las interacciones
router.get('/interacciones', interaccionController.mostrarInteracciones);
// Crear una nueva interacción
router.post('/interacciones/nueva-interaccion', interaccionController.nuevaInteraccion);
// Obtener todas las interacciones para un cliente específico
router.get('/clientes/:idCliente/interacciones', interaccionController.mostrarInteraccionesCliente);
// Obtener todas las tareas pendientes/vencidas 
router.get('/interacciones/pendientes', interaccionController.mostrarTareasPendientes); 
// Obtener una interacción específica por ID
router.get('/interacciones/:id', interaccionController.mostrarInteraccion); 
// Actualizar una interacción
router.put('/interacciones/:id', interaccionController.actualizarInteraccion); 
// Eliminar una interacción
router.delete('/interacciones/:id', interaccionController.eliminarInteraccion); 




//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
export default router;





