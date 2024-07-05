import User from '../../models/User';
import dbConnect from '../../lib/dbConnect';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { username, password } = req.body;

  await dbConnect();

  // Comprobar si el usuario ya existe
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);

  // Crear un nuevo usuario
  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({ message: 'Usuario creado' });
}
