// controllers/propiedadesController.js
import path from 'path';
import Propiedad from '../models/Propiedad.js';
import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';

// dirname en ESModules
const __dirname = path.resolve();
const uploadDirectory = path.join(__dirname, 'uploads', 'propiedades');


// ==========================
// 📂 Configuración de Multer
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads', 'propiedades');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const uniqueFilename = `${nanoid(10)}.${extension}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Máximo 5MB
  },
  fileFilter: (req, file, cb) => {
    const esValido =
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp' ||
      file.mimetype === 'image/gif';

    cb(esValido ? null : new Error('Tipo de archivo no válido. Solo JPEG, PNG, WebP o GIF.'), esValido);
  }
});

// ==========================
// 📥 Middleware para subir imágenes
// ==========================
const subirArchivo = (req, res, next) => {
  upload.array('fotos', 5)(req, res, function (error) {
    if (error) {
      return res.status(400).json({ mensaje: error.message });
    }
    next();
  });
};

// ==========================
// ➕ Crear nueva propiedad
// ==========================
const nuevaPropiedad = async (req, res, next) => {
  const propiedad = new Propiedad(req.body);

  try {
    if (req.files && req.files.length > 0) {
      propiedad.fotos = req.files.map(file => file.filename);
    }

    await propiedad.save();
    res.json({ mensaje: 'Se agregó una nueva propiedad 🏠' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ==========================
// 📋 Mostrar todas las propiedades
// ==========================
const mostrarPropiedades = async (req, res, next) => {
  try {
    const propiedades = await Propiedad.find({});
    res.json(propiedades);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ==========================
// 🔎 Mostrar una propiedad por ID
// ==========================
const mostrarPropiedad = async (req, res, next) => {
  try {
    const propiedad = await Propiedad.findById(req.params.idPropiedad);
    if (!propiedad) {
      return res.status(404).json({ mensaje: 'Esa propiedad no existe' });
    }
    res.json(propiedad);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


// ==========================
// ✏️ Actualizar propiedad (con manejo de imágenes y validación de límite)
// ==========================
const actualizarPropiedad = async (req, res, next) => {
  try {
    const propiedadExistente = await Propiedad.findById(req.params.idPropiedad);
    if (!propiedadExistente) {
      return res.status(404).json({ mensaje: "Propiedad no encontrada" });
    }

    let nuevaPropiedad = { ...req.body };
    let imagenesFinales = [];

    // 1. CONSERVAR imágenes que el frontend dice que mantengamos
    if (req.body.fotosExistentes) {
      imagenesFinales = Array.isArray(req.body.fotosExistentes) 
        ? [...req.body.fotosExistentes] 
        : [req.body.fotosExistentes];
    }
    
    // ⚠️ NUEVA VALIDACIÓN DE LÍMITE ⚠️
    const totalNuevasImagenes = req.files ? req.files.length : 0;
    const totalImagenesFinales = imagenesFinales.length + totalNuevasImagenes;

    if (totalImagenesFinales > 5) {
        return res.status(400).json({ mensaje: `No se puede superar el límite de 5 imágenes por propiedad. Intenta de nuevo.` });
    }
    
    // 2. Lógica para identificar y eliminar archivos huérfanos
    const imagenesAnteriores = propiedadExistente.fotos || [];
    const imagenesAEliminar = imagenesAnteriores.filter(
      (imagen) => !imagenesFinales.includes(imagen)
    );

    // Se eliminan los archivos del servidor
    for (const filename of imagenesAEliminar) {
      const rutaArchivo = path.join(uploadDirectory, filename);
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error(`Error al eliminar archivo: ${rutaArchivo}`, err);
        } else {
          //console.log(`Archivo eliminado con éxito: ${rutaArchivo}`);
        }
      });
    }

    // 3. AGREGAR nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      const nuevosFilenames = req.files.map(file => file.filename);
      imagenesFinales = [...imagenesFinales, ...nuevosFilenames];
    }

    // 4. ACTUALIZAR en base de datos
    nuevaPropiedad.fotos = imagenesFinales;

    const propiedadActualizada = await Propiedad.findOneAndUpdate(
      { _id: req.params.idPropiedad },
      { $set: nuevaPropiedad },
      { new: true }
    );

    res.json(propiedadActualizada);

  } catch (error) {
    console.error('Error actualizando propiedad:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


// ==========================
// 🗑️ Eliminar propiedad y sus imágenes
// ==========================
const eliminarPropiedad = async (req, res, next) => {
  try {
    const propiedad = await Propiedad.findById(req.params.idPropiedad);

    if (!propiedad) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
    }

    // ✅ Eliminar imágenes físicas con ruta absoluta
    if (propiedad.fotos && propiedad.fotos.length > 0) {
      for (const filename of propiedad.fotos) {
        const rutaArchivo = path.join(__dirname, 'uploads', 'propiedades', filename);
        fs.unlink(rutaArchivo, (err) => {
          if (err) {
            console.error(`⚠️ Error al eliminar archivo: ${rutaArchivo}`, err);
          } else {
            console.log(`🗑️ Archivo eliminado: ${rutaArchivo}`);
          }
        });
      }
    }

    await Propiedad.findByIdAndDelete(req.params.idPropiedad);

    res.json({ mensaje: 'Propiedad eliminada junto con sus imágenes 🧹' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export default {
  subirArchivo,
  nuevaPropiedad,
  mostrarPropiedades,
  mostrarPropiedad,
  actualizarPropiedad,
  eliminarPropiedad
};
