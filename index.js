//index.js
import express from 'express';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//Cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
import cors from 'cors';


// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🎉 ¡MongoDB conectado exitosamente!');
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
  });

// Crear el servidor
const app = express();

//Definir el dominio para recibir las peticiones
const whitelist= [process.env.FRONTEND_URL]
const corsOptions={
  origin: (origin, callback)=>{
    //Revisar si la petición viene de un servidor que está en whitelist
    const existe= whitelist.some(dominio=>dominio ===origin);
    if(existe){
      callback(null, true)
    }else{
      callback(new Error('No permitido por CORS'))
    }
  }
}

//Habilitar Cors
/*app.use(cors(
  corsOptions
));*/
app.use(cors());


// Middleware para parsear JSON
app.use(express.json());
// Middleware para datos de formularios (URL encoded)
app.use(express.urlencoded({ extended: true }));


// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('./uploads'));

app.get('/', (req, res) => {
  console.log('🔥 Entró a la raíz');
  res.send('API funcionando 🔥');
});


// Rutas de la app
app.use('/api', routes);

const host= process.env.HOST || '0.0.0.0'
// Puerto
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});






//git clean -fd node_modules/ esto es para borrar la carpeta de node_modules y no se suba al git
