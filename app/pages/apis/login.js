import User from '../../models/User';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { username, password } = req.body;

  await dbConnect();

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Credenciales inválidas' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: 'Credenciales inválidas' });
  }

  // Generar el token JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // El token expira en 1 hora
  );

  res.status(200).json({ message: 'Login exitoso', token });
}
