//index.js
import express from 'express';
import routes from './routes/index.js';
import mongoose from 'mongoose';

//Cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
import cors from 'cors';


// Conectar a MongoDB
mongoose.connect('mongodb://localhost/tuksa')
  .then(() => {
    console.log('🎉 ¡MongoDB conectado exitosamente!');
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
  });

// Crear el servidor
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para datos de formularios (URL encoded)
app.use(express.urlencoded({ extended: true }));

//Habilitar Cors
app.use(cors({
  origin: 'http://localhost:5173' // URL de React
}));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('./uploads'));

// Rutas de la app
app.use('/api', routes);

// Puerto
app.listen(5000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:5000');
});






