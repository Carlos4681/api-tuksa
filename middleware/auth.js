import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No autenticado, formato de token incorrecto' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const usuarioToken = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = usuarioToken;

        next(); //

    } catch (error) {
        //Log para saber por qué falla (Expirado, Alterado, etc.)
        console.error("Error al verificar JWT:", error.message);
        return res.status(401).json({ msg: 'Token inválido o expirado' });
    }
};

export default auth;