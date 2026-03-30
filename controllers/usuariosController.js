import Usuarios from "../models/Usuarios.js"
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

const registrarUsuario= async(req, res)=>{
    const usuario = new Usuarios(req.body)
    usuario.password = await argon2.hash(req.body.password);
    
    try {
        await usuario.save();
        res.json({ msg: "Usuario registrado correctamente" });
    } catch (error) {
        console.log(error);
        res.json({msg: 'hubo un error'})
    }
};

const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuarios.findOne({ email });

  if (!usuario) {
    return res.status(401).json({ msg: 'El usuario no existe' });
  }

  // Verificar contraseña
  const passwordValido = await argon2.verify(
    usuario.password,
    password
  );

  if (!passwordValido) {
    return res.status(401).json({ msg: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: usuario._id },
    process.env.JWT_SECRET,
    { expiresIn: '10s' }
  );

  res.json({
    msg: 'Login correcto',
    token
  });
};

export default{
    registrarUsuario,
    autenticarUsuario
}